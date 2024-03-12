import { PUBLIC_API_BASE_URL } from '$env/static/public';

export const lottieAnimations = {
	loading: '/animations/loading-process.json'
};

export const api = {
	jobs: `${PUBLIC_API_BASE_URL}/jobs`,
	jobDetail: (id: string) => `${PUBLIC_API_BASE_URL}/jobs/${id}`,
	jobLiveStatusNegotiate: `${PUBLIC_API_BASE_URL}/jobs/live-status-ws`
};
