<script lang="ts">
	import { getContext, onMount } from 'svelte';
    // @ts-ignore
    import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import type { Writable } from 'svelte/store';
	import type { User } from 'firebase/auth';
	import { loginWithGoogle } from '$lib/auth';
	import { goto } from '$app/navigation';
    // @ts-ignore
    import { Icon } from 'svelte-fontawesome';
    import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
	import { api } from '$lib/constants';
	import { auth } from '$lib/firebase';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';

    const stepAnimDimension = 180;
    let clientMounted = false;
    let submitting = false;

    const currentUser = getContext<Writable<User | null | undefined>>('currentUser');

    onMount(() => {
		clientMounted = true;
	});

    async function handleSubmit(event: SubmitEvent) {
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const videoUrl = formData.get("videoUrl")?.toString();
        const videoId = videoUrl?.match(/(?<=v=)[\w-]+/)?.[0];
        const numberOfQuestions = Number.parseInt(formData.get("numberOfQuestions")!.toString());
        const quizLanguage = formData.get("quizLanguage")?.toString();
        const wordingStyle = formData.get("wordingStyle")?.toString();

        submitting = true;

        try {
            if ($currentUser == null) await loginWithGoogle();
            const res = await fetch(api.postJob, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + await auth.currentUser?.getIdToken(),
                },
                body: JSON.stringify({ videoId, numberOfQuestions, quizLanguage, wordingStyle }),
            });
            const result: { id: string } = await res.json();
            goto("/jobs/" + result.id);
        } catch (e) {
            console.error(e);
            submitting = false;
        }
    }
</script>

<div class="flex flex-col items-center">
    <h1 class="text-2xl font-bold lg:text-4xl">Buat quiz dari video YouTube!</h1>
    <div class="flex flex-row items-center justify-start w-full my-12 overflow-auto xl:justify-center md:flex-row">
        <div class="step-container">
            {#if clientMounted}
                <LottiePlayer
                    src="/animations/no-videos.json"
                    autoplay="{true}"
                    loop="{true}"
                    controls="{false}"
                    height="{stepAnimDimension}"
                    width="{stepAnimDimension}"
                />
            {:else}
                <div class="icon-placeholder"></div>
            {/if}
            <div>Cari videonya</div>
        </div>
        <Icon icon={faAnglesRight} class="forward-icon" />
        <div class="step-container">
            {#if clientMounted}
                <LottiePlayer
                    src="/animations/processing.json"
                    autoplay="{true}"
                    loop="{true}"
                    controls="{false}"
                    height="{stepAnimDimension}"
                    width="{stepAnimDimension}"
                />
            {:else}
                <div class="icon-placeholder"></div>
            {/if}
            <div>Masukin linknya</div>
        </div>
        <Icon icon={faAnglesRight} class="forward-icon" />
        <div class="step-container">
            {#if clientMounted}
                <LottiePlayer
                    src="/animations/process-completed.json"
                    autoplay="{true}"
                    loop="{true}"
                    controls="{false}"
                    height="{stepAnimDimension}"
                    width="{stepAnimDimension}"
                />
            {:else}
                <div class="icon-placeholder"></div>
            {/if}
            <div>Tungguin hasilnya</div>
        </div>
    </div>
    <form class="w-full max-w-4xl" on:submit|preventDefault={handleSubmit}>
        <div class="flex flex-col items-center justify-center mb-5 md:flex-row">
            <div class="w-full mb-2 mr-2 md:mb-0">
                <div>YouTube URL</div>
                <input 
                    class="w-full"
                    name="videoUrl" 
                    type="text" 
                    required
                    placeholder="https://www.youtube.com/watch?v=lXfEK8G8CUI" 
                    pattern="https:\/\/www\.youtube\.com\/watch\?v=.+"
                    on:input={(e) => {
                        const input = e.currentTarget;
                        const validityState = e.currentTarget?.validity;
                        if (validityState.valueMissing) {
                            input?.setCustomValidity("Link YouTube harus diisi");
                        } else if (validityState.patternMismatch) {
                            input?.setCustomValidity("Link YouTube harus dalam format https://www.youtube.com/watch?v=XXX");
                        } else {
                            input?.setCustomValidity("");
                        }
                        input?.reportValidity();
                    }}
                />
            </div>
            <div class="w-full mb-2 mr-2 md:w-5/12 md:mb-0">
                <div># Pertanyaan</div>
                <input 
                    class="w-full" 
                    name="numberOfQuestions" 
                    type="number" 
                    required
                    placeholder="5"
                    min="5"
                    max="10"
                    aria-valuemin="5"
                    aria-valuemax="10"
                    value="5"
                    on:input={(e) => {
                        const input = e.currentTarget;
                        const validityState = e.currentTarget?.validity;
                        if (validityState.valueMissing) {
                            input?.setCustomValidity("Jumlah pertanyaan harus diisi");
                        } else if (validityState.rangeUnderflow) {
                            input?.setCustomValidity("Jumlah pertanyaan minimal 5");
                        } else if (validityState.rangeOverflow) {
                            input?.setCustomValidity("Jumlah pertanyaan maksimal 10");
                        } else {
                            input?.setCustomValidity("");
                        }
                        input?.reportValidity();
                    }}
                />
            </div>
            <div class="w-full mb-2 mr-2 md:w-auto md:mb-0">
                <div>Bahasa Quiz</div>
                <select name="quizLanguage" class="w-full md:w-auto">
                    <option value="ID">Bahasa Indonesia</option>
                    <option value="EN">English</option>
                </select>
            </div>
            <div class="w-full mr-2 md:w-auto">
                <div>Gaya Bahasa</div>
                <select name="wordingStyle" class="w-full md:w-auto">
                    <option value="Formal">Formal</option>
                    <option value="Funny">Gaul</option>
                </select>
            </div>
        </div>
        <div class="flex items-center justify-center">
            <button type="submit" disabled={submitting || typeof($currentUser) == 'undefined'}>
                {#if submitting}
                    <LoadingIndicator />
                {:else}
                    Coba Sekarang
                {/if}
            </button>
        </div>
    </form>
</div>

<style lang="postcss">
    .step-container {
        transition: border-color 0.2s ease-in-out;
        @apply p-8 border-primary border-2 rounded-lg flex flex-col items-center justify-center hover:border-secondary text-center;
    }
    .step-container .icon-placeholder {
        @apply mb-5 font-semibold;
        width: 200px;
        height: 200px;
    }
    :global(.forward-icon) {
        @apply mx-4 text-secondary;
        font-size: 80px;
    }
    @media (max-width: 768px) {
        :global(.forward-icon) {
            @apply my-4 text-secondary;
            font-size: 40px;
        }
    }
</style>