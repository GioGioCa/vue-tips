<template>
    <v-row>
      <v-col cols="12">
        <h5 class="text-orange">Total propinas</h5>
      </v-col>

      <v-col cols="12">
        <v-text-field :readonly="!props.editing" label="Propinas" variant="solo" color="#ff5252"
          class="font-bold rounded-lg text-center" bg-color="" :append-icon="props.editing ? 'mdi-close' : 'mdi-pencil'"
          @click:append="toggleEdit" :model-value="inputText" />
      </v-col>

    </v-row>
</template>

<script setup lang="ts">
import { ref, watch, withDefaults, defineProps } from "vue";

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

watch(
  () => props.confirmedValue,
  (newVal) => {
    inputText.value = newVal !== null ? newVal.toString() : '';
  }
);

const toggleEdit = () => {
  const newVal = !props.editing;
  emit('update:editing', newVal);
  if (!newVal) {
    inputText.value = "";
  }
};
</script>

<style scoped>
.text-orange {
  color: #fb8c00;
}

.text-red {
  color: #ff5252;
}

.pinkISH .v-text-field {
  background-color: #ffe5e5 !important;
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
