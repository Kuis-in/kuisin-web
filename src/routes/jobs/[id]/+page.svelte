<script lang="ts">
    import { page } from '$app/stores';
	import type { JobLog, QuizQuestion } from '$lib/models';
	import { onMount } from 'svelte';
	import { api } from '$lib/constants';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
	import { auth } from '$lib/firebase';
    // @ts-ignore
    import { Icon } from 'svelte-fontawesome';
	import { faCopy } from '@fortawesome/free-solid-svg-icons';

    let jobDetail = $page.data.job as (JobLog | null);
    let latestTranscriptStatusMsg = "Mohon tunggu...";
    let latestQuizStatusMsg = "Mohon tunggu...";
    let isQuizJsonViewMode = false;

    let jobLiveStatusHub: HubConnection;

    onMount(() => {
        setLoadingStatusMessage();

        jobLiveStatusHub = new HubConnectionBuilder()
            .withUrl(api.jobLiveStatusNegotiate, { accessTokenFactory: () => auth.currentUser!.getIdToken() })
            .withAutomaticReconnect()
            .build();

        jobLiveStatusHub.on("JobStatusUpdated", (data: JobLog) => {
            jobDetail = data;
            if (jobDetail.resultQuiz != null && jobDetail.resultTranscript != null) {
                jobLiveStatusHub.stop();
            } else {
                setLoadingStatusMessage();
            }
        });

        if (jobDetail != null && (jobDetail.resultQuiz == null || jobDetail.resultTranscript == null)) {
            auth.authStateReady().then(() => {
                jobLiveStatusHub.start()
                    .then(() => {
                        jobLiveStatusHub.invoke("ListenOnJob", $page.params.id);
                    })
                    .catch((e) => {
                        console.error(e);
                    });
            });
        }

        return () => {
            jobLiveStatusHub.stop();
        }
    })

    function getVideoUrl(): string {
        if (jobDetail == null) return "";
        if (jobDetail.videoSource === "YouTube") {
            return `https://www.youtube.com/watch?v=${jobDetail.videoId}`;
        }
        return "";
    }

    function getQuizQuestions(): QuizQuestion[] {
        if (jobDetail?.resultQuiz == null) return [];
        return jobDetail?.resultQuiz.questions ?? [];
    }

    function onQuizViewModeChanged(event: Event & { currentTarget: EventTarget & HTMLSelectElement; }) {
        isQuizJsonViewMode = event.currentTarget.value === "json";
    }

    function setLoadingStatusMessage() {
        if (jobDetail == null) return;
        if (jobDetail.resultTranscript == null) {
            latestTranscriptStatusMsg = "Membuat transkrip...";
        } else if (jobDetail.resultQuiz == null) {
            latestQuizStatusMsg = "Membuat quiz berdasarkan transkrip...";
        }
    }

    async function onTranscriptCopyToClipboard() {
        if (jobDetail?.resultTranscript) {
            try {
                await navigator.clipboard.writeText(jobDetail.resultTranscript);
                alert("Transkrip berhasil disalin ke clipboard!");
            } catch (e) {
                alert(`Gagal menyalin ke clipboard!: ${e}`);
            }
        }
    }

    async function onQuizCopyToClipboard() {
        if (jobDetail?.resultQuiz) {
            try {
                if (isQuizJsonViewMode) {
                    await navigator.clipboard.writeText(JSON.stringify(jobDetail.resultQuiz, null, 2));
                } else {
                    var range = document.createRange();
                    range.selectNode(document.getElementById("quizResultContainer")!);
                    window.getSelection()?.removeAllRanges();
                    window.getSelection()?.addRange(range);
                    document.execCommand("copy");
                    window.getSelection()?.removeAllRanges();
                }
                alert("Quiz berhasil disalin ke clipboard!");
            } catch (e) {
                alert(`Gagal menyalin ke clipboard!: ${e}`);
            }
        }
    }
</script>

<main>
    <div class="flex flex-col items-center md:flex-row">
        <img src="{jobDetail?.videoThumbnailUrl}" alt="{jobDetail?.videoTitle}" class="video-thumbnail">
        <div class="text-center md:text-start">
            <h1 class="text-2xl font-bold lg:text-4xl">{jobDetail?.videoTitle}</h1>
            <a href="{getVideoUrl()}" class="link" target="_blank">Lihat Video ></a>
        </div>
    </div>
    <div class="md:grid md:gap-8 md:grid-cols-2">
        <div>
            <div class="section-header">
                <div class="text-xl font-semibold">Transkrip</div>
                {#if jobDetail?.resultTranscript}
                    <button class="text-button" on:click={onTranscriptCopyToClipboard} title="Salin ke clipboard">
                        <!-- Salin ke clipboard -->
                        <Icon icon={faCopy} class="mb-0.5 text-xl" />
                    </button>
                {/if}
            </div>
            <div class="mb-10 result-container">
                {#if jobDetail?.resultTranscript}
                    {jobDetail?.resultTranscript}
                {:else}
                    <div class="flex items-center justify-center">
                        <LoadingIndicator />
                        <div class="ml-1">{latestTranscriptStatusMsg}</div>
                    </div>
                {/if}
            </div>
            
        </div>
        <div>
            <div class="section-header">
                <div class="text-xl font-semibold">Quiz</div>
                {#if jobDetail?.resultQuiz}
                    <div class="flex items-center">
                        <button class="mr-4 text-button" on:click={onQuizCopyToClipboard} title="Salin ke clipboard">
                            <!-- Salin ke clipboard -->
                            <Icon icon={faCopy} class="mb-0.5 text-xl" />
                        </button>
                        <select on:change={onQuizViewModeChanged} class="py-0 my-0">
                            <option value="text">Teks</option>
                            <option value="json">JSON</option>
                        </select>
                    </div>
                {/if}
            </div>
            <div id="quizResultContainer" class="flex flex-col result-container">
                {#if jobDetail?.resultQuiz}
                    {#if isQuizJsonViewMode}
                        <pre>{JSON.stringify(jobDetail.resultQuiz, null, 2)}</pre>
                    {:else}
                        {#each getQuizQuestions() as qq, qqi}
                            <div class="mb-4">
                                <div class="mb-2">{qqi + 1}. {qq.questionText}</div>
                                <div class="ml-4">
                                    {#each qq.answers as qa, qai}
                                        <div class="mb-1" class:font-semibold={qa.isValid} class:text-primary={qa.isValid}>
                                            ({String.fromCharCode(qai + 65)}) {qa.answerText}
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/each}
                    {/if}
                {:else}
                    <div class="flex items-center justify-center">
                        <LoadingIndicator />
                        <div class="ml-1">{latestQuizStatusMsg}</div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</main>

<style lang="postcss">
    .result-container {
        @apply md:p-5 p-4 border border-[#3C434F] rounded-lg overflow-auto;
    }
    .video-thumbnail {
        @apply md:mr-8 mb-4 md:mb-0;
        height: 100px;
    }
    .section-header {
        @apply flex items-center justify-between pb-3 pt-10;
        background-color: #040e1f;
        position: sticky;
        top: 50px;
    }
</style>