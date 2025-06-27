<template>
    <v-col cols="12">
        <div class="d-flex align-center mb-2">
            <v-icon class="mr-2">mdi-wallet</v-icon>
            <h6 class="text-body-1 font-weight-bold">Elige el Método de Pago</h6>
        </div>
        <!--<v-row dense class="flex flex-wrap justify-between gap-4">-->
        <v-row dense align="center" justify="space-around">
            <v-col v-for="option in options" :key="option.value" cols="12" md="6"
                class="d-flex justify-between text-red">
                <v-btn :class="[
                    'text-base font-semibold px-4 py-2',
                    selectedMethod === option.value
                        ? 'bg-orange text-white'
                        : 'bg-white text-black'
                ]" style="width: 100%; border-radius: 12px" @click="setPaymentMethod(option.value)">

                    <div class="d-flex align-center" style="gap: 8px">
                        <v-icon>{{ option.icon }}</v-icon>
                        <span class="whitespace-nowrap">{{ option.label }}</span>
                    </div>
                </v-btn>
            </v-col>
        </v-row>
    </v-col>
</template>

<script setup lang="ts">
import { watchEffect } from "vue";
import { usePaymentMethod } from "../composables/usePaymentMethod"; // Cambia ruta si es necesario

const { options, selectedMethod, setPaymentMethod } = usePaymentMethod();

defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(['update:modelValue']);

watchEffect(() => {
  emit('update:modelValue', selectedMethod.value);
});


</script>

<style scoped></style>