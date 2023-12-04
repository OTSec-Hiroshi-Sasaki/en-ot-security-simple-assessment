<!--
Diagnosis App - Diagnosis Page
-->
<template>
    <Loading v-if="status.isShowLoading" @finished-animation="loadingAfterEvent"></Loading>
    <Diagnosis v-else @finished-diagnosis="getDiagnosedData"></Diagnosis>
</template>

<script setup>

import Diagnosis from './Diagnosis.vue'
import Loading from './Loading.vue'
import {onMounted, reactive} from "vue";

const status = reactive({
    diagnosedData: null,
    isShowLoading: false,
})

const emits = defineEmits(
    ['show-result']
)

/**
 * @param answeredData
 */
const getDiagnosedData = (answeredData) => {
    status.diagnosedData = answeredData;
    showLoading();
    window.scrollTo({top: 0, behavior: 'smooth'});
}

const showLoading = () => {
    status.isShowLoading = true;
}

const loadingAfterEvent = () => {
    window.history.replaceState('', '', status.diagnosedData['result_url'].slice(status.diagnosedData['result_url'].indexOf("result/")));
    emits('show-result', status.diagnosedData);
}

</script>