<script>
  import { pb } from "$lib/pocketbase.js";
  // @ts-nocheck

  export let data;
  export let form;
  let isFormVisible = false;
  let isFormVisibleUpdate = false;

  function toggleFormVisibility() {
    isFormVisible = !isFormVisible;
  }

  // @ts-ignore
  function closeForm(event) {
    if (event.target.classList.contains("overlay")) {
      isFormVisible = false;
    }
  }

  function toggleFormVisibilityUpdate() {
    isFormVisibleUpdate = !isFormVisibleUpdate;
  }
  // @ts-ignore
  function closeFormUpdate(event) {
    if (event.target.classList.contains("overlay")) {
      isFormVisibleUpdate = false;
    }
  }

  /**
   * @type {any}
   */
  let ageToUpdate;
  /**
   * @type {any}
   */
  let emailToUpdate;
  // @ts-ignore
  /**
   * @type {any}
   */
  let usernameToUpdate;
  /**
   * @type {string}
   */
  let Updateid;

  // @ts-ignore
  async function handleUpdateButtonClick(event) {
    toggleFormVisibilityUpdate();

    const id = event.target.form.id.value;

    try {
      const userToUpdate = await pb.collection("people").getOne(id);

      usernameToUpdate = userToUpdate.username;
      ageToUpdate = userToUpdate.age;
      emailToUpdate = userToUpdate.e_mail;
      Updateid = userToUpdate.id;
    } catch (error) {
      console.error(error);
    }
  }

  let searchQuery = "";
  // @ts-ignore
  /**
   * @type {any[]}
   */
  let searchResults = [];

  /**
   * @param {any} searchQuery
   */
  function handleSearch(searchQuery) {
    // Clear previous search results
    searchResults = [];

    // Perform new search
    searchResults = search(searchQuery);
  }

  // @ts-ignore
  function search(searchQuery) {
    searchQuery = searchQuery.toLowerCase(); // Convert searchQuery to lowercase for case-insensitive matching

    data.records.forEach((record) => {
      const { username, age, email, id } = record;

      // Check if any of the properties contain the search query
      if (
        username.toLowerCase().includes(searchQuery) ||
        String(age).includes(searchQuery) ||
        email.toLowerCase().includes(searchQuery)
      ) {
        // Create a new object with the matching values
        const matchingRecord = { username, age, email, id };

        // Add the matching object to the searchResults array
        searchResults.push(matchingRecord);
      }
    });

    console.log(searchResults);

    return searchResults;
  }
</script>

<div class="flex flex-col items-center justify-center align-middle my-6">
  <div class="py-3">
    <h4>
      You can add new entries using <button
        class="btn btn-outline btn-primary btn-xs"
        on:click={toggleFormVisibility}>Create</button
      >
    </h4>
  </div>
  <h4>{searchQuery}</h4>
  <div class="form-control py-6">
    <div class="input-group">
      <input
        bind:value={searchQuery}
        type="text"
        placeholder="Search…"
        class="input input-accent input-bordered input-sm"
      />
      <button
        class="btn btn-square btn-accent btn-sm"
        on:click={handleSearch(searchQuery)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          /></svg
        >
      </button>
    </div>
  </div>
  <div class="overflow-x-auto">
    <table class="table-md">
      <!-- head -->
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Email</th>
          <th>Delete</th>
          <th>Update</th>
        </tr>
      </thead>
      <tbody>
        {#if searchResults.length > 0}
          {#each searchResults as { username, age, email, id }}
            <tr>
              <td>{username}</td>
              <td>{age}</td>
              <td>{email}</td>
              <td>
                <form method="POST" action="?/delete">
                  <input type="text" name="id" hidden value={id} />
                  <button class="btn btn-outline btn-error btn-xs"
                    >delete</button
                  >
                </form>
              </td>
              <td>
                <form>
                  <input type="text" name="id" hidden value={id} />
                  <button
                    on:click|preventDefault={() =>
                      handleUpdateButtonClick(event)}
                    class="btn btn-outline btn-info btn-xs">update</button
                  >
                </form>
              </td>
            </tr>
          {/each}
        {:else}
          {#each data.records as { username, age, email, id }}
            <tr>
              <td>{username}</td>
              <td>{age}</td>
              <td>{email}</td>
              <td>
                <form method="POST" action="?/delete">
                  <input type="text" name="id" hidden value={id} />
                  <button class="btn btn-outline btn-error btn-xs"
                    >delete</button
                  >
                </form>
              </td>
              <td>
                <form>
                  <input type="text" name="id" hidden value={id} />
                  <button
                    on:click|preventDefault={() =>
                      handleUpdateButtonClick(event)}
                    class="btn btn-outline btn-info btn-xs">update</button
                  >
                </form>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>

{#if isFormVisible}
  <!-- Blurred Overlay -->
  <div
    class="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center overlay"
    on:click={closeForm}
  >
    <!-- Popup Form -->
    <div class="bg-none p-6 rounded shadow-lg">
      <form
        action="?/create"
        method="POST"
        class="flex flex-col h-60 justify-evenly"
      >
        <input
          name="username"
          type="text"
          placeholder="NAME"
          class="input input-xs input-accent input-bordered"
        />
        <input
          name="age"
          type="text"
          placeholder="AGE"
          class="input input-xs input-accent input-bordered"
        />
        <input
          name="email"
          type="text"
          placeholder="EMAIL"
          class="input input-xs input-accent input-bordered"
        />
        <div>
          <button type="submit" class="btn btn-xs btn-outline btn-success"
            >create</button
          >
        </div>
      </form>
    </div>
  </div>
{/if}

<!------------------------------------------------------------------------------------------------->

{#if isFormVisibleUpdate}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center overlay"
    on:click={closeFormUpdate}
  >
    <!-- Popup Form -->
    <div class="bg-none p-6 rounded shadow-lg">
      <form
        action="?/update"
        method="POST"
        class="flex flex-col h-60 justify-evenly"
      >
        <input
          name="username"
          type="text"
          placeholder="NAME"
          class="input input-xs input-accent input-bordered"
          value={usernameToUpdate}
        />
        <input
          name="age"
          type="text"
          placeholder="AGE"
          class="input input-xs input-accent input-bordered"
          value={ageToUpdate}
        />
        <input
          name="email"
          type="text"
          placeholder="EMAIL"
          class="input input-xs input-accent input-bordered"
          value={emailToUpdate}
        />
        <div>
          <input type="text" name="id" hidden value={Updateid} />
          <button type="submit" class="btn btn-outline btn-info btn-xs"
            >update</button
          >
        </div>
      </form>
    </div>
  </div>
{/if}

{#if form?.addedUser}
  <script>
    alert("added new user");
  </script>
{/if}
{#if form?.userDeleted}
  <script>
    alert("deleted user");
  </script>
{/if}
{#if form?.updatedUser}
  <script>
    alert("updated user");
  </script>
{/if}
