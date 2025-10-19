<template>
  <div class="habitaciones">
    <h1 class="titulo-principal">Habitaciones</h1>

    <div v-if="auth.grupos.includes('cliente')"  class="filtro">
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

.habitaciones {
  min-height: 100vh;
  padding: 30px;
  background: url('/public/inicioCuatro.jpg') no-repeat center center fixed;
  background-size: cover;
  position: relative;
  z-index: 1;
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
  -webkit-text-fill-color: transparent;
  transition: transform 0.3s;
}

.page-title:hover {
  transform: scale(1.05);
}


.filtro {
  margin-bottom: 25px;
  text-align: center;
}

.filtro label {
  display: block;
  font-size: 1.2rem;
  font-weight: 600;
  color: #4a2858;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.filtro input {
  padding: 12px 16px;
  border-radius: 10px;
  border: 2px solid #7b4b8e;
  width: 65%;
  max-width: 420px;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.85);
  color: #333;
  outline: none;
  transition: all 0.3s;
}

.filtro input:focus {
  border-color: #94618e;
  box-shadow: 0 0 10px rgba(148, 97, 142, 0.6);
  background-color: rgba(255, 255, 255, 0.95);
}


.nueva {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 10; 
}

.nueva .btn-guardar {
  padding: 0.9rem 1.3rem;
  font-size: 1.05rem;
  font-weight: bold;
  background: linear-gradient(135deg, #94618e, #7b4b8e);
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: transform 0.3s, box-shadow 0.3s;
}

.nueva .btn-guardar:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(148, 97, 142, 0.6);
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
  transition: background 0.3s, transform 0.2s;
}

.btn-guardar:hover {
  background: #7b4b8e;
  transform: translateY(-2px);
}


.error {
  text-align: center;
  color: red;
  margin-top: 1rem;
}
</style>



