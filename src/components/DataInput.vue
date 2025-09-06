<template>
  <v-row>
    <v-col cols="12"><h5 class="text-orange">Total propinas</h5></v-col>
    <v-col cols="12">
      <v-text-field
        :readonly="!props.editing"
        label="Propinas"
        variant="solo"
        color="#ff5252"
        class="font-bold rounded-lg text-center"
        :append-icon="props.editing ? 'mdi-close' : 'mdi-pencil'"
        @click:append="toggleEdit"
        v-model="inputText"
        @blur="finishEditing"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';

// Definición de props
const props = defineProps<{
  totalValue: number | null;
  editing: boolean;
}>();

// Eventos emitidos
const emit = defineEmits([
  'update:editing',
  'update:totalValue',
]);

// Valor interno para el campo de texto
const inputText = ref<string>('');

// Sincronizar con totalValue cuando cambie desde el padre oùt
watch(
  () => props.totalValue,
  (newVal) => {
    inputText.value = newVal !== null ? newVal.toString() : '';
},
  { immediate: true }
);

// Alternar modo edición
function toggleEdit() {
  const next = !props.editing;
  emit('update:editing', next);
  if (!next) {
    inputText.value =
      props.totalValue !== null ? props.totalValue.toString() : "";
  }
}

//funcion cuando usuario termina de escribir
function finishEditing() {
  if (props.editing && inputText.value.trim() !== "") {
    const num = Number(inputText.value);
    if (!isNaN(num)) {
      emit("update:totalValue", num);
    }
    emit("update:editing", false);
  }
}
</script>

<style scoped>
.text-orange { color: #fb8c00; }
.text-red { color: #ff5252; }
.pinkISH .v-text-field { background-color: #ffe5e5 !important; }
.selected-button { background-color: #ffccbc !important; color: #000 !important; border: 2px solid #fb8c00; }
.neutral-button { background-color: #fff !important; border: 1px solid #ccc; color: #000; }
</style>
