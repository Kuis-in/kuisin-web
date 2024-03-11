<script lang="ts">
    import "../app.css";
    import Navbar from "$lib/components/Navbar.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { onMount, setContext } from "svelte";
	import { auth } from "$lib/firebase";
	import { writable } from "svelte/store";
	import type { User } from "firebase/auth";
    import { setCookie } from 'typescript-cookie';

    const currentUser = writable<User | null | undefined>();
    setContext('currentUser', currentUser);

    onMount(() => {
        const authStateCallback = auth.onAuthStateChanged((user) => {
            currentUser.set(user);
        });
        const idTokenCallback = auth.onIdTokenChanged(async (user) => {
            const newToken = await user?.getIdTokenResult();
            setCookie('act', newToken?.token ?? "", {
                path: '/',
                expires: Date.parse(newToken?.expirationTime ?? '0'),
            });
        });
        return () => {
            authStateCallback();
            idTokenCallback();
        };
    });
</script>

<Navbar />

<div class="container pt-4 pb-24 lg:pt-10">
    <slot />
</div>

<Footer />