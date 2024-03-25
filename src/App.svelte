<script>
  import DataTable from "./DataTable.svelte";
  import Simulation from "./Simulation.svelte";
  import * as sample from "./sampleData.js";
</script>

<main>
  <Simulation data={sample.landerRocketUp}></Simulation>
  <h1>Test data</h1>
  <h2>Cars</h2>
  <DataTable data={sample.car}></DataTable>
  <h2>Cancer data</h2>
  <DataTable data={sample.cancer}></DataTable>
  <h2>Rocket Fire Vertical</h2>
  <DataTable data={sample.landerRocketUp}></DataTable>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1,
  h2 {
    color: #ff3e00;
    text-transform: uppercase;
    font-weight: 100;
  }

  h1 {
    font-size: 4em;
  }

  h2 {
    font-size: 2em;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
