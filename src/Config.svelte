<script>
    export let config;
    let voteThresholdInput;
    function setDepth(event) {
        $config.machineRadius = Math.max(1, Math.floor(event.target.value / 2));
        event.target.value = $config.machineRadius;
    }
    function setMemorizationProbability(event) {
        $config.memorizeProbability = event.target.value;
    }
    function setForgetProbability(event) {
        $config.memorizeProbability = event.target.value;
    }
    function setNumPositiveRules(event) {
        $config.numPositiveRules = Math.floor(event.target.value);
        capVoteThreshold();
    }
    function setNumNegativeRules(event) {
        $config.numNegativeRules = Math.floor(event.target.value);
        capVoteThreshold();
    }
    function setVoteThreshold(event) {
        $config.voteThreshold = Math.floor(event.target.value);
        capVoteThreshold();
    }
    function capVoteThreshold() {
        const max = Math.max(
            $config.numNegativeRules,
            $config.numPositiveRules,
        );
        $config.voteThreshold = Math.min(max, $config.voteThreshold);
        voteThresholdInput.value = $config.voteThreshold;
    }
</script>

<main>
    <div class="title">Configuration</div>
    <table>
        <tr
            ><td>
                <label
                    >Automaton depth<input
                        value={$config.machineRadius * 2}
                        type="number"
                        step="2"
                        min="2"
                        max="50"
                        on:change={setDepth}
                    />
                </label>
            </td></tr
        >
        <tr
            ><td>
                <label
                    >Memorization probability<input
                        value={$config.memorizeProbability}
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        on:change={setMemorizationProbability}
                    />
                </label>
            </td></tr
        >
        <tr
            ><td>
                <label
                    >Forget probability<input
                        value={$config.forgetProbability}
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        on:change={setForgetProbability}
                    />
                </label>
            </td></tr
        >
        <tr
            ><td>
                <label
                    >Positive rules<input
                        value={$config.numPositiveRules}
                        type="number"
                        step="1"
                        min="1"
                        on:change={setNumPositiveRules}
                    />
                </label>
            </td></tr
        >
        <tr
            ><td>
                <label
                    >Negative rules<input
                        value={$config.numNegativeRules}
                        type="number"
                        step="1"
                        min="0"
                        on:change={setNumNegativeRules}
                    />
                </label>
            </td></tr
        >
        <tr
            ><td>
                <label
                    >Classify vote threshold<input
                        value={$config.voteThreshold}
                        type="number"
                        step="1"
                        min="0"
                        on:change={setVoteThreshold}
                        bind:this={voteThresholdInput}
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
