<script>
  import Automaton from "./Automaton.svelte";
  export let state;
  $: voteClass = state.vote ? "vote yes" : "vote no";
  $: automatons = state.automatons;
</script>

<main>
  <table>
    {#each state.features as feature}
      <tr>
        <td class="label">{feature}</td>
        <td><Automaton state={automatons[feature]}></Automaton></td>
        <td>⇒</td>
        <td>{state.inputs[feature]}</td>
        <td>=</td>
        <td>{state.outputTerms[feature]}</td>
      </tr>
    {/each}
    <tr class={voteClass}>
      <td class="sum" colspan="5"><b>{state.forClass}</b></td>
      <td><b>{state.vote}</b></td>
    </tr>
  </table>
</main>

<style>
  main {
    display: inline-block;
    font-size: 10px;
  }
  table {
    border-spacing: 0;
  }
  .label {
    text-align: right;
  }
  .sum {
    text-align: center;
  }
  .vote {
    transition: 200ms;
  }
  td:last-child {
    padding-right: 2px;
  }
  .yes {
    background-color: rgb(192, 210, 192);
  }
  .no {
    background-color: rgb(235, 204, 204);
  }
</style>
