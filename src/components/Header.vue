// Header.vue
<template>
    <header>
        <v-container class="back-button">
            <v-row align="center" justify="space-between" class="border-b-lg pb-4" no-gutters>
                <v-col cols="auto">
                    <button type="button"
                        class="py-1 px-2 m-1 rounded-sm font-times text-sm text-orange bg-transparent text-2xl"
                        @click="goBack">
                        <v-icon class="text-orange">mdi-chevron-left</v-icon>
                        <span>Atrás</span>
                    </button>
                </v-col>
                <v-col>
                    <h2 class="text-black font-times">Pago de propinas</h2>
                </v-col>
                <v-col cols="auto">
                    <v-row>
                        <v-col cols="12" align="center">
                            <h5 class="text-orange">Efectivo en caja</h5>
                        </v-col>
                        <v-col cols="12" align="center">
                            <h1 class="text-orange bg-orange-accent-1 font-bold rounded-lg">
                                {{ headerTotalCash }}
                            </h1>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </header>
</template>

<script setup>
import { defineEmits, watchEffect,onMounted   } from 'vue';
import {  usePayments } from '../composables/usePayments';
const { fetchTotalCashPayments, totalCash }  = usePayments();
const headerTotalCash = totalCash;

onMounted(() => {
    fetchTotalCashPayments();
});
watchEffect(() => {
    console.log('Header total cash:', headerTotalCash.value);
});

// Definir eventos
const emit = defineEmits(['goBack']);
const goBack = () => emit('goBack');
</script>


<style scoped lang="ts"></style>
