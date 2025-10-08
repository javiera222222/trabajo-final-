<template>
  <div class="habitaciones-container">
    <h2 class="page-title">Nuestras Habitaciones</h2>

    <div class="filtro-container">
      <label for="ubicacion">Filtrar por ubicación:</label>
      <input 
        id="ubicacion" 
        v-model="filtroUbicacion" 
        type="text" 
        placeholder="Escribe una ciudad o dirección..." 
      />
    </div>

    <div class="habitaciones-grid">
      <div 
        v-for="habitacion in habitacionesFiltradas" 
        :key="habitacion.id" 
        class="habitacion-card"
      >
       <img :src="habitacion.fotoPrincipal" alt="Foto habitación" class="habitacion-img"/>
      

<Button label="Show" icon="pi pi-external-link" @click="displayBasic = true"></Button>

        <div class="habitacion-info">
          <h3 class="habitacion-nombre">{{ habitacion.nombre }}</h3>
          <p class="habitacion-precio">Precio por noche: ${{ habitacion.precio }}</p>
          <p v-if="habitacion.alojamiento">
            Ubicación: {{ habitacion.alojamiento?.direccion }} - {{ habitacion.alojamiento?.ubicacion }}
          </p>
          <button @click="verDetalle(habitacion.id)" class="btn-guardar">
            Ver detalles
          </button>
           

        
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
  </div> </div>
  <div v-if="auth.grupos.includes('propietario')" class="nueva">
        <button @click="Crear"  class="btn-guardar">Crear nueva habitacion </button>
      </div>
 
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { gethabitaciones } from "../api/habitacion.js"
import { getAlojamiento } from "@/api/alojamiento"
import { useRouter } from "vue-router"
import { getfoto } from "@/api/fotos";
import { useAuthStore } from "../stores/auth";

const router = useRouter()
const habitaciones = ref([])
const filtroUbicacion = ref("")
const loading = ref(false)
const error = ref(null)
const auth = useAuthStore();

const Crear =async () => {
  router.push(`/NuevaHabitacion`)
}

const verDetalle = (id) => {
  router.push(`/Habitacion/${id}`)
}

const cargarhabitaciones = async () => {
  loading.value = true
  error.value = null
  habitaciones.value = []
  try {
    habitaciones.value = await gethabitaciones()
    for (let h of habitaciones.value) {
      try {
        const alojamiento = await getAlojamiento(h.alojamiento)
        h.alojamiento = alojamiento
         const fotos = await getfoto(h.id);
        h.fotoPrincipal = fotos.length > 0 ? fotos[0].imagen : null;
      } catch (err) {
        console.error("Error cargando alojamiento", err)
      }
    }
  } catch (e) {
    error.value = "Error al cargar habitaciones"
  } finally {
    loading.value = false
  }
}

const habitacionesFiltradas = computed(() => {
  if (!filtroUbicacion.value) return habitaciones.value

  const term = filtroUbicacion.value.toLowerCase()

  return habitaciones.value
    .filter(h =>
      h.alojamiento?.ubicacion?.toLowerCase().includes(term) ||
      h.alojamiento?.direccion?.toLowerCase().includes(term)
    )
    .sort((a, b) => {
      const aUbic = a.alojamiento?.ubicacion?.toLowerCase() || ""
      const bUbic = b.alojamiento?.ubicacion?.toLowerCase() || ""
      if (aUbic.startsWith(term) && !bUbic.startsWith(term)) return -1
      if (!aUbic.startsWith(term) && bUbic.startsWith(term)) return 1
      return 0
    })
})

onMounted(() => {
  cargarhabitaciones()
})
</script>


<style scoped>

.filtro-container {
  margin-bottom: 20px;
  text-align: center;
}

.filtro-container input {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 60%;
  max-width: 400px;
}

.habitaciones-container {
  min-height: 100vh;
  padding: 30px;
  background: url('/public/inicioCuatro.jpg') no-repeat center center fixed;
  background-size: cover; 
}

.page-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #fff;
  text-shadow: 1px 1px 4px rgba(0,0,0,0.6);
}

.habitaciones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.habitacion-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s, box-shadow 0.3s;
}

.habitacion-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.habitacion-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.habitacion-info {
  padding: 1rem;
  text-align: center;
}

.habitacion-nombre {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.habitacion-precio {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #94618e;
}

.btn-guardar {
  width: 100%;
  padding: 0.7rem;
  font-size: 1rem;
  font-weight: 600;
  background: #94618e;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}



.error {
  text-align: center;
  color: red;
  margin-top: 1rem;
}

.nueva{
  justify-content: center;
  width: 40%;
  
}
</style>
