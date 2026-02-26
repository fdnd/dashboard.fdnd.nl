<script>
  let { selectedYear = $bindable() } = $props()

  function submit(event) {
    event.preventDefault()
  }
</script>

<form onsubmit={submit}>
  <label>
    <span class="sr-only">filter projects by year group:</span> 
    <select bind:value={selectedYear}>
      <option value="all">all projects</option>
      <option value="1">year 1 projects</option>
      <option value="2">year 2 projects</option>
    </select>
  </label>
</form>

<style>
  form {
    margin-top: 1.5rem;

    @media (min-width: 60rem) {
      margin-top: 0;
    }
  }
  label {
    font-size: .9rem;
  }
  select {
    padding:.25rem;
    font-family: inherit;
    color:currentColor
  }
</style>