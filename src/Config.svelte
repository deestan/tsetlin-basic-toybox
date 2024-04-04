<script>
    export let config;
    const depth = config.machineRadius;
    const memorizeProbability = config.memorizeProbability;
    const forgetProbability = config.forgetProbability;
    const voteThreshold = config.voteThreshold;
    const numPositiveRules = config.numPositiveRules;
    const numNegativeRules = config.numNegativeRules;
    function capVoteThreshold() {
        const max = Math.max($numNegativeRules, $numPositiveRules);
        $voteThreshold = Math.min(max, $voteThreshold);
    }
</script>

<main>
    <div class="title">Configuration</div>
    <table>
        <tr
            ><td>
                <label
                    >Automaton depth<input
                        bind:value={$depth}
                        type="number"
                        min="1"
                        max="25"
                    />
                </label>
            </td></tr
        >
        <tr
            ><td>
                <label
                    >Memorization probability<input
                        bind:value={$memorizeProbability}
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                    />
                </label>
            </td></tr
        >
        <tr
            ><td>
                <label
                    >Forget probability<input
                        bind:value={$forgetProbability}
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                    />
                </label>
            </td></tr
        >
        <tr
            ><td>
                <label
                    >Positive rules<input
                        bind:value={$numPositiveRules}
                        type="number"
                        step="1"
                        min="1"
                        on:change={capVoteThreshold}
                    />
                </label>
            </td></tr
        >
        <tr
            ><td>
                <label
                    >Negative rules<input
                        bind:value={$numNegativeRules}
                        type="number"
                        step="1"
                        min="0"
                        on:change={capVoteThreshold}
                    />
                </label>
            </td></tr
        >
        <tr
            ><td>
                <label
                    >Classify vote threshold<input
                        bind:value={$voteThreshold}
                        type="number"
                        step="1"
                        min="0"
                        on:change={capVoteThreshold}
                    />
                </label>
            </td></tr
        >
    </table>
</main>

<style>
    td {
        text-align: right;
    }
    input {
        margin-left: 5px;
        width: 50px;
    }
    main {
        border: 2px solid #aaa;
        display: inline-block;
    }
    .title {
        background-color: #aaa;
        padding: 2px 10px;
    }
</style>
