<template>
  <div class="reserva-container">
   
    <p v-if="loading">Cargando reserva...</p>

    <div v-else-if="reserva" class="reserva-card">
<h1 class="titulo-principal">Tu reserva</h1>
      <div class="resumen">
        <div class="resumen-item">
          <h3>{{ reserva.cantNoches }}</h3>
          <p>Noches</p>
        </div>
        <div class="resumen-item">
          <h3>${{ reserva.precio }}</h3>
          <p>Precio total</p>
        </div>
        
        <div class="resumen-item">
          <span :class="['badge', reserva.pagado ? 'badge-success' : 'badge-danger']">
            {{ reserva.pagado ? 'Pagado' : 'Pendiente' }}
          </span>
          <p>Estado</p>
        </div>
      </div>

      <div class="timeline">
        <div class="timeline-item">
          <strong>Check In</strong>
          <p>{{ formatFecha(reserva.checkIn) }}</p>
        </div>
        <div class="timeline-line"></div>
        <div class="timeline-item">
          <strong>Check Out</strong>
          <p>{{ formatFecha(reserva.checkOut) }}</p>
        </div>
      </div>

      <div v-if="!editar" class="detalles">
        <p><strong>Habitación:</strong> {{ reserva.habitacionNombre }}</p>
        <p><strong>ID Reserva:</strong> {{ reserva.id }}</p>
        <p><strong>Desde:</strong> {{ formatFecha(reserva.desde) }}</p>
        <p><strong>Hasta:</strong> {{ formatFecha(reserva.hasta) }}</p>
<p>
  
  <span v-if="auth.grupos.includes('propietario')">
    <strong>Huésped:</strong>
    {{ reserva.nombreHuesped }}
  </span>
  
</p>


        <p><strong>DNI/Pasaporte:</strong> {{ reserva.dniHuesped }}</p>
        <p><strong>Cantidad de huespedes:</strong> {{ reserva.cantHuespedes }}</p>
      </div>

      <div class="acciones" v-if="!editar">
        <button class="btn success" @click="editar = true">✏️ Editar</button>
        <button class="btn danger" @click="eliminarReserva">🗑️ Eliminar</button>
        <button 
          v-if="auth.grupos.includes('propietario') && !reserva.pagado" 
          class="btn success" 
          @click="pagar = true">
          💳 Registrar pago
        </button>
      </div>

      <div v-if="editar" class="editar-form">
        <div class="form-group">
          <label>Cantidad de noches:</label>
          <input v-model="reserva.cantNoches" />
        </div>

        <div class="form-group">
          <label>Fecha de entrada:</label>
          <input type="date" v-model="reserva.desde" />
        </div>

        <div class="form-group">
          <label>Fecha de salida:</label>
          <input type="date" v-model="reserva.hasta" />
         
          <div v-if="auth.grupos.includes('propietario')">
          <div class="form-group">
            
            <label>Check-in</label>
            <input type="datetime-local" v-model="reserva.checkIn" placeholder="..."/>
          </div>

          <div class="form-group">
            <label>Check-out</label>
            <input type="datetime-local" v-model="reserva.checkOut" placeholder="..." />
          </div>
        </div></div>

        <button class="btn success" @click="editarReserva">Guardar edición</button>
      </div>

      <div v-if="pagar" class="pago-card">
        <label>Método de pago:
          <input v-model="pago.metodoDePago" />
        </label>
        <button class="btn success" @click="GuardarPago">Guardar Pago</button>
      </div>

    </div>

    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { getReserva, updateReserva, deleteReserva } from "../api/reserva.js"
import { createpago } from "../api/pago.js"
import { useRoute, useRouter } from 'vue-router'
import { gethabitacion } from "../api/habitacion.js"

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const reserva = ref(null)
const loading = ref(false)
const error = ref(null)
const editar = ref(false)
const pagar = ref(false)


const pago = ref({
  reserva: route.params.id,
  fecha: new Date().toISOString().slice(0, 19),
  cantidad: 0,
  metodoDePago: "",
})

const formatFecha = (fecha) => {
 if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const cargarReserva = async () => {
  loading.value = true
  error.value = null
  try {
    reserva.value = await getReserva(route.params.id)

    const habitacion = await gethabitacion(reserva.value.habitacion)
    reserva.value.habitacionNombre = habitacion.nombre


  } catch (e) {
  console.error('Error al actualizar la reserva:', e.response?.data || e.message)
}
 finally {
    loading.value = false
  }
}


onMounted(() => {
  cargarReserva()
  console.log(auth);

})

const editarReserva = async () => {
  try {
    

    await updateReserva(reserva.value.id, reserva.value);

    editar.value = false; 
    await cargarReserva(); 
  } catch (err) {
    console.error("Error al actualizar la reserva:", err);
  }
};

const eliminarReserva = async () => {
  if (confirm('¿Seguro deseas eliminar esta reserva?')) {
    try {
      await deleteReserva(route.params.id)
      router.push('/Reservas')
    } catch (e) {
      error.value = 'Error al eliminar la reserva'
    }
  }
}

const GuardarPago = async () => {
  pago.value.cantidad = reserva.value.precio
  delete pago.value.id
  try {
    await createpago(pago.value)
    reserva.value.pagado = true   
    pagar.value = false
  } catch (err) {
    error.value = 'Error al guardar el pago'
  }
}
</script>

<style scoped>
.reserva-container {
  min-height: 100vh;
  padding: 30px;
  background: url('/public/inicioCuatro.jpg') no-repeat center center fixed;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.reserva-card {
  background: rgba(255, 255, 255, 0.9);
  padding: 25px;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
}

.resumen {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}
.resumen-item { text-align: center; }

.timeline {
  display: flex;
  align-items: center;
  margin: 20px 0;
}
.timeline-item { flex: 1; text-align: center; }
.timeline-line {
  width: 80px;
  height: 4px;
  background: #94618e;
  margin: 0 10px;
  border-radius: 2px;
}

.badge {
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: bold;
}
.badge-success { background: #28a745; color: white; }
.badge-danger { background: #dc3545; color: white; }

.acciones { display: flex; gap: 10px; margin: 15px 0; }
.btn {
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}
.btn.success { background: #94618e; color: white; }
.btn.danger { background: #dc3545; color: white; }

.editar-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 15px;
}
.editar-form .form-group {
  display: flex;
  flex-direction: column;
}
.editar-form label {
  font-weight: 500;
  margin-bottom: 4px;
}

.pago-card {
  margin-top: 20px;
  padding: 15px;
  border-radius: 10px;
  background: #fff5f8;
  border-left: 6px solid #94618e;
}

.page-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 2px 2px 6px rgba(0,0,0,0.7);
  letter-spacing: 1px;
  background: linear-gradient(90deg, #94618e, #7b4b8e);
  transition: transform 0.3s;
}
</style>
