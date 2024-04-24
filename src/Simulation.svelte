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

  let autoTrainer;
  let autoTrainerRuns;
  let trainLoop;
  let selectedDataset = Object.keys(datasets)[0];
  let data = datasets[selectedDataset];
  let dataRow = 0;
  let accuracy = "N/A";

  $: data = datasets[selectedDataset];
  $: dataRow = Math.min(data.entries.length - 1, dataRow);
  $: $expectedOutput = Boolean($inputs[$inputs.length - 2]);
  $: {
    $features = [];
    data.properties.forEach((property) => {
      if (property.classifier) {
        $classify = property.features[0];
      } else {
        property.features.forEach((feature) => {
          const name =
            property.name == "" ? feature : `${property.name}=${feature}`;
          $features.push(name);
          $features.push(`¬${name}`);
        });
      }
    });
  }
  $: {
    $inputs = [];
    data.entries[dataRow].forEach((entry) => {
      $inputs.push(entry);
      $inputs.push(1 - entry);
    });
  }

  let correctClassifications = [];
  function autoTrain() {
    clearInterval(autoTrainer);
    dataRow = 0;
    correctClassifications = [];
    autoTrainerRuns = trainLoop.value;
    accuracy = "...";
    autoTrainer = setInterval(autoTrainStep, 100);
  }

  function autoTrainStep() {
    $machine.train();
    correctClassifications.push($machine.classify() == $expectedOutput ? 1 : 0);
    while (correctClassifications.length > data.entries.length)
      correctClassifications.shift();
    if (correctClassifications.length == data.entries.length) {
      const correctness =
        correctClassifications.reduce((x, y) => x + y) /
        correctClassifications.length;
      accuracy = `${Math.round(100 * correctness)}%`;
    }
    dataRow = (dataRow + 1) % data.entries.length;
    if (dataRow == 0 && --autoTrainerRuns <= 0) {
      clearInterval(autoTrainer);
    }
  }
</script>

<main>
  <div class="configurations">
    <Config {config}></Config>
    <div class="data">
      <div class="header">
        <label
          >Dataset: <select bind:value={selectedDataset}>
            {#each Object.keys(datasets) as dataset}
              <option value={dataset}>{dataset}</option>
            {/each}
          </select>
        </label>
      </div>
      <div class="content">
        <DataTable {data} highlight={dataRow} onselect={(i) => (dataRow = i)}
        ></DataTable>
        <button on:click={autoTrain}>Train on dataset</button>
        <label>x<input bind:this={trainLoop} type="number" value="5" /> </label>
        <div>Accuracy after training: {accuracy}</div>
      </div>
    </div>
  </div>
  <Machine machine={$machine} features={$features} inputs={$inputs} {config}
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
    align-items: flex-start;
    justify-content: center;
  }
</style>
