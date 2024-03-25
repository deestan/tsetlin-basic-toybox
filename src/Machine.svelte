<script>
  import Rule from "./Rule.svelte";
  export let state;
  $: rules = state.rules;
</script>

<main>
  {#each rules as rule}
    <Rule state={rule}></Rule>
  {/each}
</main>
