# 🐉 Dragon Ball App - Catálogo Web

Trabajo Práctico desarrollado para la materia **Programación III** (UTN San Nicolás, Año 2026).

## 🚀 Descripción del Proyecto
Aplicación web multipágina desarrollada con **Vite**, **HTML5**, **CSS3** y **JavaScript nativo (Vanilla JS)** bajo el paradigma de módulos ES (`ES Modules`). La plataforma consume datos en tiempo real de una API pública para ofrecer una experiencia interactiva de exploración del universo de Dragon Ball.

## 🛠️ Tecnologías y Herramientas Utilizadas
- **HTML5 & CSS3:** Estructura semántica, diseño adaptable mediante CSS Grid / Flexbox y temática visual personalizada.
- **JavaScript (ES Modules):** Uso de `async/await`, `fetch` para peticiones asíncronas y manipulación 100% nativa y segura del DOM (evitando el uso inseguro de `innerHTML`).
- **Vite:** Entorno de desarrollo frontend ultrarrápido y empaquetador multi-página (`index.html` y `catalogo.html`).
- **Control de Versiones:** Git y GitHub.

## 🌐 API Utilizada
- **API:** [The Dragon Ball API](https://dragonball-api.com/)
- **Endpoints consumidos:** 
  - Listado de personajes con paginación (`/api/characters?limit=16`).
  - Búsqueda dinámica de guerreros por nombre (`/api/characters?name=...`).

## 📂 Estructura del Proyecto
```text
├── public/                 # Recursos estáticos (imágenes y favicon)
├── src/
│   ├── styles.css          # Estilos globales y diseño responsivo
│   ├── main.js             # Lógica de la página principal (Landing)
│   └── catalogo.js         # Lógica de la grilla, búsqueda por Enter y paginación
├── index.html              # Página de inicio (Landing Page)
├── catalogo.html           # Página del catálogo de personajes
├── package.json            # Dependencias y scripts de Vite
└── vite.config.js          # Configuración de compilación multi-página
```

## ⚙️ Comandos de Ejecución
Asegúrate de tener instalado [Node.js](https://nodejs.org/) y ejecuta los siguientes comandos en tu terminal dentro de la carpeta del proyecto:

1. **Instalar dependencias:**
   ```bash
   npm install
   ```
2. **Iniciar el servidor de desarrollo local:**
   ```bash
   npm run dev
   ```
3. **Compilar para producción (Build):**
   ```bash
   npm run build
   ```
4. **Previsualizar la compilación de producción:**
   ```bash
   npm run preview
   ```