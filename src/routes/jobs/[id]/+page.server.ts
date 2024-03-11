import { api } from '$lib/constants';
import type { JobLog } from '$lib/models';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch, cookies }) => {
	const accessToken = cookies.get('act');
	const res = await fetch(api.jobDetail(params.id), {
		method: 'GET',
		headers: accessToken ? { Authorization: 'Bearer ' + accessToken } : undefined
	});
	const job = (await res.json()) as JobLog;
	return { job };
};
