<script>
  import Rule from "./Rule.svelte";
  export let machine;
  export let inputs;
  export let features;
  export let config;
  const voteThreshold = config.voteThreshold;

  function classDescription(machine) {
    const votedClass = machine.votedClass();
    if (votedClass == null) {
      return "Input could not be classified";
    }
    return `Input classified as ${votedClass}`;
  }
  function classStyle(machine) {
    if (machine.votedClass() == null) {
      return "";
    }
    return machine.classify() ? "classify-positive" : "classify-negative";
  }
  $: votes = machine.vote();
  $: classifiedAs = classDescription(machine);
  $: classificationStyleClass = classStyle(machine);
</script>

<main class={classificationStyleClass}>
  <div class="summary">
    {classifiedAs} (votes: {votes}, threshold: {$voteThreshold})
  </div>
  {#each machine.rules as rule}
    <Rule {rule} {inputs} {features} {config}></Rule>
  {/each}
</main>

<style>
  main {
    margin-top: 5px;
  }
  .summary {
    background: #aaa;
  }
  .classify-positive .summary {
    background-color: rgb(192, 210, 192);
  }
  .classify-negative .summary {
    background-color: rgb(235, 204, 204);
  }
  main {
    border: 2px solid #aaa;
  }
  main.classify-positive {
    border-color: rgb(192, 210, 192);
  }
  main.classify-negative {
    background-color: rgb(235, 204, 204);
  }
</style>
