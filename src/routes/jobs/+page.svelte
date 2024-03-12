<script context="module">
    import "dayjs/locale/id";
    import dayjs from "dayjs";
    dayjs.locale("id");
</script>

<script lang="ts">
    import { page } from '$app/stores';
	import type { JobLog } from '$lib/models';
	import JobItem from '$lib/components/JobItem.svelte';

    let jobs = $page.data.jobs as Array<JobLog>;
</script>

<main>
    <h1 class="mb-4 text-2xl font-bold lg:text-4xl">Riwayat</h1>
    <div class="grid gap-2 lg:gap-4 lg:grid-cols-2">
        {#each jobs as job}
            <JobItem job={job} />
        {/each}
    </div>
</main>