<!--
Diagnosis App - Vue Entry Point Component.
-->
<template>
    <PageResult v-if="status.isShowResult" :result-data="status.resultData"></PageResult>
    <PageDiagnosis v-else @show-result="showResult"></PageDiagnosis>
</template>

<script setup>

import PageDiagnosis from './PageDiagnosis.vue'
import PageResult from './PageResult.vue'
import {onBeforeMount, reactive} from "vue";

const status = reactive({
    resultData: null,
    isShowResult: false,
})

onBeforeMount(() => {
    const url = new URL(window.location.href);

    if (url.pathname.includes('result')) {
        status.isShowResult = true;
    }
})

/**
 * @param resultData
 */
const showResult = (resultData) => {
    window.history.pushState({}, '', '');
    status.resultData = resultData;
    status.isShowResult = true;
}

</script>