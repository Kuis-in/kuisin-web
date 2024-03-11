<script lang="ts">
	import { auth } from "$lib/firebase";
	import type { User } from "firebase/auth";
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";

    const currentUser = getContext<Writable<User | null | undefined>>('currentUser');

    function onLogout() {
        auth.signOut();
    }
</script>

<nav>
    <div>
        <a href="/" class="flex items-center">
            <img class="mr-3" src="/logo.svg" alt="logo" width="40" height="40" />
            <div class="text-2xl font-bold">Kuis<span class="text-primary">in</span></div>
        </a>
    </div>
    <div>
        {#if $currentUser}
            <div class="flex items-center">
                <!-- <div class="mr-3 text-right">
                    <div class="leading-none">{$currentUser.displayName}</div>
                    <button class="text-sm leading-none text-button" on:click={onLogout}>Keluar</button>
                </div> -->
                <img class="rounded-full" src="{$currentUser.photoURL}" alt="avatar" width="40" height="40" />
            </div>
        {/if}
    </div>
</nav>

<style lang="postcss">
    nav {
        @apply container py-5 flex justify-between items-center sticky top-0;
        backdrop-filter: blur(10px);
        z-index: 100;
    }
</style>