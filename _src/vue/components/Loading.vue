<!--
Diagnosis App - Loading before displaying results
-->
<template>
    <div class="loading">
        <div class="loading_inner">
            <div class="loading_wrap">
                <p class="loading_title">Building report</p>
                <div class="loading_bar">
                    <div class="loading_progress" ref="loadingProgress"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import {ref, onMounted} from "vue";

const emits = defineEmits(
    ['finished-animation']
)

const loadingProgress = ref();

onMounted(() => {
    loadingProgress.value.addEventListener("animationend", () => {
        emits('finished-animation');
    })
})

</script>