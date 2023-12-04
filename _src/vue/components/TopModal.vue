<!--
Diagnosis App - Start Modal
-->
<template>
    <transition name="fade" appear>
        <div v-if="status.isShow" class=" c-modal startModal">
            <div class="startModal_inner">
                <div class="startModal_box">
                    <p class="startModal_boxHead">The assessment has been developed in accordance with the checklist items in Appendix E of "The Cyber/Physical Security Framework for Factory Systems".</p>
                    <div class="startModal_boxBody">
                        <div class="startModal_textArea">
                            <div class="startModal_titleWrap">
                                <h1 class="startModal_title">OT security simple assessment</h1>
                                <p class="startModal_copy">Find out what measures you need now <br class="pc">from your own analysis!</p>
                            </div>
                            <button class="startModal_startBtn" @click="onClickHideModal"><span>START</span></button>
                        </div>
                        <picture class="startModal_image">
                            <source media="(max-width:767px)" srcset="/images/diagnosis/startModal_image_sp.png" sizes="100vw">
                            <img src="/images/diagnosis/startModal_image.png" alt="Get the report right after your input!">
                        </picture>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script setup>

import {reactive} from "vue";

const status = reactive({
    isShow: true,
})

const onClickHideModal = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
    status.isShow = false;
}

</script>