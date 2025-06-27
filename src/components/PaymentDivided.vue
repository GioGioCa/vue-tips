<template>
    <v-col cols="12">
        <p class="text-subtitle-2 font-weight-bold">¿Entre cuántos quieres dividir las Propinas?</p>
        <div class="d-flex align-center gap-4">
            <v-text-field type="number" v-model="props.newTip.peopleAmount" min="1" class="rounded-lg" style="max-width: 80px"
                dense hide-details solo />
            <span class="text-red font-weight-bold">${{ newTip.peopleAmount }} por Persona</span>
        </div>
    </v-col>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  newTip: {
    peopleAmount: number
  }
}>()
</script>

<style scoped></style>