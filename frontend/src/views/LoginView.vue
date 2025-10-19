<template>
  <div class="login">
    <div class="foto"></div>

    <div class="formulario">
      <v-card class="login-card px-8 py-8" max-width="400" elevation="8">
        <v-card-title class="justify-center text-h5 font-weight-bold titulo-con-linea">
          Iniciar Sesión
        </v-card-title>

        <v-card-text>
          <v-form v-model="formValid" @submit.prevent="handleLogin">
            <v-text-field
              v-model="username"
              :readonly="loading"
              :rules="[required]"
              label="Nombre de usuario"
              clearable
              prepend-inner-icon="mdi-account"
              class="mb-4 formularios"
            ></v-text-field>

            <v-text-field
              v-model="password"
              :readonly="loading"
              :rules="[required]"
              label="Contraseña"
              clearable
              prepend-inner-icon="mdi-lock"
              type="password"
              class="mb-6 formularios"
            ></v-text-field>

            <v-btn
              :disabled="!formValid"
              :loading="loading"
              size="large"
              type="submit"
              variant="elevated"
              block
              class="boton-iniciar"
            >
              Iniciar Sesión
            </v-btn>

            <div class="text-center mt-6">
              <p class="text-secondary">¿No tenés una cuenta creada?</p>
              <v-btn class="boton-registrarse mt-2" to="/registrarse">
                registrarse
              </v-btn>
            </div>

            <p v-if="error" class="text-error mt-4 text-center">{{ error }}</p>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import router from '../router'

const username = ref('')
const password = ref('')
const formValid = ref(false)
const loading = ref(false)
const error = ref(null)

const required = value => !!value || 'Este campo es requerido'

const auth = useAuthStore()

const handleLogin = async () => {
  loading.value = true
  error.value = null
  try {
    await auth.login(username.value, password.value)
    router.push('/Bienvenida')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
* {
  font-family: 'Poppins', sans-serif;
}

.login {
  display: flex;
  height: 100vh;
  background: #94618e;
}

.foto {
  flex: 1;
  background: url(../../public/InicioSeis.jpg) no-repeat center center;
  background-size: cover;
  display: none;
}

.formulario {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #94618e;
}

@media (min-width: 992px) {
  .foto {
    display: block;
  }
  .formulario {
    flex: 1;
  }
}

.login-card {
  background: #f8eee7; 
  color: #49274a;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  animation: aparecer 0.8s ease;
  padding: 2rem;
}

@keyframes aparecer {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.titulo-con-linea {
  position: relative;
  color: #49274a;
}
.titulo-con-linea::after {
  content: "";
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background-color: #49274a;
  border-radius: 3px;
}

.formularios input {
  color: #49274a;
  background-color: #ffffff;
}
.formularios label {
  color: #49274a;
}
.formularios input:focus {
  border-bottom: 2px solid #49274a !important;
  box-shadow: 0 2px 6px rgba(73, 39, 74, 0.3);
}

.boton-iniciar {
  background-color: #f8eee7 !important;
  color: #49274a !important;
  font-weight: bold;
  text-transform: uppercase;
  transition: all 0.3s ease;
  border: 2px solid #49274a;
}
.boton-iniciar:hover {
  background-color: #e2d5c7 !important;
  transform: scale(1.02);
}

.boton-registrarse {
  background-color: #f4decb !important;
  color: #49274a !important;
  font-weight: bold;
  border-radius: 12px;
  padding: 8px 20px;
  transition: all 0.3s ease;
}
.boton-registrarse:hover {
  background-color: #94618e !important;
  color: #ffffff !important;
  transform: scale(1.05);
}

.text-secondary,
.text-error {
  color: #49274a !important;
}
</style>
