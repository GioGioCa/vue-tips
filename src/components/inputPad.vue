<template>
  <v-card class="pa-4" color="#eee" rounded="xl">
    <v-text-field
      v-model="inputText"
      label="Ingresar número"
      readonly
      dense
      outlined
      hide-details
      append-inner-icon="mdi-backspace-outline"
      @click:append-inner="deleteText"
      class="mb-4"
    />

    <v-container class="pa-0" fluid>
      <v-row dense>
        <v-col
          v-for="(btn, index) in buttonLayout"
          :key="index"
          cols="4"
          class="d-flex justify-center pa-1"
          color="red"
        >
          <v-btn
            class="w-100"
            color="white"
            style="height: 60px; font-weight: bold"
            @click="handleClick(btn)"
          >
            <v-icon v-if="btn.startsWith('mdi')">{{ btn }}</v-icon>
            <span v-else>{{ btn }}</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps<{
}>();

const emit = defineEmits<{
  (e: 'confirmed', value: number): void;
  (e: 'close'): void;
}>();

const inputText = ref('');
const buttonLayout = [
  "1", "2", "3",
  "4", "5", "6",
  "7", "8", "9",
  "00", "0", "mdi-check-circle-outline",
];

const handleClick = (value: string) => {
  if (value === "mdi-check-circle-outline") {
    confirmValue();
  } else {
    if (value === "00" || /^\d$/.test(value)) {
      inputText.value += value;
    }
  }
};

const confirmValue = () => {
  const confirmed = parseFloat(inputText.value) || 0;
  emit('confirmed', confirmed);
  inputText.value = '';
  emit('close');
};

const deleteText = () => {
  inputText.value = inputText.value.slice(0, -1);
};
</script>


<style scoped lang="ts">

</style>