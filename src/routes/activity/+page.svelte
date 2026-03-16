<script>
  let { data } = $props()

  const formatSince = (iso) =>
    iso &&
    new Date(iso).toLocaleDateString('nl-NL', {
      dateStyle: 'short'
    })
</script>

<h1>Activity</h1>

{#if data.error}
  <p style="color: red">Error loading activity: {data.error}</p>
{/if}

{#if data.since}
  <p>Activity since: {formatSince(data.since)}</p>
{/if}

{#if data.members.length === 0 && !data.error}
  <p>No activity data available.</p>
{:else if data.members.length > 0}
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Member</th>
        <th>Commits</th>
        <th>PR's</th>
        <th>Issues</th>
      </tr>
    </thead>
    <tbody>
      {#each data.members as member, index}
        <tr>
          <td>{index + 1}</td>
          <td>
            {#if member.avatar_url}
              <img
                src={member.avatar_url}
                alt={member.login}
                width="24"
                height="24"
              />
            {/if}
            {member.login}
          </td>
          <td>{member.commits ?? member.activityCount ?? 0}</td>
          <td>{member.pullRequests ?? 0}</td>
          <td>{member.issues ?? 0}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>
  table {
    width: fit-content;
    max-width: var(--max-width);
    border-collapse: collapse;
    margin: 1.5rem 0 3rem;
    font-size: .9rem;
    background: --blue;
    border-radius: var(--small-radius);
    overflow: hidden;
    border: 1px solid var(--blue);
  }

  thead {
    background-color: var(--accent-color-2);
  }

  thead th {
    padding: .5rem .75rem;
    text-align: left;
    border-bottom: 1px solid currentColor;
    white-space: nowrap;
  }

  tbody td {
    padding: .5rem .75rem;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
  tbody tr:nth-child(odd) {
    background-color: #fff;
  }

  tbody tr:nth-child(even) {
    background-color: #f7f7f7;
  }

  tbody tr:hover {
    background-color: var(--grey);
  }

  /* index column */
  td:first-child {
    width: 2.5rem;
  }

  /* member cell with avatar */
  td:nth-child(2) {
    display: flex;
    align-items: center;
    gap: .5rem;
  }

  td img {
    border-radius: 999px;
    border: 1px solid currentColor;
  }

  /* numbers right-aligned */
  td:nth-child(4),
  td:nth-child(5),
  td:nth-child(6) {
    font-variant-numeric: tabular-nums;
  }

  /* small-screen horizontal scroll if needed */
  @media (max-width: 40rem) {
    table {
      display: block;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
  }
</style>