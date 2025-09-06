<script setup lang="ts">
//import HelloWorld from './components/HelloWorld.vue'
//@ts-ignore
import { ref } from 'vue';
import tipPage from './components/tipPage.vue';
//MUST BE CALL OTHERWISE, BC POLYMORPHISM
// Theme state

</script>

<template>
  <RouterView>
  </RouterView>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
