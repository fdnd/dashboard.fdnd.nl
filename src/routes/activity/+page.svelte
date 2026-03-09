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
        <th>Login</th>
        <th>Total commits</th>
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
          <td>{member.login}</td>
          <td>{member.activityCount ?? 0}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}