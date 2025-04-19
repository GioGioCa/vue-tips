<template>
    <h5 class="text-orange">Total propinas</h5>
    <v-text-field
        :readonly="!isEditing"
        label="Propinas"
        v-model="confirmedValueMoney"
        variant="solo"
        class="text-orange bg-orange-accent-1 font-bold rounded-lg text-center"
        :append-icon="isEditing ? 'mdi-close' : 'mdi-pencil'"
        @click:append="toggleEdit"
    />
</template>

<script setup lang="ts">
import {ref} from "vue";

const isEditing = ref(false);
const inputText = ref('');
const toggleEdit = () => {
    isEditing.value = !isEditing.value;
    if (!isEditing.value) {
        inputText.value = "";
    }
};
</script>

<style scoped lang="ts">

</style>