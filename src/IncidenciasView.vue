<template>
  <div class="incidencias-outer">
    <div class="incidencias-header">
      <div class="header-nav">
        <button :class="{active: view==='dashboard'}" @click="$emit('set-view', 'dashboard')">Dashboard</button>
        <button :class="{active: view==='incidencias'}" @click="$emit('set-view', 'incidencias')">Incidencias</button>
      </div>
      <div class="header-title">
        <h2>Reporte de Incidencias</h2>
      </div>
      <div class="header-actions">
        <button @click="showForm = true" class="add-btn">Añadir Incidencia</button>
      </div>
    </div>

    <div v-if="showForm" class="form-container">
      <h3>Nueva Incidencia</h3>
      <form @submit.prevent="submitForm">
        <label for="codigo">Código:</label>
        <input id="codigo" v-model="form.codigo" required />

        <label for="equipo">Equipo:</label>
        <input id="equipo" v-model="form.equipo" required />

        <!-- Fecha removed because it is auto-set by backend -->
        <!-- <label for="fecha">Fecha:</label>
        <input id="fecha" type="date" v-model="form.fecha" required /> -->

        <label for="estado">Estado:</label>
        <select id="estado" v-model="form.estado" required>
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En Proceso</option>
          <option value="resuelto">Resuelto</option>
        </select>

        <label for="prioridad">Prioridad:</label>
        <select id="prioridad" v-model="form.prioridad" required>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>

        <label for="detalle">Detalle:</label>
        <textarea id="detalle" v-model="form.detalle" required></textarea>

        <button type="submit">Guardar</button>
        <button type="button" @click="showForm = false">Cancelar</button>
      </form>
    </div>

    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Equipo</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th>Usuario</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="incidencia in incidencias" :key="incidencia.id">
            <td>{{ incidencia.codigo }}</td>
            <td>{{ incidencia.equipo }}</td>
            <td>{{ incidencia.fecha }}</td>
            <td>
              <span :class="['label', estadoClass(incidencia.estado)]">{{ incidencia.estado }}</span>
            </td>
            <td>
              <span :class="['label', prioridadClass(incidencia.prioridad)]">{{ incidencia.prioridad }}</span>
            </td>
            <td>{{ incidencia.usuario ? incidencia.usuario.username : '' }}</td>
            <td>{{ incidencia.detalle }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'IncidenciasView',
  props: ['view'],
  emits: ['set-view'],
  setup() {
    const incidencias = ref([])
    const showForm = ref(false)
    const form = ref({
      codigo: '',
      equipo: '',
      // fecha removed because it is auto-set by backend
      estado: 'pendiente',
      prioridad: 'baja',
      detalle: ''
    })

    const fetchIncidencias = () => {
      axios.get('/api/incidencias/')
        .then(response => {
          // Soporta respuesta paginada y no paginada
          const data = response.data;
          incidencias.value = Array.isArray(data) ? data : data.results;
        })
        .catch(error => {
          console.error('Error fetching incidencias:', error)
        })
    }

    const submitForm = () => {
      axios.post('/api/incidencias/', form.value)
        .then(() => {
          fetchIncidencias()
          showForm.value = false
          form.value = {
            codigo: '',
            equipo: '',
            // fecha removed because it is auto-set by backend
            estado: 'pendiente',
            prioridad: 'baja',
            detalle: ''
          }
        })
        .catch(error => {
          if (error.response && error.response.data) {
            console.error('Detalle del error:', error.response.data)
          }
          console.error('Error adding incidencia:', error)
        })
    }

    onMounted(() => {
      fetchIncidencias()
    })

    const estadoClass = (estado) => {
      switch (estado) {
        case 'pendiente': return 'estado-pendiente'
        case 'en_proceso': return 'estado-en-proceso'
        case 'resuelto': return 'estado-resuelto'
        default: return ''
      }
    }

    const prioridadClass = (prioridad) => {
      switch (prioridad) {
        case 'baja': return 'prioridad-baja'
        case 'media': return 'prioridad-media'
        case 'alta': return 'prioridad-alta'
        default: return ''
      }
    }

    return { incidencias, estadoClass, prioridadClass, showForm, form, submitForm }
  }
}
</script>

<style scoped>
.incidencias-outer {
  width: 100vw;
  min-height: 100vh;
  background: #f5f6fa;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.incidencias-header {
  width: 100%;
  background: #00b894;
  border-radius: 0 0 18px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 40px 24px 40px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  box-sizing: border-box;
}
.header-nav {
  display: flex;
  gap: 18px;
}
.header-title {
  flex: 1;
  display: flex;
  justify-content: center;
}
.header-title h2 {
  color: #fff;
  font-size: 2em;
  font-weight: 800;
  margin: 0;
  text-align: center;
}
.header-actions {
  display: flex;
  align-items: center;
}
.header-nav button {
  background: #fff;
  color: #00b894;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 1.1em;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  outline: none;
}
.header-nav button.active, .header-nav button:hover {
  background: #009966;
  color: #fff;
  box-shadow: 0 4px 16px rgba(0,185,148,0.10);
}
.add-btn {
  background: #fff;
  color: #00b894;
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  font-size: 1.1em;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  transition: background 0.2s;
}
.add-btn:hover {
  background: #009966;
  color: #fff;
}
.form-container {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 16px rgba(0,185,148,0.10);
  padding: 28px 32px 24px 32px;
  margin: 24px 0;
  max-width: 420px;
  width: 100%;
  font-size: 1.08em;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid #00b894;
}
.form-container h3 {
  margin-top: 0;
  color: #00b894;
  font-weight: 700;
  font-size: 1.18em;
  margin-bottom: 14px;
  width: 100%;
  text-align: left;
}
.form-container label {
  display: block;
  margin-top: 14px;
  margin-bottom: 6px;
  color: #009966;
  font-weight: 600;
  font-size: 1em;
  width: 100%;
}
.form-container input,
.form-container select,
.form-container textarea {
  width: 100%;
  padding: 10px 10px;
  border: 1.5px solid #00b894;
  border-radius: 6px;
  font-size: 1em;
  background: #f7fafc;
  transition: border 0.2s, box-shadow 0.2s;
  margin-bottom: 8px;
  box-sizing: border-box;
}
.form-container input:focus,
.form-container select:focus,
.form-container textarea:focus {
  border: 2px solid #009966;
  outline: none;
  background: #fff;
  box-shadow: 0 0 0 2px #00b89422;
}
.form-container button[type="submit"] {
  background: #00b894;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 24px;
  font-size: 1em;
  font-weight: 700;
  margin-top: 18px;
  margin-right: 10px;
  cursor: pointer;
  transition: background 0.2s;
}
.form-container button[type="submit"]:hover {
  background: #009966;
}
.form-container button[type="button"] {
  background: #e0e0e0;
  color: #333;
  border: none;
  border-radius: 6px;
  padding: 10px 24px;
  font-size: 1em;
  font-weight: 700;
  margin-top: 18px;
  cursor: pointer;
  transition: background 0.2s;
}
.form-container button[type="button"]:hover {
  background: #bdbdbd;
}
table {
  width: 98vw;
  max-width: 1600px;
  font-size: 1.18em;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.10);
  overflow: hidden;
  margin: 0 auto;
}
thead {
  background-color: #00b894;
  color: white;
  font-size: 1.1em;
  height: 56px;
}
th, td {
  padding: 22px 18px;
  border-bottom: 1px solid #e0e0e0;
  text-align: left;
  font-size: 1.1em;
}
th:first-child, td:first-child {
  border-top-left-radius: 16px;
}
th:last-child, td:last-child {
  border-top-right-radius: 16px;
}
tbody tr:last-child td {
  border-bottom: none;
}
.label {
  padding: 4px 12px;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  text-transform: capitalize;
  font-size: 1em;
}
.estado-pendiente {
  background-color: #e67e22;
}
.estado-en-proceso {
  background-color: #f1c40f;
  color: #222;
}
.estado-resuelto {
  background-color: #2ecc71;
}
.prioridad-baja {
  background-color: #3498db;
}
.prioridad-media {
  background-color: #f39c12;
}
.prioridad-alta {
  background-color: #e74c3c;
}
@media (max-width: 1200px) {
  table {
    width: 100vw;
    font-size: 1em;
  }
  .incidencias-container {
    padding: 12px 0;
  }
}
@media (max-width: 900px) {
  .incidencias-header {
    flex-direction: column;
    align-items: stretch;
    padding: 18px 10px 12px 10px;
    gap: 12px;
  }
  .header-title h2 {
    font-size: 1.3em;
  }
  .header-nav button, .add-btn {
    padding: 8px 10px;
    font-size: 1em;
  }
  .form-container {
    max-width: 98vw;
    padding: 12px 6vw 12px 6vw;
    font-size: 1em;
  }
  table {
    font-size: 1em;
    width: 100vw;
  }
}
@media (max-width: 600px) {
  .incidencias-header {
    padding: 8px 2vw 8px 2vw;
    gap: 8px;
  }
  .header-title h2 {
    font-size: 1.1em;
  }
  .form-container {
    max-width: 100vw;
    padding: 8px 2vw 8px 2vw;
    font-size: 0.98em;
  }
  table {
    font-size: 0.98em;
    width: 100vw;
  }
}
/* Scroll horizontal para tablas grandes en móviles */
.incidencias-outer {
  width: 100vw;
  overflow-x: hidden;
}
.table-responsive {
  width: 100vw;
  overflow-x: auto;
}
table {
  min-width: 700px;
}
</style>
