<template>
  <v-row>
    <v-col cols="8">
      <DataInput :confirmedValue="confirmedValueMoney" v-model:editing="isEditing"
      />
    </v-col>
    <v-col cols="4">
      <InputPad
        :isEditing="isEditing"
        @confirmed="handleConfirmed"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InputPad from "../components/InputPad.vue";
import DataInput from "../components/DataInput.vue";

const confirmedValueMoney = ref<number | null>(null);
const isEditing = ref(false); // 🔥 estado compartido

const handleConfirmed = (val: number) => {
  confirmedValueMoney.value = val;
  isEditing.value = false; // opcionalmente cerrar edición al confirmar
};
</script>


