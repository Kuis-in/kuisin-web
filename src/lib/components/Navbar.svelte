<script lang="ts">
	import { loginWithGoogle } from "$lib/auth";
	import { auth } from "$lib/firebase";
	import type { User } from "firebase/auth";
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";
    // @ts-ignore
    import { Icon } from 'svelte-fontawesome';
	import { faArrowRightFromBracket, faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
	import { goto } from "$app/navigation";

    const currentUser = getContext<Writable<User | null | undefined>>('currentUser');

    function onLogin() {
        loginWithGoogle();
    }

    async function goToHistory() {
        goto("/jobs");
    }

    async function onLogout() {
        await auth.signOut();
        goto("/");
    }
</script>

<nav>
    <div>
        <div>
            <a href="/" class="flex items-center">
                <img class="mr-3" src="/logo.svg" alt="logo" width="40" height="40" />
                <div class="text-2xl font-bold">Kuis<span class="text-primary">in</span></div>
            </a>
        </div>
        <div>
            {#if $currentUser}
                <div class="flex items-center">
                    <button class="text-button" on:click={goToHistory} title="Riwayat">
                        <Icon icon={faClockRotateLeft} class="mr-5 text-xl mb-0.5" />
                    </button>
                    <button class="text-button" on:click={onLogout} title="Keluar">
                        <Icon icon={faArrowRightFromBracket} class="mr-5 text-xl mb-0.5" />
                    </button>
                    <img class="rounded-full" src="{$currentUser.photoURL}" alt="avatar" width="36" height="36" />
                </div>
            {:else }
                <button class="primary-button" on:click={onLogin} disabled={typeof($currentUser) == 'undefined'}>Masuk</button>
            {/if}
        </div>
    </div>
</nav>

<style lang="postcss">
    nav {
        @apply sticky top-0;
        backdrop-filter: blur(50px);
        z-index: 100;
    }
    nav > div {
        @apply container py-5 flex justify-between items-center;
    }
</style>