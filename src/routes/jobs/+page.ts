import { browser } from '$app/environment';
import { api } from '$lib/constants';
import { auth } from '$lib/firebase';
import type { JobLog } from '$lib/models';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, data }) => {
	if (!browser || data.jobs != null) return data;

	await auth.authStateReady();
	const res = await fetch(api.jobs, {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + (await auth.currentUser?.getIdToken())
		}
	});

	if (res.status !== 200) return { jobs: null };
	const jobs = (await res.json()) as Array<JobLog>;
	return { jobs };
};
