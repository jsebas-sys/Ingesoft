// Para integrar Django y Vue JS:
// 1. Sirve el build de Vue desde Django usando WhiteNoise o configura Django para servir archivos estáticos.
// 2. En settings.py de Django, agrega la ruta del build de Vue (por ejemplo, 'frontend/dist') a STATICFILES_DIRS.
// 3. Usa Django REST Framework para exponer la API de incidencias (GET, POST, etc).
// 4. En los componentes Vue, ajusta las URLs de axios para que apunten a las rutas de tu backend Django (por ejemplo, '/api/incidencias/').
// 5. Para desarrollo, puedes usar CORS y ejecutar Django y Vue por separado. Para producción, compila Vue y sirve el build desde Django.

// El código Vue actual ya está listo para consumir la API de Django si ajustas las URLs en los componentes.
import { createApp } from 'vue'
import IncidenciasView from './IncidenciasView.vue'
import DashboardView from './DashboardView.vue'

const App = {
  components: { IncidenciasView, DashboardView },
  data() {
    return { view: 'dashboard' }
  },
  template: `
    <div class="main-bg">
      <div class="main-content">
        <DashboardView v-if="view==='dashboard'" :view="view" @set-view="view = $event" />
        <IncidenciasView v-else :view="view" @set-view="view = $event" />
      </div>
    </div>
  `
}

createApp(App).mount('#app')

// Estilos globales para fondo
const style = document.createElement('style')
style.innerHTML = `
body, html {
  background: #f5f6fa !important;
  min-height: 100vh;
  margin: 0;
}
.main-bg {
  min-height: 100vh;
  background: #f5f6fa;
}
.main-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 80vh;
}
`
document.head.appendChild(style)
