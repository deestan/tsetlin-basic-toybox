<script>
  export let data;
  export let highlight = -1;
  export let onselect = () => {};

  function calculateColumns(properties) {
    let columns = [{ header: "#", class: "index border-right" }];
    for (const property of properties) {
      for (const feature of property.features) {
        columns.push({ header: feature, class: "feature" });
      }
      columns[columns.length - 1].class += " border-right";
    }
    columns[columns.length - 1].class = "classification feature";
    return columns;
  }

  $: columns = calculateColumns(data.properties);
</script>

<main>
  <table>
    <tr class="properties">
      <th></th>
      {#each data.properties as property}
        <th colspan={property.features.length}>{property.name}</th>
      {/each}
    </tr>
    <tr class="features">
      {#each columns as column}
        <th class={column.class}>
          {column.header}
        </th>
      {/each}
    </tr>
    {#each data.entries as entry, index}
      <tr
        class={index == highlight ? "highlight data" : "data"}
        on:click={() => onselect(index)}
      >
        <td class="border-right">{index + 1}.</td>
        {#each entry as value, i}
          <td class={columns[i + 1].class}>{"·∎"[value]}</td>
        {/each}
      </tr>
    {/each}
  </table>
</main>

<style>
  table {
    display: inline-block;
    border-spacing: 0;
    font-size: 12px;
    text-align: center;
  }

  th {
    padding: 0 6px;
  }

  tr.data {
    cursor: pointer;
  }

  tr.data:hover {
    background-color: #f8f8f8;
  }

  tr.highlight {
    background-color: #ddd;
  }

  tr.highlight:hover {
    background-color: #ccc;
  }

  tr.properties th {
    font-style: italic;
    font-weight: lighter;
  }

  tr.features th {
    font-style: normal;
    font-weight: normal;
  }

  tr.features th.feature {
    font-weight: bold;
  }

  tr.features th.classification {
    font-style: italic;
  }

  tr.features th {
    border-bottom: 1px solid black;
  }

  tr .border-right {
    border-right: 1px solid black;
  }

  tr.properties * {
    border-right: none;
  }
</style>
