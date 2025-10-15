<template>
  <v-footer class="text-center d-flex flex-column ga-2 py-4">
    <div class="d-flex ga-3">
      <a
        v-for="(icon) in icons"
        :key="icon.name"
        :href="icon.link"
        target="_blank"
        rel="noopener"
      >
        <v-btn
          :icon="icon.name"
          density="comfortable"
          variant="text"
        ></v-btn>
      </a>
    </div>

    <v-divider class="my-2" thickness="2" width="50"></v-divider>

    <div class="text-caption font-weight-regular opacity-60">
      Nuestro sitio está diseñado para brindar una experiencia completa tanto a los huéspedes como a los dueños de alojamientos.
      Los huéspedes pueden explorar, comparar y reservar habitaciones de manera rápida y segura, mientras que los propietarios tienen una plataforma confiable para mostrar sus alojamientos y gestionar reservas.
      Nos esforzamos por mantener información actualizada, fotografías reales y descripciones precisas, asegurando que todos los usuarios disfruten de un servicio transparente y de calidad. 
    </div>

    <v-divider></v-divider>

    <div>
      {{ new Date().getFullYear() }} — <strong>TuAlojamiento</strong>
    </div>
  </v-footer>
</template>

<script setup>
const icons = [
  { name: 'mdi-facebook', link: 'https://www.facebook.com' },
  { name: 'mdi-twitter', link: 'https://www.twitter.com' },
  { name: 'mdi-linkedin', link: 'https://www.linkedin.com' },
  { name: 'mdi-instagram', link: 'https://www.instagram.com' },
]
</script>

<style scoped>
.text-center{
  background-color: #f4decb;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,0.5) inset;
}

.v-btn .v-icon {
  font-size: 28px; 
}
.v-btn {
  color: #000; 
}

</style>
