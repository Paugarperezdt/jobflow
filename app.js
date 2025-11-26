// Esperamos a que el HTML esté cargado antes de tocarlo
document.addEventListener("DOMContentLoaded", () => {
  // 1. Datos iniciales (solo se usan si no hay nada guardado todavía)
  const STORAGE_KEY = "jobflow_candidaturas";

  const CANDIDATURAS_INICIALES = [
    {
      id: 1,
      puesto: "Frontend Developer Junior",
      empresa: "Empresa X",
      ubicacion: "Barcelona · En remoto",
      fecha: "10/11/2025",
      estado: "En proceso",
      notas: "Feedback muy positivo en el primer contacto, a la espera de respuesta."
    },
    {
      id: 2,
      puesto: "Junior Laravel Developer",
      empresa: "Empresa Y",
      ubicacion: "Híbrido",
      fecha: "05/11/2025",
      estado: "Enviado",
      notas: "Candidatura enviada por LinkedIn, sin respuesta todavía."
    },
    {
      id: 3,
      puesto: "Junior Frontend (React)",
      empresa: "Empresa Z",
      ubicacion: "Remoto",
      fecha: "01/02/2026",
      estado: "Rechazado",
      notas: "Proceso interesante, pero finalmente eligieron a otra persona."
    }
  ];

  let candidaturas = [];

  // Intentamos cargar desde localStorage
  const datosGuardados = localStorage.getItem(STORAGE_KEY);
  if (datosGuardados) {
    candidaturas = JSON.parse(datosGuardados);
  } else {
    // Si no hay nada guardado, usamos las iniciales y las persistimos
    candidaturas = [...CANDIDATURAS_INICIALES];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidaturas));
  }

  // Calculamos el siguiente id disponible
  let siguienteId =
    candidaturas.length > 0
      ? Math.max(...candidaturas.map((c) => c.id)) + 1
      : 1;


  // 2. Elemento del DOM donde pintaremos las tarjetas
  const listaCandidaturas = document.getElementById("listaCandidaturas");
  const filtroEstado = document.getElementById("estado");
  const filtroBusqueda = document.getElementById("buscar");
  const panelFormulario = document.getElementById("panelFormulario");
  const formCandidatura = document.getElementById("formCandidatura");
  const btnNuevaCandidatura = document.getElementById("btnNuevaCandidatura");
  const btnCancelarFormulario = document.getElementById("btnCancelarFormulario");

  const inputPuesto = document.getElementById("puesto");
  const inputEmpresa = document.getElementById("empresa");
  const inputUbicacion = document.getElementById("ubicacion");
  const inputFecha = document.getElementById("fecha");
  const selectEstadoNueva = document.getElementById("estadoNueva");
  const textareaNotas = document.getElementById("notas");


  // 3. Según el estado, devolvemos clases Tailwind para el color de la pill
  function claseEstado(estado) {
    switch (estado) {
      case "En proceso":
        return "bg-emerald-50 text-emerald-700";
      case "Enviado":
        return "bg-slate-100 text-slate-700";
      case "Rechazado":
        return "bg-rose-50 text-rose-700";
      case "Entrevista":
        return "bg-sky-50 text-sky-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  // 4. Pinta en pantalla todas las candidaturas de la lista que le pasemos
  function pintarCandidaturas(lista) {
    // Vaciar lo que hubiera dentro del section
    listaCandidaturas.innerHTML = "";

    lista.forEach((c) => {
      const article = document.createElement("article");
      article.className =
        "bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3";

      article.innerHTML = `
        <div>
          <h2 class="text-sm font-semibold">${c.puesto}</h2>
          <p class="text-xs text-slate-500">${c.empresa} · ${c.ubicacion}</p>
          <p class="text-xs text-slate-500 mt-1">Aplicada el ${c.fecha}</p>
          <p class="text-xs text-slate-500 mt-2">
            ${c.notas}
          </p>
        </div>
        <div class="flex items-center gap-2 self-start sm:self-auto">
          <span class="inline-flex items-center rounded-full px-3 py-1 text-xs ${claseEstado(
            c.estado
          )}">
            ${c.estado}
          </span>
          <button class="text-xs text-slate-500 hover:text-slate-700">
            Ver detalle
          </button>
          <button
            class="text-xs text-rose-500 hover:text-rose-700 btn-borrar"
            data-id="${c.id}"
          >
            Borrar
          </button>
        </div>
      `;

      listaCandidaturas.appendChild(article);
    });

    // Añadimos comportamiento al botón "Borrar"
    const botonesBorrar = listaCandidaturas.querySelectorAll(".btn-borrar");

    botonesBorrar.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);

        const confirmar = confirm("¿Quieres borrar esta candidatura?");
        if (!confirmar) return;

        const index = candidaturas.findIndex((c) => c.id === id);
        if (index !== -1) {
          candidaturas.splice(index, 1);
          guardarEnLocalStorage();
          aplicarFiltro();
        }
      });
    });
  }


  function aplicarFiltro() {
    const estadoSeleccionado = filtroEstado.value;

    let lista = candidaturas;

    // Si hay texto en el buscador, filtramos primero por búsqueda
    const texto = filtroBusqueda.value.toLowerCase();
    if (texto.trim() !== "") {
      lista = lista.filter(c =>
        c.puesto.toLowerCase().includes(texto) ||
        c.empresa.toLowerCase().includes(texto)
      );
    }

    // Si además hay un estado seleccionado, filtramos también
    if (estadoSeleccionado !== "Todos") {
      lista = lista.filter(c => c.estado === estadoSeleccionado);
    }

    pintarCandidaturas(lista);
  }

  function abrirFormulario() {
    panelFormulario.classList.remove("hidden");
    // opcional: subir un poco la vista
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cerrarFormulario() {
    panelFormulario.classList.add("hidden");
    formCandidatura.reset();
  }

  function guardarEnLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidaturas));
  }

  // 4. Eventos
  filtroEstado.addEventListener("change", () => {
    aplicarFiltro();
  });

  filtroBusqueda.addEventListener("input", () => {
    aplicarFiltro();
  });


  btnNuevaCandidatura.addEventListener("click", () => {
    abrirFormulario();
  });

  btnCancelarFormulario.addEventListener("click", () => {
    cerrarFormulario();
  });

  formCandidatura.addEventListener("submit", (event) => {
    event.preventDefault(); // evita recargar la página

    const puesto = inputPuesto.value.trim();
    const empresa = inputEmpresa.value.trim();
    const ubicacion = inputUbicacion.value.trim() || "Sin especificar";
    const fechaRaw = inputFecha.value;
    const estado = selectEstadoNueva.value;
    const notas = textareaNotas.value.trim() || "Sin notas";

    if (!puesto || !empresa) {
      alert("Puesto y empresa son obligatorios 🙂");
      return;
    }

    // Damos formato bonito a la fecha si existe
    let fechaFormateada = "Sin fecha";
    if (fechaRaw) {
      const fechaObj = new Date(fechaRaw);
      fechaFormateada = fechaObj.toLocaleDateString("es-ES");
    }

    const nuevaCandidatura = {
      id: siguienteId++,
      puesto,
      empresa,
      ubicacion,
      fecha: fechaFormateada,
      estado,
      notas
    };

    // Añadimos al array
    candidaturas.push(nuevaCandidatura);
    guardarEnLocalStorage();

    // Volvemos a aplicar filtros actuales (estado + búsqueda)
    aplicarFiltro();

    // Reseteamos formulario y lo ocultamos
    cerrarFormulario();
  });


  // 5. Primera llamada: aplicamos filtros (estado = Todos, búsqueda vacía)
  aplicarFiltro();

});
