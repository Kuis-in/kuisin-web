import { api } from '$lib/constants';
import type { JobLog } from '$lib/models';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const accessToken = cookies.get('act');
	const res = await fetch(api.jobs, {
		method: 'GET',
		headers: accessToken ? { Authorization: 'Bearer ' + accessToken } : undefined
	});
	if (res.status !== 200) return { jobs: [] };
	const jobs = (await res.json()) as Array<JobLog>;
	return { jobs };
};
