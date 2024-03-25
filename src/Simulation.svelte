<script>
  import Machine from "./Machine.svelte";
  import DataTable from "./DataTable.svelte";
  import * as lib from "./machine.js";

  export let data;

  $: dataRow;
  $: machine;
  $: accuracy;

  const features = [];
  let classifyAs;
  data.properties.forEach((property) => {
    if (property.classifier) {
      classifyAs = property.features[0];
    } else {
      property.features.forEach((feature) => {
        const name =
          property.name == "" ? feature : `${property.name}=${feature}`;
        features.push(name);
        features.push(`¬${name}`);
      });
    }
  });
  let dataRow = 0;
  let machine = new lib.Machine(classifyAs, 5, features, 2, 1, 2);
  machine.setInputs(inputsFrom(dataRow));
  let accuracy = "N/A";

  function inputsFrom(row) {
    let newInputs = [];
    const entry = data.entries[row];
    for (let i = 0; i < entry.length - 1; i++) {
      newInputs[features[i * 2]] = entry[i];
      newInputs[features[i * 2 + 1]] = 1 - entry[i];
    }
    return newInputs;
  }

  function selectRow(selectedRow) {
    dataRow = selectedRow;
    machine = machine.setInputs(inputsFrom(dataRow));
  }

  function recognizeOrEraseFeedback() {
    machine.rules.forEach((r) => r.recognizeOrEraseFeedback());
    machine = machine;
  }

  function rejectFeedback() {
    machine.rules.forEach((r) => r.rejectFeedback());
    machine = machine;
  }

  let autoTrainer;
  let autoTrainerRuns;
  function autoTrain() {
    clearInterval(autoTrainer);
    selectRow(0);
    autoTrainerRuns = 10;
    accuracy = "...";
    autoTrainer = setInterval(autoTrainStep, 50);
  }

  function autoTrainStep() {
    trainOne();
    var newRow = (dataRow + 1) % data.entries.length;
    selectRow(newRow);
    if (newRow == 0) {
      if (--autoTrainerRuns <= 0) {
        clearInterval(autoTrainer);
        calcAccuracy();
      }
    }
  }

  function trainOne() {
    var entry = data.entries[dataRow];
    var entryIsClass = entry[entry.length - 1];
    machine = machine.train(entryIsClass);
  }

  function calcAccuracy() {
    const numEntries = data.entries.length;
    let correct = 0;
    for (let i = 0; i < numEntries; i++) {
      selectRow(i);
      var entry = data.entries[dataRow];
      var entryIsClass = Boolean(entry[entry.length - 1]);
      if (machine.classify == entryIsClass) {
        correct++;
      }
    }
    accuracy = `${Math.round((100 * correct) / numEntries)}%`;
  }
</script>

<main>
  <Machine state={machine}></Machine>
  <br />
  <button on:click={recognizeOrEraseFeedback}
    >Recognize or Erase Feedback</button
  >
  <button on:click={rejectFeedback}>Reject Feedback</button>
  <br />
  <button on:click={trainOne}>Train</button>
  <button on:click={autoTrain}>Train All</button>
  <span>Accuracy: {accuracy}</span>
  <DataTable {data} highlight={dataRow} onselect={selectRow}></DataTable>
</main>
