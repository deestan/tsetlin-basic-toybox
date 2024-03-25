export class Automaton {
  constructor(radius) {
    this.radius = radius;
    this.value = radius - 1;
    this.enabled = false;
    this.memorizeChance = 0.1;
    this.forgetChance = 1.0 - this.memorizeChance;
  }

  randomize() {
    // Tend to lower values
    this.value =
      this.radius * 2 -
      1 -
      Math.floor(Math.sqrt(Math.random() * Math.pow(this.radius * 2, 2)));
    this.enabled = this.value >= this.radius;
  }

  memorize(overrideChance) {
    const chance =
      overrideChance == undefined ? this.memorizeChance : overrideChance;
    if (Math.random() < chance) {
      this.value = Math.min(this.radius * 2 - 1, this.value + 1);
    }
    this.enabled = this.value >= this.radius;
  }

  forget() {
    if (Math.random() < this.forgetChance) {
      this.value = Math.max(0, this.value - 1);
    }
    this.enabled = this.value >= this.radius;
  }

  implies(value) {
    if (this.enabled) return value;
    return 1;
  }
}

export class Rule {
  constructor(forClass, radius, features) {
    this.forClass = forClass;
    this.radius = radius;
    this.features = features;
    this.inputs = {};
    this.automatons = {};
    this.outputTerms = {};
    for (const feature of features) {
      this.automatons[feature] = new Automaton(radius);
      this.outputTerms[feature] = 0;
    }
    this.vote = 0;
    this.calculate();
  }

  recognizeOrEraseFeedback() {
    for (const feature of this.features) {
      const automaton = this.automatons[feature];
      if (this.vote) {
        // recognize
        if (this.inputs[feature]) {
          automaton.memorize(1.0);
        } else {
          automaton.forget();
        }
      } else {
        // erase feedback
        automaton.forget();
      }
    }
    return this.calculate();
  }

  rejectFeedback() {
    for (const feature of this.features) {
      const automaton = this.automatons[feature];
      if (!automaton.enabled && !this.inputs[feature]) {
        automaton.memorize(1.0);
      }
    }
    return this.calculate();
  }

  randomize() {
    Object.values(this.automatons).forEach((a) => a.randomize());
    this.calculate();
    return this;
  }

  setInputs(inputs) {
    this.inputs = inputs;
    return this.calculate();
  }

  calculate() {
    for (const feature of this.features) {
      this.outputTerms[feature] = this.automatons[feature].implies(
        this.inputs[feature] || 0
      );
    }
    this.vote = Object.values(this.outputTerms).reduce((x, y) => x * y);
    return this;
  }
}

export class Machine {
  constructor(
    forClass,
    radius,
    features,
    numPositiveRules,
    numNegativeRules,
    voteThreshold
  ) {
    this.forClass = forClass;
    this.radius = radius;
    this.features = features;
    this.inputs = {};
    this.numPositiveRules = numPositiveRules;
    this.numNegativeRules = numNegativeRules;
    this.voteThreshold = voteThreshold;
    this.vote = 0;
    this.classify = false;
    this.rules = [];
    for (let i = 0; i < numPositiveRules; i++) {
      this.rules.push(new Rule(forClass, radius, features));
    }
    for (let i = 0; i < numNegativeRules; i++) {
      this.rules.push(new Rule(`¬${forClass}`, radius, features));
    }
    this.calculate();
  }

  setInputs(inputs) {
    this.inputs = inputs;
    this.rules.forEach((rule) => rule.setInputs(inputs));
    return this.calculate();
  }

  calculate() {
    this.vote = 0;
    for (let i = 0; i < this.rules.length; i++) {
      const ruleSign = i < this.numPositiveRules ? 1 : -1;
      this.vote += this.rules[i].vote * ruleSign;
    }
    this.vote = Math.max(
      -this.voteThreshold,
      Math.min(this.voteThreshold, this.vote)
    );
    this.classify = this.vote > 0;
    return this;
  }

  train(isClass) {
    const feedbackThreshold =
      (this.voteThreshold - this.vote * (isClass ? 1 : -1)) /
      (this.voteThreshold * 2);
    for (let i = 0; i < this.rules.length; i++) {
      const rule = this.rules[i];
      const ruleShouldVote =
        Boolean(isClass) == Boolean(i < this.numPositiveRules);
      if (Math.random() < feedbackThreshold) {
        if (ruleShouldVote) {
          rule.recognizeOrEraseFeedback();
        } else {
          if (rule.vote) {
            rule.rejectFeedback();
          }
        }
      }
      rule.calculate();
    }
    return this.calculate();
  }
}
