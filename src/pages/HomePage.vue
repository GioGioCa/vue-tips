<template>
    <Header @goBack="" />
    <v-container>

        <v-row>
            <v-col cols="4" class="">Columna 1
                <DataInput :confirmedValue="confirmedValueMoney" v-model:editing="isEditing" />
                <v-row>
                    <v-col cols="12">
                        <h5>¿Entre cuantos quieres dividir la propina?</h5>
                        <input type="number"  min="1" />
                        <span>- por Persona</span>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <h2>Método de Pago</h2>
                        <v-row>
                            <v-container>
                                <v-row justify="center" align-content="center">
                                    <v-col cols="6"
                                        class="d-flex justify-center">
                                        <v-btn-toggle v-model="selectedMethod" mandatory class="flex flex-wrap gap-2">
                                            <v-btn
                                                v-for="option in options"
                                                :key="option.value"
                                                :value="option.value"
                                                class="bg-white text-black text-center"
                                                style=" border-radius: 12px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);">
                                                {{ option.label }}
                                            </v-btn>
                                        </v-btn-toggle>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>

            <v-col cols="4" class="bg-green lighten-2">Columna 2
                <v-row no-gutters>
                    <v-col cols="10">
                        <v-text-field v-model="inputText" label="Ingresar número" readonly dense outlined
                            :disabled="!isEditing"></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-btn @click="deleteText" color="red" :disabled="!isEditing">Delete</v-btn>
                    </v-col>
                </v-row>

                <v-container>
                    <v-row dense class="gap-1 justify-center">
                        <v-col  cols="4" class="pa-1">
                        </v-col>
                    </v-row>
                </v-container>

            </v-col>

            <v-col cols="4" class="">
            </v-col>
        </v-row>
    </v-container>

</template>

<script lang="ts">
import { ref } from 'vue';
import Header from '@/components/Header.vue';
import DataInput from '@/components/DataInput.vue';
import InputPad from '../components/InputPad.vue';

const confirmedValueMoney = ref<number | null>(null);

const handleConfirmed = (val: number) => {
    confirmedValueMoney.value = val;
};

const isEditing = ref(false);



</script>

<style scoped></style>