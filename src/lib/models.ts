export type JobLog = {
	id: string;
	userId: string;
	videoId: string;
	videoTitle: string;
	videoThumbnailUrl: string;
	videoSource: string;
	resultTranscript: string | null;
	resultQuiz: Quiz | null;
	utcCreatedAt: string;
	utcUpdatedAt: string;
};

export type Quiz = {
	questions: QuizQuestion[];
};

export type QuizQuestion = {
	order: number;
	questionText: string;
	answers: QuizAnswer[];
};

export type QuizAnswer = {
	answerText: string;
	isValid: boolean;
};
