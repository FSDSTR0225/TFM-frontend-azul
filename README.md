## 📘 README – Frontend de Link2Play

**Ruta:** `link2play-frontend/README.md`  
**Versión:** 1.0.0  
**Parte:** Frontend (React)

---

### 🎮 Descripción del Proyecto

Este frontend corresponde a la plataforma **Link2Play**, una app social para conectar gamers con intereses, juegos y horarios compatibles. Permite a los usuarios registrarse, buscar compañeros, publicar partidas, asistir a eventos y gestionar su perfil desde una interfaz moderna y responsive.

---

### 🛠️ Tecnologías Utilizadas

- **React** (con Vite)
- **React Router** (navegación por rutas)
- **Tailwind CSS** (estilos rápidos y modernos)
- **React Hook Form** (gestión de formularios)
- **Fetch API** (conexión con backend)
- **Context API** (gestión de estado global)
- **LocalStorage** (persistencia de sesión, tokens, etc.)

---

### 📁 Estructura de Carpetas

```
src/
├── api/              # Conexiones al backend
├── assets/           # Imágenes, logos, etc.
├── components/       # Componentes reutilizables (NavBar, Card, etc.)
├── context/          # Contextos globales (auth, usuario, etc.)
├── pages/            # Páginas principales (Home, Perfil, Buscar, etc.)
├── App.jsx           # Componente raíz con rutas
├── main.jsx          # Entrada principal de la app
├── index.css         # Estilos globales
public/
```

---

### 🚀 Cómo levantar el proyecto

#### 1. Instalar dependencias

```bash
cd link2play-frontend
npm install
```

#### 2. Iniciar la app en modo desarrollo

```bash
npm run dev
```

#### 3. Variables de entorno (opcional)

Si es necesario conectarse a un backend específico, puedes crear un archivo `.env` y añadir:

```
VITE_API_URL=http://localhost:3000
```

> Usa `import.meta.env.VITE_API_URL` para acceder a esta variable en el código.

---

### 📡 Comunicación con el Backend

- Todas las llamadas a la API están centralizadas en la carpeta `api/`
- Se utiliza `fetch` con headers personalizados para incluir el token JWT
- Se gestiona el login persistente con `localStorage` y un `context`

---

### 🔄 Navegación por Rutas

Se usa `React Router` con estructura tipo SPA:

- `/` → Home pública
- `/buscar` → Filtros y resultados
- `/perfil` → Perfil personal editable
- `/eventos` → Listado de eventos
- `/crear-evento` → Formulario para publicar partida o evento
- `/login` y `/register` → Autenticación
- Rutas protegidas con redirección si no hay token

---

### 🧪 Próximas funcionalidades frontend

- Validaciones personalizadas por tipo de juego
- Verificación visual de perfiles
- Filtros avanzados con búsqueda en tiempo real
- Mejoras UX en modo móvil

---

### 👥 Créditos

Frontend desarrollado por el **Equipo Azul**.  
Todos los derechos reservados. Proyecto privado.
