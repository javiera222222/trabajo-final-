<template>
  <!-- Envolvemos todo en page-container para el fondo -->
  <div class="page-container">
    <!-- Usamos card para el fondo semi-transparente y sombras -->
    <div class="calendario-container card">
      <h1 class="titulo-principal">Calendario de reservas</h1>

      <div class="header">
        <button @click="mesAnterior">◀</button>
        <span>{{ meses[mesSeleccionado] }} {{ anioSeleccionado }}</span>
        <button @click="mesSiguiente">▶</button>
      </div>

      <div class="dias">
        <div class="arriba"></div>
        <div v-for="dia in diasMes" :key="dia" class="dia">{{ dia }}</div>
      </div>

      <div
        v-for="habitacion in habitaciones"
        :key="habitacion.id"
        class="habitaciones"
      >
        <div class="habitacionNombre">{{ habitacion.nombre }}</div>

        <div class="dias-grid">
          <div v-for="dia in diasMes" :key="dia" class="fechas"></div>

          <div
            v-for="reserva in reservasDeHabitacion(habitacion.id)"
            :key="reserva.id"
            class="reserva-bloque"
            :style="estiloReserva(reserva)"
          >
            <router-link :to="`/Reserva/${reserva.id}`" class="detalle-btn">
              <span class="reserva-numero">{{ reserva.id }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* Tu script queda igual, no hay cambios necesarios */
</script>

<style scoped>
/* Removemos el background y box-shadow de calendario-container porque lo trae .card */
.calendario-container {
  width: 100%;
  margin: 0 auto;
  padding: 16px;
  overflow-x: auto;
  border-radius: 16px; /* opcional, para armonizar con card */
}
</style>
