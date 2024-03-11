<script>
    // @ts-ignore
    import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import { onMount } from 'svelte';
	import { lottieAnimations } from '$lib/constants';

    let clientMounted = false;

    onMount(() => {
        clientMounted = true;
    })
</script>

{#if clientMounted}
    <LottiePlayer src={lottieAnimations.loading} autoplay="{true}" loop="{true}" width={40} height={40} />
{/if}