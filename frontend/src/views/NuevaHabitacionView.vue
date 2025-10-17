<template>
  <div class="form-container">
    <form class="habitacion-form" @submit.prevent="crearHabitacion">
      <h1 class="titulo-principal">Crea una nueva habitacion</h1>

      <div class="form-grid">
        <div class="form-group">
          <label>Nombre</label>
          <input v-model="habitacion.nombre" placeholder="Ej: Suite Deluxe" />
        </div>

        <div class="form-group">
          <label>Precio</label>
          <input v-model.number="habitacion.precio" type="number" min="0" />
        </div>

        <div class="form-group">
          <label>Camas simples</label>
          <input v-model.number="habitacion.camasSimples" type="number" min="0" />
        </div>

        <div class="form-group">
          <label>Camas dobles</label>
          <input v-model.number="habitacion.camasDobles" type="number" min="0" />
        </div>

        <div class="form-group checkbox">
          <label>
            <input v-model="habitacion.banoPrivado" type="checkbox" />
            Baño privado
          </label>
        </div>

        <div class="form-group checkbox">
          <label>
            <input v-model="habitacion.desayuno" type="checkbox" />
            Desayuno
          </label>
        </div>

        <div class="form-group checkbox">
          <label>
            <input v-model="habitacion.cocina" type="checkbox" />
            Cocina
          </label>
        </div>

        <div class="form-group">
          <label>Imágenes de la habitación</label>
          <input type="file" multiple @change="handleFileChange" />
        </div>
      </div>

    <div v-if="previews.length" class="preview-list">
  <p>Vista previa:</p>
  <div v-for="(item, i) in previews" :key="item.id" class="preview-row">
    <img :src="item.preview" alt="Vista previa" class="preview-img" />
    <button type="button" class="btn-eliminar" @click="removeFile(i)">Eliminar</button>
  </div>
</div>


      <button type="submit" class="btn-guardar">Guardar habitación</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createhabitacion } from "../api/habitacion.js"
import { createfoto } from "../api/fotos.js"
import { useRouter } from 'vue-router'

const router = useRouter()
const error = ref(null)
const archivosImagen = ref([])
const previews = ref([])
let nextId=0

const habitacion = ref({
  nombre: '',
  tipoHabitacion: 1,
  camasSimples: 0,
  camasDobles: 0,
  banoPrivado: false,
  cocina: false,
  desayuno: false,
  precio: 0,
})

const crearHabitacion = async () => {
  try {
    const formData = new FormData()
    for (const key in habitacion.value) {
      formData.append(key, habitacion.value[key])
    }

    const habitacionCreada = await createhabitacion(formData, true)
    const habitacionId = habitacionCreada.id
    
    await subirFotos(habitacionId)
    router.push(`/habitacion/${habitacionId}`)
    console.log("ID de la nueva habitación:", habitacionId)
  } catch (err) {
    console.log(err.response?.data)
    error.value = 'Error al crear la habitación'
  }
}

const subirFotos = async (habitacionId) => {
  for (const file of archivosImagen.value) {
    const formData = new FormData()
    formData.append("habitacion", habitacionId)
    formData.append("imagen", file)

    try {
      await createfoto(formData, true)
    } catch (error) {
      console.error("Error al subir fotos", error.response?.data)
    }
  }
}

const handleFileChange = (event) => {
  const seleccion = Array.from(event.target.files)  
  archivosImagen.value = [...archivosImagen.value, ...seleccion]  

  const nuevosPreview = seleccion.map(file => ({
    id: nextId++,         
    preview: URL.createObjectURL(file)
  }))
  previews.value = [...previews.value, ...nuevosPreview]

  event.target.value = ''  
}

const removeFile = (index) => {
  URL.revokeObjectURL(previews.value[index].preview)
  previews.value.splice(index, 1)
  archivosImagen.value.splice(index, 1)
}


</script>



<style scoped>
.form-container {
  min-height: 100vh;
  padding: 30px;
  background: url('/public/inicioCuatro.jpg') no-repeat center center fixed;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.habitacion-form {
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 700px;
}

.form-title {
  margin-bottom: 1rem;
  font-size: 1.4rem;
  font-weight: 600;
  text-align: center;
  color: #94618e;
}

.form-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
  color: #94618e;
}

.form-group input[type='text'],
.form-group input[type='number'],
.form-group input[type='date'],
.form-group input[type='file'] {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  outline: none;
  background: #fff;
}

.form-group input:focus {
  border-color: #94618e;
  box-shadow: 0 0 4px #94618e;
}

.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}


.preview-list {
  margin-top: 1rem;
}
.preview-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.preview-img {
  width: 180px;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0,0,0,0.3);
}


.preview-container {
  margin-top: 1rem;
  text-align: center;
}

.btn-guardar {
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.9rem;
  font-size: 1rem;
  font-weight: 600;
  background: #94618e;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-guardar:hover {
  background: #94618e;
}

.error {
  color: red;
  margin-top: 1rem;
  text-align: center;
}

.btn-eliminar {
  margin-left: 10px;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  color: white;
  background: #d9534f;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-eliminar:hover {
  background: #c9302c;
}

</style>