<template>
  <div v-if="habitacion" class="nueva-reserva">
    <div class="reserva-card">
      <h1 class="titulo-principal">Crea una nueva reserva</h1>

      <div class="habitacion-card">
        <h2 class="habitacion-nombre">{{ habitacion.nombre }}</h2>
        <p class="habitacion-precio">Precio por noche: ${{ habitacion.precio }}</p>
      </div>

      <form class="reserva-form" @submit.prevent="crearReserva">
        <h3 class="titulo">Nueva Reserva</h3>

        <div class="form-grid">
          <div class="formularios">
            <label>Cantidad de noches</label>
            <input type="number" v-model.number="reserva.cantNoches" min="1" placeholder="..."/>
          </div>

          <div class="formularios">
            <label>Desde</label>
            <input type="date" v-model="reserva.desde" />
          </div>

          <div class="formularios">
            <label>Hasta</label>
            <input type="date" v-model="reserva.hasta" />
          </div>

          <div class="formularios">
            <label>Precio total</label>
            <p class="precio-total">$ {{ habitacion.precio * reserva.cantNoches }}</p>
          </div>

          <div class="formularios">
            <label>DNI/Pasaporte</label>
            <input v-model="reserva.dniHuesped" placeholder="..."/>
          </div>
          <div class="formularios">
            <label>Cantidad de huespedes</label>
            <input v-model="reserva.cantHuespedes" placeholder="..."/>
          </div>

          <div v-if="auth.grupos.includes('propietario')" class="formularios">
            <label>Nombre huésped</label>
            <input v-model="reserva.nombreHuesped" placeholder="..."/>
          </div>
 
        </div>

        <button type="submit" class="btn-guardar">Guardar reserva</button>

        <p v-if="errorMsg" style="color: red">{{ errorMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createReserva } from '../api/reserva.js'
import { gethabitacion } from '../api/habitacion.js'
import { useAuthStore } from '../stores/auth'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const habitacionId = route.params.id
const auth = useAuthStore()
const error = ref(null)
const habitacion = ref(null)
const loading = ref(false)
const errorMsg = ref('')


const reserva = ref({
  cantNoches: 1,
  desde: '',
  hasta: '',
  checkIn: null,
  checkOut: null,
  huesped: null,
  precio: 0,
  pagado: false,
  dniHuesped: '',
  habitacion: null,
  nombreHuesped: '',
  cantHuespedes:0
})

const crearReserva = async () => {
  try {
    if (!reserva.value.desde || !reserva.value.hasta || !reserva.value.dniHuesped) {
      error.value = "Completa todos los campos obligatorios";
      return;
    }
    if (auth.grupos.includes('cliente')) {
      reserva.value.nombreHuesped = `${auth.user.first_name} ${auth.user.last_name}`}
    reserva.value.habitacion = habitacion.value.id;
    reserva.value.precio = habitacion.value.precio * reserva.value.cantNoches;
    if (reserva.value.checkIn) reserva.value.checkIn += ":00";
    if (reserva.value.checkOut) reserva.value.checkOut += ":00";
    const reservaCreada = await createReserva(reserva.value);
    router.push(`/reserva/${reservaCreada.id}`);
  }  catch (err) {
    console.log(" Error al crear reserva:", err.response?.data)
    errorMsg.value =
      err.response?.data?.non_field_errors?.[0] ||
      JSON.stringify(err.response?.data) ||
      "Error desconocido"
  }
};

const cargarHabitacion = async () => {
  loading.value = true
  error.value = null
  try {
    habitacion.value = await gethabitacion(habitacionId)
    reserva.value.habitacion = habitacion.value.id
  } catch (e) {
    error.value = 'Error al cargar la habitación'
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  cargarHabitacion()

  console.log('Usuario:', auth.user)
  if (auth.user) {
    console.log('Nombre:', auth.user.first_name)
    console.log('Apellido:', auth.user.last_name)
  }
})

</script>

<style scoped>
.nueva-reserva {
  min-height: 100vh;
  padding: 30px;
  background: url('/public/inicioCuatro.jpg') no-repeat center center fixed;
  background-size: cover; 
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.reserva-card {
  background: rgba(255,255,255,0.95);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 12px 25px rgba(0,0,0,0.25);
  width: 100%;
  max-width: 700px;
}

.habitacion-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  margin-bottom: 1.5rem;
  text-align: center;
}

.habitacion-nombre {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.habitacion-precio {
  font-size: 1.2rem;
  color: #94618e;
}

.reserva-form {
  display: flex;
  flex-direction: column;
}

.titulo {
  text-align: center;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #49274a;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem 1.5rem;
  margin-bottom: 1.5rem;
}

.formularios {
  display: flex;
  flex-direction: column;
}

.formularios label {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #94618e;
}

.formularios input[type='text'],
.formularios input[type='number'],
.formularios input[type='date'] {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  outline: none;
}

.formularios input:focus {
  border-color: #4cafef;
  box-shadow: 0 0 4px rgba(76, 175, 239, 0.4);
}

.precio-total {
  font-weight: bold;
  font-size: 1rem;
  color: #49274a;
}

.btn-guardar {
  padding: 0.9rem;
  font-size: 1rem;
  font-weight: 600;
  background: #4cafef;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-guardar:hover {
  background: #3498db;
}

.error {
  color: red;
  margin-top: 1rem;
  text-align: center;
}
</style>
