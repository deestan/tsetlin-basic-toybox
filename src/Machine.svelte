<script>
  import Rule from "./Rule.svelte";
  export let machine;
  export let inputs;
  export let features;
  export let config;
</script>

<main>
  {#each machine.rules as rule}
    <Rule {rule} {inputs} {features} {config}></Rule>
  {/each}
</main>
