import './styles.css';

const $grilla = document.getElementById("grilla-catalogo");
const $estado = document.getElementById("estado-mensaje");
const $paginacion = document.getElementById("paginacion");
const $formFiltros = document.getElementById("form-filtros");
const $searchBusqueda = document.getElementById("search-busqueda");

let urlActual = "https://dragonball-api.com/api/characters?limit=16";
let pagActual = 1;
let terminoBusqueda = "";

$formFiltros.addEventListener("submit", (e) => {
    e.preventDefault(); 
    terminoBusqueda = $searchBusqueda.value.trim();
    pagActual = 1; 
    
    if (terminoBusqueda) {
        urlActual = `https://dragonball-api.com/api/characters?name=${terminoBusqueda}&limit=16`;
    } else {
        urlActual = "https://dragonball-api.com/api/characters?limit=16";
    }
    cargarDatos(urlActual);
});

async function cargarDatos(url) {
    try {
        $estado.innerHTML = ""; 
        const $pCargando = document.createElement("p");
        $pCargando.classList.add("mensaje-cargando");
        $pCargando.textContent = "⏳ Cargando datos del multiverso...";
        $estado.appendChild($pCargando);

        $grilla.innerHTML = "";
        $paginacion.innerHTML = "";

        const respuesta = await fetch(url);

        if (respuesta.status === 404) {
            $estado.innerHTML = "";
            const $pError = document.createElement("p");
            $pError.classList.add("mensaje-error");
            $pError.textContent = "❌ No se pudo encontrar resultados. Intenta otras opciones.";
            $estado.appendChild($pError);
            return;
        }

        if (!respuesta.ok) {
            throw new Error(`Error de red: ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        await new Promise(resolve => setTimeout(resolve, 600)); 

        const resultados = Array.isArray(datos) ? datos : (datos.items || []);

        if (resultados.length === 0) {
            $estado.innerHTML = "";
            const $pError = document.createElement("p");
            $pError.classList.add("mensaje-error");
            $pError.textContent = "❌ No se pudo encontrar resultados. Intenta otras opciones.";
            $estado.appendChild($pError);
            return;
        } else {
            $estado.innerHTML = ""; 
        }

        renderizarTarjetas(resultados);
        
        if (datos.meta) {
            renderizarPaginacion(datos.meta, datos.links);
        }

    } catch (error) {
        console.error("Hubo un error:", error);
        $estado.innerHTML = "";
        const $pError = document.createElement("p");
        $pError.classList.add("mensaje-error");
        $pError.textContent = "❌ ¡Ups! No se pudo cargar el catálogo. Verificá tu conexión a internet.";
        $estado.appendChild($pError);
    }
}

function renderizarTarjetas(results) {
    results.forEach(dato => {
        const $tarjeta = document.createElement("article");
        $tarjeta.classList.add("tarjeta");

        const $img = document.createElement("img");
        $img.src = dato.image;
        $img.alt = dato.name;

        const $divInfo = document.createElement("div");
        $divInfo.classList.add("tarjeta-info");

        const $h4 = document.createElement("h4");
        $h4.textContent = dato.name;

        const crearParrafoDetalle = (etiquetaTexto, valorTexto) => {
            const $p = document.createElement("p");
            const $strong = document.createElement("strong");
            $strong.textContent = etiquetaTexto + " ";
            $p.appendChild($strong);
            $p.append(document.createTextNode(valorTexto || "Desconocido"));
            return $p;
        };

        const $pRaza = crearParrafoDetalle("Raza:", dato.race);
        const $pGenero = crearParrafoDetalle("Género:", dato.gender);
        const $pKi = crearParrafoDetalle("Ki:", dato.ki);
        const $pAfiliacion = crearParrafoDetalle("Afiliación:", dato.affiliation);

        $divInfo.appendChild($h4);
        $divInfo.appendChild($pRaza);
        $divInfo.appendChild($pGenero);
        $divInfo.appendChild($pKi);
        $divInfo.appendChild($pAfiliacion);

        $tarjeta.appendChild($img);
        $tarjeta.appendChild($divInfo);

        $grilla.appendChild($tarjeta);
    });
}

function renderizarPaginacion(meta, links) {
    $paginacion.innerHTML = "";

    const $btnAnterior = document.createElement("button");
    $btnAnterior.textContent = "⬅️ Anterior";
    $btnAnterior.classList.add("btn-paginacion");
    
    if (!links || !links.previous) {
        $btnAnterior.disabled = true;
    } else {
        $btnAnterior.addEventListener("click", () => {
            pagActual -= 1;
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
            cargarDatos(links.previous);
        });
    }

    const $pagActual = document.createElement("p");
    $pagActual.textContent = `Página ${meta.currentPage} de ${meta.totalPages}`;
    $pagActual.classList.add("info-paginacion");

    const $btnSiguiente = document.createElement("button");
    $btnSiguiente.textContent = "Siguiente ➡️";
    $btnSiguiente.classList.add("btn-paginacion");

    if (!links || !links.next) {
        $btnSiguiente.disabled = true;
    } else {
        $btnSiguiente.addEventListener("click", () => {
            pagActual += 1;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            cargarDatos(links.next);
        });
    }

    $paginacion.appendChild($btnAnterior);
    $paginacion.appendChild($pagActual);
    $paginacion.appendChild($btnSiguiente);
}

// Inicialización de la aplicación
cargarDatos(urlActual);