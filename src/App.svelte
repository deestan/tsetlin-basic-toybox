<script>
  import DataTable from "./DataTable.svelte";
  import Simulation from "./Simulation.svelte";
  import * as sample from "./sampleData.js";
</script>

<main>
  <Simulation></Simulation>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
