<script>
  import Machine from "./Machine.svelte";
  import DataTable from "./DataTable.svelte";
  import {
    machine,
    features,
    inputs,
    expectedOutput,
    config,
    classify,
  } from "./machine.js";

  export let data;

  $: dataRow;
  $: accuracy;

  function featuresFromData(data) {
    const features = [];
    data.properties.forEach((property) => {
      if (property.classifier) {
        $classify = property.features[0];
      } else {
        property.features.forEach((feature) => {
          const name =
            property.name == "" ? feature : `${property.name}=${feature}`;
          features.push(name);
          features.push(`¬${name}`);
        });
      }
    });
    return features;
  }

  $features = featuresFromData(data);
  let dataRow = 0;
  let accuracy = "N/A";
  selectRow(dataRow);

  function inputsFrom(row) {
    let newInputs = [];
    data.entries[row].forEach((entry) => {
      newInputs.push(entry);
      newInputs.push(1 - entry);
    });
    return newInputs;
  }

  function selectRow(selectedRow) {
    dataRow = selectedRow;
    $inputs = inputsFrom(dataRow);
    $expectedOutput = Boolean($inputs[$inputs.length - 2]);
  }

  function recognizeOrEraseFeedback() {
    $machine.rules.forEach((r) => r.recognizeOrEraseFeedback());
  }

  function rejectFeedback() {
    $machine.rules.forEach((r) => r.rejectFeedback());
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
    $machine.train();
  }

  function calcAccuracy() {
    const numEntries = data.entries.length;
    let correct = 0;
    for (let i = 0; i < numEntries; i++) {
      selectRow(i);
      if ($machine.classify() == $expectedOutput) {
        correct++;
      }
    }
    accuracy = `${Math.round((100 * correct) / numEntries)}%`;
  }
</script>

<main>
  <Machine
    machine={$machine}
    features={$features}
    inputs={$inputs}
    config={$config}
  ></Machine>
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
