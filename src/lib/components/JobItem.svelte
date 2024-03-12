<script lang="ts">
    // @ts-ignore
    import { Icon } from 'svelte-fontawesome';
	import { faCheckCircle, faClock, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
    import Time from "svelte-time";
    import type { JobLog } from '$lib/models';
	import { goto } from '$app/navigation';

    export let job: JobLog;

    function onClick() {
        goto("/jobs/" + job.id);
    }
</script>

<button class="job-item" on:click={onClick}>
    <div class="flex items-center">
        <img src="{job.videoThumbnailUrl}" alt="{job.videoTitle}" class="video-thumbnail">
        <div>
            <Time relative timestamp={job.utcUpdatedAt} class="text-sm" />
            <h3 class="font-bold text-md md:text-xl">{job.videoTitle}</h3>
        </div>
    </div>
    <div 
        class="ml-5" 
        class:text-green-400={job.status == "D"} 
        class:text-red-400={job.status == "F"}
        class:text-orange-400={job.status == "O"} 
    >
        {#if job.status == "D"}
            <Icon icon={faCheckCircle} class="mb-0.5 text-xl" />
        {:else if job.status == "F"}
            <Icon icon={faExclamationCircle} class="mb-0.5 text-xl" />
        {:else}
            <Icon icon={faClock} class="mb-0.5 text-xl" />
        {/if}
    </div>
</button>

<style lang="postcss">
    .video-thumbnail {
        @apply mr-4 hidden md:block;
        height: 80px;
    }
    .job-item {
        @apply p-4 border border-[#3C434F] rounded-lg flex justify-between items-center text-start;
    }
</style>