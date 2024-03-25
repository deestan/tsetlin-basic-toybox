<script>
  export let state;
  $: markers = createMarkers(state.radius);
  $: light = state.value < state.radius ? "light off" : "light on";
  $: valueMarkerPosition = `${((state.value + 0.5) / (state.radius * 2)) * 100}%`;
  function createMarkers(radius) {
    let markers = [];
    for (let i = 0; i < radius; i++) {
      markers.push({ index: i, class: "forgotten" });
    }
    for (let i = 0; i < radius; i++) {
      markers.push({ index: radius + i, class: "memorized" });
    }
    return markers;
  }
</script>

<main>
  <div class="automaton">
    <table>
      <tr>
        {#each markers as marker}
          <td class={marker.class}></td>
        {/each}
      </tr>
    </table>
    <span class="value-marker" style="left: {valueMarkerPosition}"></span>
  </div>
  &ZeroWidthSpace;
  <div class={light}></div>
</main>

<style>
  main {
    display: inline-block;
  }
  .automaton {
    display: inline-block;
    position: relative;
    vertical-align: middle;
  }
  table {
    height: 6px;
    border-spacing: 1px;
    margin-right: -1px;
  }
  .value-marker {
    border-left: 2px solid black;
    position: absolute;
    top: 0;
    bottom: 0;
    transition: 200ms;
  }
  td {
    width: 5px;
    margin: 0;
    padding: 0;
  }
  .forgotten {
    background-color: #ddd;
  }
  .memorized {
    background-color: #aaa;
  }
  .light {
    vertical-align: middle;
    margin-left: 2px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    display: inline-block;
    transition: 200ms;
  }
  .on {
    background-color: limegreen;
    border: 1px solid rgb(44, 177, 44);
    border-bottom: 1px solid rgb(44, 177, 44);
  }
  .off {
    border: 1px solid lightcoral;
    border-bottom: 1px solid rgb(180, 96, 96);
  }
</style>
