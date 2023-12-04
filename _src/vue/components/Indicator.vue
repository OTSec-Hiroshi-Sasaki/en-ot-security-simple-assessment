<!--
Diagnosis App - Question Step Indicator
-->
<template>
    <div class="indicator">
        <div :class="`indicator_item ${(currentStep >= 1) ? 'isActive' : ''} ${(currentStep === 1) ? 'isCurrent' : ''}`">
            <p class="indicator_itemText">Step<span>1</span></p>
            <div class="indicator_itemCircle"></div>
        </div>
        <div :class="`indicator_item ${(currentStep >= 2) ? 'isActive' : ''} ${(currentStep === 2) ? 'isCurrent' : ''}`">
            <p class="indicator_itemText">Step<span>2</span></p>
            <div class="indicator_itemCircle"></div>
        </div>
        <div :class="`indicator_item ${(currentStep >= 3) ? 'isActive' : ''} ${(currentStep === 3) ? 'isCurrent' : ''}`">
            <p class="indicator_itemText">Step<span>3</span></p>
            <div class="indicator_itemCircle"></div>
        </div>
        <div :class="`indicator_item ${(currentStep >= 4) ? 'isActive' : ''} ${(currentStep === 4) ? 'isCurrent' : ''}`">
            <p class="indicator_itemText">Step<span>4</span></p>
            <div class="indicator_itemCircle"></div>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    currentStep: {type: Number, default: 1},
})

</script>