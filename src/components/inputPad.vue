<template>
    <v-row no-gutters>
        <v-col cols="12">
            <v-text-field
                v-model="inputText"
                label="Ingresar número"
                readonly
                dense
                outlined
                append-inner-icon="mdi-backspace-outline"
                @click:append-inner=deleteText
                :disabled="!isEditing"
            />
        </v-col>
    </v-row>
    <v-container>
        <v-row  class="gap-1 justify-center">
            <v-col  cols="3" class="pa-1">
                <v-btn
                    v-for="(btn, index) in buttonLayout" 
                    :key="index"
                    @click="handleClick(btn)"
                    :disabled="!isEditing"
                    outline
                >
                    <v-icon v-if="btn.startsWith('mdi')">{{ btn }}</v-icon>
                    <span v-else>{{ btn }}</span>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
    <v-icon>mdi-check-circle-outline</v-icon>
</template>

<script setup lang="ts">
import { BackspaceOutlined } from '@mui/icons-material';
import { ref } from 'vue';

const inputText = ref('');
const confirmedValueMoney = ref<number | null>(null);
const isEditing = ref(false);
const checkIcon = "mdi-check-circle-outline";
const backspaceIcon = "mdi-backspace-outline";
const buttonLayout = ref([
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    "00", "0", "mdi-check-circle-outline",
]);



const handleClick = (value: string) => {
    if (value === checkIcon) {
        confirmValue();
    } else {
        inputText.value += value;
    }
};

const confirmValue = () => {
    if (inputText.value) {
        confirmedValueMoney.value = parseFloat(inputText.value) || 0;
        inputText.value = "";
        isEditing.value = false;
    }
};

const deleteText = () => {
    inputText.value = inputText.value.slice(0, -1);
};

const startEditing = () => {
    isEditing.value = true;
};
</script>

<style scoped lang="ts">

</style>