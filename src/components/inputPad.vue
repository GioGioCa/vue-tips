<template>
    <v-container  class="align-center">
        <!-- Campo visual para mostrar el número -->
        <v-text-field v-model="inputText" label="Monto parcial" readonly class="text-h5 font-mono text-center"
            hide-details @click="startEditing"></v-text-field>

        <!-- Panel de botones numéricos -->
        <v-row dense class="gap-1 justify-center " v-if="isEditing">
            <v-col v-for="(item, index) in buttonLayout" :key="index" cols="4" class="pa-1 align-self-center">
                <v-btn
                    class="bg-gray-100 text-black font-bold flex align-self-center rounded-lg text-h6 w-16 h-16"
                    @click="handleClick(item)">
                    {{ item }}
                </v-btn>
            </v-col>
            <v-text-field label="Label" prepend-icon="$vuetify"></v-text-field>

        </v-row>

        <!-- Botón para eliminar -->
        <div class="text-center mt-2" v-if="isEditing">
            <v-btn color="red" variant="outlined" class="font-bold" @click="deleteText">
                Borrar
            </v-btn>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const inputText = ref('');
const confirmedValueMoney = ref<number | null>(null);
const isEditing = ref(false);

const buttonLayout = ref([
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    "00", "0", "✔",
]);

const handleClick = (value: string) => {
    if (value === '✔') {
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