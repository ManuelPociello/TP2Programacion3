import './styles.css';

const $contenedorGrilla = document.getElementById("grilla-catalogo");
const $contenedorEstado = document.getElementById("estado-mensaje");

async function cargarPersonajes() {
    try {
        $contenedorEstado.innerHTML = `<p class="mensaje-cargando">⏳ Cargando personajes del multiverso...</p>`;
        $contenedorGrilla.innerHTML = "";

        const respuesta = await fetch("https://rickandmortyapi.com/api/character");

        if (!respuesta.ok) {
            throw new Error(`Error de red: ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        await new Promise(resolve => setTimeout(resolve, 800));

        $contenedorEstado.innerHTML = "";

        renderizarTarjetas(datos.results);

    } catch (error) {
        console.error("Hubo un error:", error);
        $contenedorEstado.innerHTML = `
            <p class="mensaje-error">❌ ¡Ups! No se pudo cargar el catálogo. Verificá tu conexión a internet.</p>
        `;
    }
}

function renderizarTarjetas(personajes) {
    personajes.forEach(personaje => {
        const $tarjeta = document.createElement("article");
        $tarjeta.classList.add("tarjeta");

        $tarjeta.innerHTML = `
            <img src="${personaje.image}" alt="${personaje.name}">
            <div class="tarjeta-info">
                <h4>${personaje.name}</h4>
                <p>Estado: ${personaje.status}</p>
                <p>Especie: ${personaje.species}</p>
            </div>
        `;

        $contenedorGrilla.appendChild($tarjeta);
    });
}

cargarPersonajes();