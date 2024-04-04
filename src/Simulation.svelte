<script>
  import Machine from "./Machine.svelte";
  import DataTable from "./DataTable.svelte";
  import Config from "./Config.svelte";
  import {
    machine,
    features,
    inputs,
    expectedOutput,
    config,
    classify,
  } from "./state.js";
  import { datasets } from "./sampleData.js";

  let trainLoop;

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

  let selectedDataset = Object.keys(datasets)[0];
  let data = datasets[selectedDataset];
  $features = featuresFromData(data);
  let dataRow = 0;
  let accuracy = "N/A";
  selectRow(dataRow);

  $: data = datasets[selectedDataset];
  $: $features = featuresFromData(data);

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

  let autoTrainer;
  let autoTrainerRuns;
  function autoTrain() {
    clearInterval(autoTrainer);
    selectRow(0);
    autoTrainerRuns = trainLoop.value;
    accuracy = "...";
    autoTrainer = setInterval(autoTrainStep, 50);
  }

  function autoTrainStep() {
    $machine.train();
    var newRow = (dataRow + 1) % data.entries.length;
    selectRow(newRow);
    if (newRow == 0) {
      if (--autoTrainerRuns <= 0) {
        clearInterval(autoTrainer);
        calcAccuracy();
      }
    }
  }

  function selectDataset(event) {
    selectedDataset = event.target.value;
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
  <div class="configurations">
    <Config {config}></Config>
    <div class="data">
      <div class="header">
        <label
          >Dataset: <select on:change={selectDataset}>
            {#each Object.keys(datasets) as dataset}
              <option value={dataset}>{dataset}</option>
            {/each}
          </select>
        </label>
      </div>
      <div class="content">
        <DataTable {data} highlight={dataRow} onselect={selectRow}></DataTable>
        <button on:click={autoTrain}>Train on dataset</button>
        <label>x<input bind:this={trainLoop} type="number" value="5" /> </label>
        <div>Accuracy after training: {accuracy}</div>
      </div>
    </div>
  </div>
  <Machine
    machine={$machine}
    features={$features}
    inputs={$inputs}
    config={$config}
  ></Machine>
</main>

<style>
  input {
    width: 50px;
  }
  .data {
    margin: 0 10px;
    display: inline-block;
    border: 2px solid #aaa;
    display: inline-block;
    text-align: left;
  }
  .data .header {
    background-color: #aaa;
    padding: 2px 10px;
    margin-bottom: 5px;
  }
  .data .content {
    padding: 2px;
  }
  .data .content button {
    margin-bottom: 2px;
  }
  .configurations {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: center;
  }
</style>
