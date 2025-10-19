<template>
  <div class="reservas">
    <h1 class="titulo-principal">Tus reservas</h1>
    <p v-if="cargando" class="cargando">Cargando reservas...</p>

    <div v-else-if="reservas.length > 0" class="reservas-grid">
      <div v-for="reserva in reservas" :key="reserva.id" class="reserva-card">
        <h3>Reserva #{{ reserva.id }}</h3>
        <p><strong>Habitación:</strong> {{ reserva.habitacionNombre }}</p>
        <p><span v-if="auth.grupos.includes('propietario')"> <strong>Huésped:</strong> {{ reserva.nombreHuesped }} </span></p> 
        <p><strong>Cantidad de huespedes:</strong> {{ reserva.cantHuespedes }}</p>
        <p><strong>Cantidad de noches:</strong> {{ reserva.cantNoches }}</p>
        <p><strong>Desde:</strong> {{ formatFecha(reserva.desde) }}</p>
        <p><strong>Hasta:</strong> {{ formatFecha(reserva.hasta) }}</p>
        <span :class="['pago', reserva.pagado ? 'pago-hecho' : 'pago-noHecho']">
          {{ reserva.pagado ? 'Pagado' : 'Pago pendiente' }}
        </span>
        <router-link :to="`/Reserva/${reserva.id}`" class="detalle-btn">Ver detalles</router-link>
      </div>
    </div>

    <p v-else>No se han cargado reservas aún.</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { getReservas } from "../api/reserva.js"
import { gethabitaciones } from "../api/habitacion.js"

const reservas = ref([])
const cargando = ref(false)
const error = ref(null)

const formatFecha = (fecha) => {
  if (!fecha) return "—"
  return new Date(fecha).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const cargarReservas = async () => {
  cargando.value = true
  error.value = null
  reservas.value = []
  try {
    reservas.value = await getReservas()
    const habitacionesArray = await gethabitaciones()

   reservas.value = reservas.value.map(r => {
  const hab = habitacionesArray.find(h => h.id === r.habitacion)
  return { ...r, habitacionNombre: hab ? hab.nombre : "—" }
})
     } catch (e) {
    error.value = "Error al cargar reservas"
  } finally {
    cargando.value = false
  }
}

onMounted(cargarReservas)
</script>

<style scoped>
.reservas {
  min-height: 100vh;
  padding: 30px;
  background: url('/public/inicioCuatro.jpg') no-repeat center center fixed;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cargando {
  color: #94618e;
  font-weight: bold;
  margin-bottom: 20px;
}

.reservas-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  width: 100%;
  max-width: 1200px;
}

.reserva-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reserva-card h3 {
  margin: 0 0 10px 0;
  color: #49274a;
}

.pago {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: bold;
  margin-top: 5px;
  width: fit-content;
}

.pago-hecho { background: #28a745; color: white; }
.pago-noHecho { background: #dc3545; color: white; }

.detalle-btn {
  margin-top: 10px;
  text-align: center;
  background-color:  #be84b7;
  color: white !important;
  padding: 6px 12px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}

.detalle-btn:hover {
  background-color: #49274a;
}

.error {
  color: red;
  margin-top: 1rem;
}


</style>
