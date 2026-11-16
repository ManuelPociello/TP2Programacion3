import './styles.css';

const $grilla = document.getElementById("grilla-catalogo");
const $estado = document.getElementById("estado-mensaje");
const $paginacion = document.getElementById("paginacion");

let urlActual = "https://rickandmortyapi.com/api/character";
let pagActual = 1;

async function cargarDatos(url) {
    try {
        $estado.innerHTML = `<p class="mensaje-cargando">⏳ Cargando personajes del multiverso...</p>`;
        $grilla.innerHTML = "";
        $paginacion.innerHTML = "";

        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error(`Error de red: ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        await new Promise(resolve => setTimeout(resolve, 600)); 

        $estado.innerHTML = "";

        renderizarTarjetas(datos.results);
        renderizarPaginacion(datos.info);

    } catch (error) {
        console.error("Hubo un error:", error);
        $estado.innerHTML = `
            <p class="mensaje-error">❌ ¡Ups! No se pudo cargar el catálogo. Verificá tu conexión a internet.</p>
        `;
    }
}

function renderizarTarjetas(results) {
    results.forEach(dato => {
        const $tarjeta = document.createElement("article");
        $tarjeta.classList.add("tarjeta");

        $tarjeta.innerHTML = `
            <img src="${dato.image}" alt="${dato.name}">
            <div class="tarjeta-info">
                <h4>${dato.name}</h4>
                <p>Estado: ${dato.status}</p>
                <p>Especie: ${dato.species}</p>
            </div>
        `;

        $grilla.appendChild($tarjeta);
    });
}

function renderizarPaginacion(info) {
    $paginacion.innerHTML = "";

    const $btnAnterior = document.createElement("button");
    $btnAnterior.textContent = "⬅️ Anterior";
    $btnAnterior.classList.add("btn-paginacion");
    
    if (!info.prev) {
        $btnAnterior.disabled = true;
    } else {
        $btnAnterior.addEventListener("click", () => {
            pagActual -= 1;
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
            cargarDatos(info.prev);
        });
    }

    const $pagActual = document.createElement("p");
    $pagActual.textContent = `${pagActual} ... ${info.pages}`;
    $pagActual.classList.add("info-paginacion");

    const $btnSiguiente = document.createElement("button");
    $btnSiguiente.textContent = "Siguiente ➡️";
    $btnSiguiente.classList.add("btn-paginacion");

    if (!info.next) {
        $btnSiguiente.disabled = true;
    } else {
        $btnSiguiente.addEventListener("click", () => {
            pagActual += 1;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            cargarDatos(info.next);

        });
    }

    $paginacion.appendChild($btnAnterior);
    $paginacion.appendChild($pagActual);
    $paginacion.appendChild($btnSiguiente);
}

cargarDatos(urlActual);