cd "/home/sebas-sys/Documentos/reporte de incidencias/frontend"git remote set-url origin https://github.com/jsebas-sys/Ingesoft.git<template>
  <div class="dashboard-outer">
    <div class="dashboard-header">
      <div class="header-left">
        <span class="header-icon">📊</span>
        <span class="header-title">Mi Vista</span>
      </div>
      <div class="header-nav">
        <button :class="{active: view==='dashboard'}" @click="$emit('set-view', 'dashboard')">Dashboard</button>
        <button :class="{active: view==='incidencias'}" @click="$emit('set-view', 'incidencias')">Incidencias</button>
      </div>
      <div class="header-user">
        <span class="user-name">ROBERTO LOPEZ</span>
        <span class="user-avatar"> <img src="https://ui-avatars.com/api/?name=Roberto+Lopez&background=009966&color=fff&rounded=true&size=32" alt="avatar" /> </span>
      </div>
    </div>
    <div class="dashboard-grid">
      <div class="card card-pendiente">
        <div class="card-header">
          <span class="card-icon">📝</span>
          <span>Pendiente ({{pendientes}}/3)</span>
        </div>
        <ul>
          <li><span class="label label-orange"></span> <span class="label-text">-</span></li>
          <li><span class="label label-green"></span> <span class="label-text">-</span></li>
          <li><span class="label label-yellow"></span> <span class="label-text">-</span></li>
        </ul>
      </div>
      <div class="card card-modified">
        <div class="card-header">
          <span class="card-icon">📅</span>
          <span>Modificadas recientemente (30 Días)</span>
        </div>
        <ul>
          <li><span class="label label-blue"></span> <span class="label-text">-</span></li>
          <li><span class="label label-pink"></span> <span class="label-text">-</span></li>
          <li><span class="label label-purple"></span> <span class="label-text">-</span></li>
        </ul>
      </div>
      <div class="chart-card">
        <h3>Resumen de casos</h3>
        <canvas ref="casesChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
import axios from 'axios'

const API_URL = import.meta.env.PROD
  ? 'https://backen-incidencias-production.up.railway.app/api/incidencias/'
  : '/api/incidencias/';

export default {
  name: 'DashboardView',
  props: ['view'],
  emits: ['set-view'],
  setup() {
    let chartInstance = null;
    const casesChart = ref(null);
    const pendientes = ref(0);
    const enProceso = ref(0);
    const resueltas = ref(0);
    onMounted(() => {
      axios.get(API_URL)
        .then(response => {
          const data = response.data;
          let lista = [];
          if (Array.isArray(data)) {
            lista = data;
          } else if (Array.isArray(data.results)) {
            lista = data.results;
          } else if (data && typeof data === 'object') {
            for (const key in data) {
              if (Array.isArray(data[key])) {
                lista = data[key];
                break;
              }
            }
          }
          // Calcular los contadores para el dashboard
          const statusCounts = { pendiente: 0, en_proceso: 0, resuelto: 0 };
          lista.forEach(incidencia => {
            if (incidencia.estado === 'pendiente') statusCounts.pendiente++;
            else if (incidencia.estado === 'en_proceso') statusCounts.en_proceso++;
            else if (incidencia.estado === 'resuelto') statusCounts.resuelto++;
          });
          pendientes.value = statusCounts.pendiente;
          enProceso.value = statusCounts.en_proceso;
          resueltas.value = statusCounts.resuelto;
          // Puedes exponer statusCounts como ref/reactive si lo necesitas en el template
          if (casesChart.value) {
            const ctx = casesChart.value.getContext('2d')
            if (chartInstance) {
              chartInstance.destroy();
            }
            chartInstance = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: ['Pendiente', 'En Proceso', 'Resuelto'],
                datasets: [{
                  label: 'Casos',
                  data: [
                    statusCounts.pendiente,
                    statusCounts.en_proceso,
                    statusCounts.resuelto
                  ],
                  backgroundColor: ['#e67e22', '#f1c40f', '#2ecc71']
                }]
              },
              options: {
                responsive: true,
                scales: {
                  y: { beginAtZero: true }
                }
              }
            })
          }
        })
        .catch(error => {
          console.error('Error fetching incidencias:', error)
        })
    })
    return { casesChart, pendientes, enProceso, resueltas }
  }
}
</script>

<style scoped>
.dashboard-outer {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.10);
  margin: 32px auto;
  max-width: 1600px;
  width: 96vw;
  min-width: 0;
  min-height: 90vh;
  padding-bottom: 48px;
}
.dashboard-header {
  background: #00b894;
  border-radius: 12px 12px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 48px 28px 36px;
  color: #fff;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.header-icon {
  font-size: 2em;
}
.header-title {
  font-size: 1.2em;
  font-weight: 700;
}
.header-nav {
  display: flex;
  gap: 18px;
  margin-left: 32px;
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
.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}
.header-btn {
  background: #fff;
  color: #00b894;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-weight: 600;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.header-btn:hover {
  background: #e0f7ef;
}
.header-user {
  display: flex;
  align-items: center;
  gap: 10px;
}
.user-name {
  font-weight: 600;
  font-size: 1em;
}
.user-avatar img {
  border-radius: 50%;
  width: 32px;
  height: 32px;
  border: 2px solid #fff;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 220px auto;
  gap: 48px;
  padding: 56px 56px 0 56px;
}
.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 0 0 18px 0;
  display: flex;
  flex-direction: column;
  font-size: 1.18em;
}
.card-header {
  background: #00b894;
  color: #fff;
  border-radius: 8px 8px 0 0;
  padding: 20px 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.18em;
}
.card ul {
  list-style: none;
  padding: 24px 24px 0 24px;
  margin: 0;
}
.card ul li {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.label {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 4px;
}
.label-orange { background: #e67e22; }
.label-green { background: #2ecc71; }
.label-yellow { background: #f1c40f; }
.label-blue { background: #3498db; }
.label-pink { background: #e84393; }
.label-purple { background: #9b59b6; }
.label-text { color: #888; font-size: 0.98em; }
.chart-card {
  grid-column: 1 / span 2;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 32px 32px 40px 32px;
  margin-top: 8px;
}
.chart-card h3 {
  margin-top: 0;
  color: #222;
  font-weight: 700;
  margin-bottom: 18px;
  text-align: center;
  font-size: 1.35em;
}
canvas {
  max-width: 100%;
  margin: 0 auto;
  display: block;
}
@media (max-width: 1200px) {
  .dashboard-outer {
    max-width: 100vw;
    width: 100vw;
    border-radius: 0;
    margin: 0;
  }
  .dashboard-grid {
    padding: 18px 6px 0 6px;
    gap: 18px;
  }
}
@media (max-width: 900px) {
  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
    padding: 18px 10px 18px 10px;
    gap: 16px;
  }
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-rows: 180px 180px auto;
    gap: 16px;
    padding: 12px 4px 0 4px;
  }
  .chart-card {
    grid-column: 1;
    padding: 12px 4px 18px 4px;
  }
  .card {
    font-size: 1em;
    padding: 0 0 10px 0;
  }
  .card-header {
    font-size: 1em;
    padding: 12px 10px;
  }
}
@media (max-width: 600px) {
  .dashboard-outer {
    max-width: 100vw;
    width: 100vw;
    border-radius: 0;
    margin: 0;
    padding-bottom: 0;
  }
  .dashboard-header {
    padding: 10px 2vw 10px 2vw;
    gap: 10px;
  }
  .dashboard-grid {
    padding: 4px 2vw 0 2vw;
    gap: 8px;
  }
  .card, .chart-card {
    font-size: 0.98em;
    padding: 0 0 6px 0;
  }
  .card-header {
    font-size: 0.98em;
    padding: 8px 6px;
  }
  .header-nav button, .header-btn {
    padding: 8px 10px;
    font-size: 1em;
  }
}
</style>
