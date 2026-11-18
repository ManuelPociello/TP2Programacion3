import './styles.css';

const $grilla = document.getElementById("grilla-catalogo");
const $estado = document.getElementById("estado-mensaje");
const $paginacion = document.getElementById("paginacion");
const $formFiltros = document.getElementById("form-filtros");
const $searchBusqueda = document.getElementById("search-busqueda");
const $labelBusqueda = document.getElementById("label-busqueda");
const $tituloSeccion = document.getElementById("titulo-seccion");
const $btnPersonajes = document.getElementById("btn-personajes");
const $btnPlanetas = document.getElementById("btn-planetas");

let tipoBusqueda = "characters";
const urlBase = "https://dragonball-api.com/api/";
const limite = "limit=16";
let urlActual = `${urlBase}${tipoBusqueda}?${limite}`;
let pagActual = 1;
let terminoBusqueda = "";

$btnPersonajes.addEventListener("click", () => {
    tipoBusqueda = "characters";
    $btnPersonajes.classList.add("activo");
    $btnPlanetas.classList.remove("activo");
    $tituloSeccion.textContent = "Catálogo de Personajes";
    $labelBusqueda.textContent = "Buscar personaje por nombre:";
    $searchBusqueda.placeholder = "Ej. Goku, Vegeta, Piccolo...";
    reiniciarBusquedaYCargar();
});

$btnPlanetas.addEventListener("click", () => {
    tipoBusqueda = "planets";
    $btnPlanetas.classList.add("activo");
    $btnPersonajes.classList.remove("activo");
    $tituloSeccion.textContent = "Catálogo de Planetas";
    $labelBusqueda.textContent = "Buscar planeta por nombre:";
    $searchBusqueda.placeholder = "Ej. Namek, Tierra, Vegeta...";
    reiniciarBusquedaYCargar();
});

function reiniciarBusquedaYCargar() {
    terminoBusqueda = "";
    $searchBusqueda.value = "";
    pagActual = 1;
    urlActual = `${urlBase}${tipoBusqueda}?${limite}`;
    cargarDatos(urlActual);
}

$formFiltros.addEventListener("submit", (e) => {
    e.preventDefault(); 
    terminoBusqueda = $searchBusqueda.value.trim();
    pagActual = 1; 
    
    if (terminoBusqueda) {
        urlActual = `${urlBase}${tipoBusqueda}?name=${terminoBusqueda}&${limite}`;
    } else {
        urlActual = `${urlBase}${tipoBusqueda}?${limite}`;
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

        // Añadimos una clase distintiva si es la sección de planetas para un diseño adaptado
        if (tipoBusqueda === "planets") {
            $tarjeta.classList.add("es-planeta");
        }

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

        $divInfo.appendChild($h4);

        if (tipoBusqueda === "characters") {
            const $pRaza = crearParrafoDetalle("Raza:", dato.race);
            const $pGenero = crearParrafoDetalle("Género:", dato.gender);
            const $pKi = crearParrafoDetalle("Ki:", dato.ki);
            const $pAfiliacion = crearParrafoDetalle("Afiliación:", dato.affiliation);

            $divInfo.appendChild($pRaza);
            $divInfo.appendChild($pGenero);
            $divInfo.appendChild($pKi);
            $divInfo.appendChild($pAfiliacion);

        } else if (tipoBusqueda === "planets") {
            const $pDestruido = crearParrafoDetalle("¿Destruido?:", dato.isDestroyed ? "Sí" : "No");
            $divInfo.appendChild($pDestruido);

            // Renderizado seguro de la descripción del planeta con su clase estilizada
            if (dato.description) {
                const $pDesc = document.createElement("p");
                $pDesc.classList.add("descripcion-planeta");
                $pDesc.textContent = dato.description;
                $divInfo.appendChild($pDesc);
            }
        }

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