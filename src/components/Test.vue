<template>
    <v-card class="pa-4 rounded-xl" elevation="4">
      <!-- Total de propinas -->
      <v-row>
        <v-col cols="12">
          <span class="font-weight-bold text-red text-subtitle-2">Total de Propinas</span>
          <v-sheet class="mt-2 d-flex align-center justify-space-between pa-4 rounded-lg pink lighten-5">
            <span class="text-h4 font-weight-bold text-red">${{ formattedTotal }}</span>
            <v-icon class="ml-2" @click="toggleEdit" style="cursor: pointer">
              {{ props.editing ? 'mdi-close' : 'mdi-pencil' }}
            </v-icon>
          </v-sheet>
        </v-col>
  
        <!-- Dividir entre personas -->
        <v-col cols="12">
          <p class="text-subtitle-2 font-weight-bold">¿Entre cuántos quieres dividir las Propinas?</p>
          <div class="d-flex align-center gap-4">
            <v-text-field
              type="number"
              v-model="peopleCount"
              class="rounded-lg"
              style="max-width: 80px"
              dense
              hide-details
              solo
            />
            <span class="text-red font-weight-bold">${{ formattedPerPerson }} por Persona</span>
          </div>
        </v-col>

        <!-- Métodos de pago -->
        <v-col cols="12" class="mt-4">
          <div class="d-flex align-center mb-2">
            <v-icon class="mr-2">mdi-wallet</v-icon>
            <h6 class="text-body-1 font-weight-bold">Elige el Método de Pago</h6>
          </div>
  
          <v-row dense>
            <v-col
              v-for="option in options"
              :key="option.value"
              cols="12"
              md="4"
              class="d-flex"
            >
              <v-btn
                block
                :class="selectedMethod === option.value ? 'selected-button' : 'neutral-button'"
                @click="setPaymentMethod(option.value)"
                class="pa-4 rounded-xl d-flex flex-column align-center"
              >
                <v-icon size="28" class="mb-2">{{ }}</v-icon> <!--option.icon-->
                <span class="text-caption">{{ option.label }}</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, withDefaults, defineProps,computed } from "vue";
  import { usePaymentMethod } from "../composables/usePaymentMethod";
  
  const props = withDefaults(
    defineProps<{
      confirmedValue?: number | null;
      editing: boolean;
    }>(),
    {
      confirmedValue: null,
    }
  );
  const emit = defineEmits(['update:editing']);
  
  const inputText = ref("");
  const peopleCount = ref(5); // Valor inicial
  const { options, selectedMethod, setPaymentMethod } = usePaymentMethod();
  
  watch(
    () => props.confirmedValue,
    (newVal) => {
      if (newVal !== null) {
        inputText.value = newVal.toString();
      }
    }
  );
  
  const toggleEdit = () => {
    const newVal = !props.editing;
    emit('update:editing', newVal);
    if (!newVal) inputText.value = "";
  };
  
  const formattedTotal = computed(() =>
    parseFloat(inputText.value || "0").toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    })
  );
  
  const formattedPerPerson = computed(() => {
    const total = parseFloat(inputText.value || "0");
    const perPerson = peopleCount.value > 0 ? total / peopleCount.value : 0;
    return perPerson.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    });
  });
  </script>
  
  <style scoped>
  .text-red {
    color: #ff5252;
  }
  
  .pink {
    background-color: #ffe5e5;
  }
  
  .selected-button {
    background-color: #ffccbc !important;
    color: #000 !important;
    border: 2px solid #fb8c00;
  }
  
  .neutral-button {
    background-color: #fff !important;
    border: 1px solid #ccc;
    color: #000;
  }
  </style>
  