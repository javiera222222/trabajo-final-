<template>
  <head>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">

  </head>
<VApp>
  <nav v-if="auth.access">
  <MenuComponent />
  </nav>
  <VMain>
  <RouterView></RouterView>
</VMain>
<FooterComponent/>
  </VApp>
</template>

<script setup>
import FooterComponent from './components/FooterComponent.vue';
import MenuComponent from './components/MenuComponent.vue'
import { useAuthStore } from './stores/auth'
const auth = useAuthStore()


</script >


<style></style>