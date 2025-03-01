<script setup lang="ts">
//import HelloWorld from './components/HelloWorld.vue'
//@ts-ignore
import tipPage from './components/tipPage.vue';
import mainWindow from './components/mainWindow.vue';
import iaTest from './components/iaTest.vue';
import iaTest2 from './components/iaTest2.vue';

</script>

<template>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <!----<mainWindow/>-->
  <tipPage/>

  <iaTest2/>
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
