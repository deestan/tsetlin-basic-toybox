<script>
  import Automaton from "./Automaton.svelte";
  export let rule;
  export let inputs;
  export let features;
  export let config;
  $: voteClass = rule.vote() > 0 ? "vote yes" : "vote no";
  $: liveStates = features.map((feature, idx) => {
    return {
      feature,
      automaton: rule.automatons[idx],
      input: inputs[idx],
      output: rule.automatons[idx].implies(inputs[idx]),
    };
  });
</script>

<main>
  <table>
    {#each liveStates as { feature, automaton, input, output }}
      <tr>
        <td class="label">{feature}</td>
        <td><Automaton {automaton} {config}></Automaton></td>
        <td>⇒</td>
        <td>{input}</td>
        <td>=</td>
        <td>{output}</td>
      </tr>
    {/each}
    <tr class={voteClass}>
      <td class="sum" colspan="4"><b>{rule.name()}</b></td>
      <td class="sumval" colspan="2"><b>{rule.vote()}</b></td>
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
  .sumval {
    text-align: right;
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
