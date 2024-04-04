import Writeable from './store.js';

export const config = {
  machineRadius: new Writeable(5),
  memorizeProbability: new Writeable(0.1),
  forgetProbability: new Writeable(0.9),
  numPositiveRules: new Writeable(2),
  numNegativeRules: new Writeable(1),
  voteThreshold: new Writeable(2)
};
export const features = new Writeable([]);
export const inputs = new Writeable([]);
export const classify = new Writeable("not set");
export const expectedOutput = new Writeable(false);
export const machine = new Writeable();

function machineChanged() {
  machine.set(machine.val);
}

export class Automaton {
  constructor() {
    this.value = config.machineRadius.val - 1;
  }

  enabled() {
    return 1 * (this.value >= config.machineRadius.val);
  }

  implies(value) {
    if (this.enabled()) return 1 * value;
    return 1;
  }

  memorize(overrideProbability) {
    if (Math.random() < (overrideProbability == undefined ? config.memorizeProbability.val : overrideProbability)) {
      this.value = Math.min(config.machineRadius.val * 2 - 1, this.value + 1);
      machineChanged();
    }
  }

  forget() {
    if (Math.random() < config.forgetProbability.val) {
      this.value = Math.max(0, this.value - 1);
      machineChanged();
    }
  }
}

export class Rule {
  constructor(isPositive) {
    this.isPositive = isPositive;
    this.automatons = features.val.map(_ => new Automaton());
  }

  name() {
    return this.isPositive ? classify.val : `¬${classify.val}`;
  }

  outputTerms() {
    return this.automatons.map((automaton, idx) => automaton.implies(inputs.val[idx]));
  }

  vote() {
    return (this.isPositive ? 1 : -1) * this.outputTerms().reduce((x, y) => x * y);
  }

  recognizeOrEraseFeedback() {
    this.automatons.forEach((automaton, idx) => {
      if (this.vote()) {
        // recognize
        if (inputs.val[idx]) {
          automaton.memorize(1.0);
        } else {
          automaton.forget();
        }
      } else {
        // erase feedback
        automaton.forget();
      }
    });
  }

  rejectFeedback() {
    this.automatons.forEach((automaton, idx) => {
      if (!automaton.enabled() && !inputs.val[idx]) {
        automaton.memorize(1.0);
      }
    });
  }
}

export class Machine {
  constructor() {
    this.rules = [];
    for (let i = 0; i < config.numPositiveRules.val; i++) {
      this.rules.push(new Rule(true));
    }
    for (let i = 0; i < config.numNegativeRules.val; i++) {
      this.rules.push(new Rule(false));
    }
  }

  votedClass() {
    if (this.vote() == config.voteThreshold.val) {
      return classify.val;
    } else if (this.vote() == -config.voteThreshold.val) {
      return `¬${classify.val}`;
    }
    return null;
  }

  vote() {
    return Math.max(-config.voteThreshold.val, Math.min(config.voteThreshold.val,
      this.rules.map(rule => rule.vote()).reduce((acc, vote) => acc + vote)
    ));
  }

  classify() {
    return this.vote() == config.voteThreshold.val;
  }

  train() {
    const feedbackThreshold =
      (config.voteThreshold.val - this.vote() * (expectedOutput.val ? 1 : -1)) /
      (config.voteThreshold.val * 2);
    function trainRule(rule) {
      if (Math.random() < feedbackThreshold) {
        if (rule.isPositive == expectedOutput.val) {
          rule.recognizeOrEraseFeedback();
        } else if (rule.vote()) {
          rule.rejectFeedback();
        }
      }
    }
    this.rules.forEach(rule => trainRule(rule));
  }
}

features.subscribe(_ => machine.set(new Machine()));
classify.subscribe(_ => machine.set(new Machine()));
config.machineRadius.subscribe(_ => machine.set(new Machine()));
config.numPositiveRules.subscribe(_ => machine.set(new Machine()));
config.numNegativeRules.subscribe(_ => machine.set(new Machine()));
inputs.subscribe(machineChanged);
