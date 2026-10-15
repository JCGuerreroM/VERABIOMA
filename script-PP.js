// ============================================================
// VeraBioma - Lógica de ENTRADA / VERIFICACION / LOGIN / REGISTER / ETC
// ============================================================
/*DATOS DEL PROTOTIPO*/
if (!localStorage.getItem("correoVerabioma")) {
    localStorage.setItem("correoVerabioma", "usuario@verabioma.com");
}

if (!localStorage.getItem("passwordVerabioma")) {
    localStorage.setItem("passwordVerabioma", "123456");
}

/*CAMBIAR PANTALLAS*/
function mostrarPantalla(id) {
    const pantallas = document.querySelectorAll(".pantalla");

    pantallas.forEach(function (pantalla) {
        pantalla.classList.add("hidden");
        pantalla.classList.remove("flex");
    });

    const pantallaActiva = document.getElementById(id);
    pantallaActiva.classList.remove("hidden");
    pantallaActiva.classList.add("flex");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* INICIAR SESIÓN (CONEXIÓN CON LA BASE DE DATOS) */
async function iniciarSesion() {
    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!correo || !password) {
        alert("Completa todos los campos.");
        return;
    }

    try {
        const respuesta = await fetch('http://localhost:3000/api/login', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Correo: correo, Password: password })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            localStorage.setItem("correoVerabioma", correo);
            localStorage.setItem('sesionIniciada', 'true');
            localStorage.setItem('usuarioActivo', correo);

            alert("¡Bienvenido!");
            mostrarPantalla("bienvenida");
            document.getElementById("password").value = "";
        } else {
            alert(datos.mensaje);
        }

    } catch (error) {
        console.error("Error de conexión:", error);
        alert("No se pudo conectar con el servidor.");
    }
}

/* REGISTRO (CONEXIÓN CON LA BASE DE DATOS) */
async function registrarUsuario() {
    const nombre = document.getElementById("nombreRegistro").value.trim();
    const apellido = document.getElementById("apellidoRegistro").value.trim();
    const correo = document.getElementById("correoRegistro").value.trim();
    const direccion = document.getElementById("direccionRegistro").value.trim();
    const telefono = document.getElementById("telefonoRegistro").value.trim();
    const codigoPostal = document.getElementById("codigoPostalRegistro").value.trim();
    const notaDireccion = document.getElementById("descripcionDireRegistro").value.trim();
    const password = document.getElementById("passwordRegistro").value.trim();
    const confirmar = document.getElementById("confirmarRegistro").value.trim();

    if (!nombre || !apellido || !correo || !direccion || !codigoPostal || !notaDireccion || !telefono || !password || !confirmar) {
        alert("Completa todos los campos.");
        return;
    }
    if (password.length < 6) {
        alert("La contraseña debe tener mínimo 6 caracteres.");
        return;
    }
    if (telefono.length < 10) {
        alert("El teléfono debe tener mínimo 10 números.");
        return;
    }
    if (password !== confirmar) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    try {
        const respuesta = await fetch('http://localhost:3000/api/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Nombre: nombre,
                Apellido: apellido,
                Correo: correo,
                Direccion: direccion,
                codigo_postal: codigoPostal,
                notas_direccion: notaDireccion,
                Telefono: telefono,
                Password: password
            })
        });

        if (respuesta.ok) {
            alert('¡Cuenta creada correctamente!');
            localStorage.setItem("correoPendiente", correo);
            mostrarPantalla("login");
        } else {
            const errorTexto = await respuesta.text();
            alert("Error al registrar: " + errorTexto);
        }
    } catch (error) {
        console.error("Error al registrar:", error);
        alert("No se pudo conectar con el servidor.");
    }
}

/*CONTINUAR CON GOOGLE*/
function continuarGoogle() {
    alert("Inicio de sesión con Google (Modo prototipo)");
    mostrarPantalla("bienvenida");
}

/*ENVIAR CÓDIGO*/
function enviarCodigo() {
    const correo = document.getElementById("correoRecuperacion").value.trim();

    if (correo === "") {
        alert("Ingresa un correo electrónico.");
        return;
    }

    // Guardamos el correo ingresado para reutilizarlo al guardar la nueva contraseña
    localStorage.setItem("correoRecuperacion", correo);

    alert("Código enviado correctamente.\n\n" + "Para este prototipo utiliza:\n\n12345");
    mostrarPantalla("verificacion");
}

/*VERIFICAR CÓDIGO*/
function verificarCodigo() {
    const codigo = document.getElementById("c1").value +
                   document.getElementById("c2").value +
                   document.getElementById("c3").value +
                   document.getElementById("c4").value +
                   document.getElementById("c5").value;

    if (codigo === "12345") {
        mostrarPantalla("nuevaPassword");
    } else {
        alert("Código incorrecto.");
    }
}

/*ENTRAR AL SISTEMA*/
function entrarSistema() {
    const nombre = localStorage.getItem("nombreGoogle");

    if (nombre) {
        document.getElementById("mensajeBienvenida").innerHTML = "Bienvenido " + nombre;
    } else {
        alert("Aquí comenzará el sistema principal de Verabioma.");
    }
}

/* CÓDIGO DE VERIFICACIÓN (FOCUS INPUTS) */
document.addEventListener("DOMContentLoaded", () => {
    const idPantalla = decodeURIComponent(window.location.hash.slice(1));
    const primeraPantalla = document.querySelector(".pantalla:not(.hidden)") || document.querySelector(".pantalla");

    if (idPantalla) {
        mostrarPantalla(idPantalla);
    } else if (primeraPantalla) {
        mostrarPantalla(primeraPantalla.id);
    }

    const campoCorreo = document.getElementById("correo");
    const correoPendiente = localStorage.getItem("correoPendiente");
    if (campoCorreo && correoPendiente) {
        campoCorreo.value = correoPendiente;
        localStorage.removeItem("correoPendiente");
    }

    const mensajeBienvenida = document.getElementById("mensajeBienvenida");
    const nombreGoogle = localStorage.getItem("nombreGoogle");
    if (mensajeBienvenida && nombreGoogle) {
        mensajeBienvenida.textContent = `¡Bienvenido ${nombreGoogle}!`;
    }

    const cajasCodigo = document.querySelectorAll(".codigo input");

    cajasCodigo.forEach((input, index) => {
        input.addEventListener("input", () => {
            if (input.value.length === 1 && index < cajasCodigo.length - 1) {
                cajasCodigo[index + 1].focus();
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && input.value === "" && index > 0) {
                cajasCodigo[index - 1].focus();
            }
        });
    });
});

/* CAMBIAR CONTRASEÑA (CONEXIÓN CON LA BASE DE DATOS) */
async function guardarPassword() {
    const nueva = document.getElementById("nueva").value.trim();
    const confirmar = document.getElementById("confirmar").value.trim();
    const correo = localStorage.getItem("correoRecuperacion") || localStorage.getItem("correoVerabioma") || "";

    if (!nueva || !confirmar) {
        alert("Completa todos los campos.");
        return;
    }

    if (nueva !== confirmar) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    try {
        const respuesta = await fetch('http://localhost:3000/api/cambiar-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                Correo: correo, 
                NuevaPassword: nueva 
            })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            alert('¡Contraseña actualizada correctamente!');
            document.getElementById("nueva").value = "";
            document.getElementById("confirmar").value = "";
            mostrarPantalla("login");
        } else {
            alert(datos.mensaje || "Error al cambiar contraseña.");
        }

    } catch (error) {
        console.error("Error de conexión:", error);
        alert("No se pudo conectar con el servidor.");
    }
}

/*GOOGLE LOGIC*/
function seleccionarCuenta(nombre, correo) {
    localStorage.setItem("nombreGoogle", nombre);
    localStorage.setItem("correoGoogle", correo);

    setTimeout(function () {
        mostrarPantalla("bienvenida");
    }, 1000);
}

function usarOtraCuenta() {
    const correo = document.getElementById("correoGoogle").value.trim();

    if (correo == "") {
        alert("Ingresa un correo.");
        return;
    }

    const nombre = correo.split("@")[0];

    localStorage.setItem("nombreGoogle", nombre);
    localStorage.setItem("correoGoogle", correo);

    mostrarPantalla("bienvenida");
}

/* FUNCIONES PARA LAS PAGINAS SEPARADAS */
async function iniciarSesionPagina() {
    const correoEl = document.getElementById("correo");
    const passwordEl = document.getElementById("password");
    if (!correoEl || !passwordEl) return;
    const Correo = correoEl.value.trim();
    const Password = passwordEl.value;
    if (!Correo || !Password) {
        alert("Completa el correo y la contraseña.");
        return;
    }
    try {
        const respuesta = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Correo, Password })
        });
        const datos = await respuesta.json();
        if (!respuesta.ok) {
            alert(datos.mensaje || "No se pudo iniciar sesión.");
            return;
        }
        localStorage.setItem("correoVerabioma", Correo);
        localStorage.setItem("usuarioActivo", Correo);
        localStorage.setItem("sesionIniciada", "true");
        alert("¡Bienvenido a Verabioma!");
        window.location.href = "index.html";
    } catch (error) {
        console.error(error);
        alert("No se pudo conectar con el servidor. Comprueba que esté iniciado.");
    }
}

async function registrarUsuarioPagina() {
    const ids = ["nombreRegistro", "apellidoRegistro", "correoRegistro", "direccionRegistro", "telefonoRegistro", "passwordRegistro", "confirmarRegistro"];
    const values = ids.map(id => (document.getElementById(id)?.value || "").trim());
    if (values.some(value => !value)) {
        alert("Completa todos los campos.");
        return;
    }
    const [Nombre, Apellido, Correo, Direccion, Telefono, Password, confirmar] = values;
    if (Password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
    }
    if (Password !== confirmar) {
        alert("Las contraseñas no coinciden.");
        return;
    }
    if (!/^\d{10,}$/.test(Telefono)) {
        alert("Escribe un teléfono con al menos 10 números.");
        return;
    }
    try {
        const respuesta = await fetch("http://localhost:3000/api/registro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Nombre, Apellido, Correo, Direccion, Telefono, Password })
        });
        const datos = await respuesta.json().catch(() => ({}));
        if (!respuesta.ok) {
            alert(datos.mensaje || "No se pudo crear la cuenta.");
            return;
        }
        alert("¡Cuenta creada correctamente!");
        window.location.href = "login.html";
    } catch (error) {
        console.error(error);
        alert("No se pudo conectar con el servidor. Comprueba que esté iniciado.");
    }
}

async function cambiarPasswordPagina() {
    const correo = (document.getElementById("correoRecuperacion")?.value || "").trim();
    const nueva = (document.getElementById("nueva")?.value || "").trim();
    const confirmar = (document.getElementById("confirmar")?.value || "").trim();
    if (!correo || !nueva || !confirmar) {
        alert("Completa el correo y ambos campos de contraseña.");
        return;
    }
    if (nueva.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
    }
    if (nueva !== confirmar) {
        alert("Las contraseñas no coinciden.");
        return;
    }
    try {
        const respuesta = await fetch("http://localhost:3000/api/cambiar-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Correo: correo, NuevaPassword: nueva })
        });
        const datos = await respuesta.json();
        if (!respuesta.ok) {
            alert(datos.mensaje || "No se pudo cambiar la contraseña.");
            return;
        }
        alert("Contraseña actualizada. Ya puedes iniciar sesión.");
        window.location.href = "login.html";
    } catch (error) {
        console.error(error);
        alert("No se pudo conectar con el servidor. Comprueba que esté iniciado.");
    }
}

// ============================================================
// VeraBioma - Lógica de Navegación y Vistas Dinámicas
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // Elementos principales de vistas
  const secInicio = document.getElementById('inicio');
  const secProductos = document.getElementById('producto');
  const secProductosOferta = document.getElementById('producto-oferta');
  const detallesProducto = document.querySelectorAll('.producto-detalle');
  const secResenas = document.getElementById('producto-resenas')
  const secReceta = document.getElementById('container-receta');
  const secPerfil = document.getElementById('conteiner-perfil');

  // Enlaces de navegación superior
  const navLinks = document.querySelectorAll('#nav ul li a');

  // Oculta absolutamente todas las secciones de contenido/catálogos
  function ocultarTodo() {
    if (secInicio) secInicio.style.display = 'none';
    if (secProductos) secProductos.style.display = 'none';
    if (secProductosOferta) secProductosOferta.style.display = 'none';
    if (secResenas) secResenas.style.display ='none';
    if (secReceta) secReceta.style.display ='none';
    if (secPerfil) secPerfil.style.display ='none';
    detallesProducto.forEach(detalle => {
      detalle.style.display = 'none';
      detalle.classList.remove('activo');
    });
  }

  // Muestra únicamente la sección de Inicio (banners, ofertas inicio, recetas, reseñas)
  function mostrarInicio() {
    ocultarTodo();
    if (secInicio) secInicio.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Muestra únicamente el Catálogo de Productos Normales (los 3 productos)
  function mostrarCatalogoNormal() {
    ocultarTodo();
    if (secProductos) secProductos.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Muestra únicamente el Catálogo de Ofertas del Día
  function mostrarCatalogoOfertas() {
    ocultarTodo();
    if (secProductosOferta) secProductosOferta.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Muestra únicamente la tarjeta Reseñas
  function mostrarResenas() {
    ocultarTodo();
    if (secResenas) secResenas.style.display = 'block';
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  // Muestra únicamente la catalogo de Recetas
  function mostrarReceta() {
    ocultarTodo();
    if (secReceta) secReceta.style.display = 'block';
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  // Muestra únicamente el perfil
  function mostrarPerfil() {
    ocultarTodo();
    if (secPerfil) secPerfil.style.display = 'block';
    window.scrollTo({top: 0, behavior: 'smooth'});
  }



  // Muestra la vista detallada de un producto específico
  function mostrarDetalleProducto(idProducto, modo) {
    ocultarTodo();
    const sufijo = modo === 'oferta' ? '-oferta' : '';
    const detalleTarget = document.getElementById(`producto-${idProducto}${sufijo}`);

    if (detalleTarget) {
      detalleTarget.style.display = 'flex';
      detalleTarget.classList.add('activo');
      detalleTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // ------------------------------------------------------------
  // NAVEGACIÓN DESDE EL MENÚ SUPERIOR (#nav)
  // ------------------------------------------------------------
  navLinks.forEach(link => {
    link.addEventListener('click', (evento) => {
      const href = link.getAttribute('href');

      if (href === 'inicio.html') {
        evento.preventDefault();
        mostrarInicio();
      } else if (href === 'producto.html') {
        evento.preventDefault();
        mostrarCatalogoNormal();
      } else if (href === 'perfil.html') {
        evento.preventDefault();
        mostrarPerfil();
      }
    });
  });

  // ------------------------------------------------------------
  // INTERACCIONES CON TARJETAS 
  // ------------------------------------------------------------
  
  // 1. Catálogo Normal (producto.html) -> Muestra solo el producto normal específico
  document.querySelectorAll('producto.html .product-card[data-product]').forEach((tarjeta) => {
    tarjeta.addEventListener('click', () => {
      mostrarDetalleProducto(tarjeta.dataset.product, 'normal');
    });
  });

  // 2. Inicio > "Ofertas del día" (#ofertas) -> Va al detalle de la oferta
  document.querySelectorAll('#ofertas .oferta[data-product]').forEach((tarjeta) => {
    tarjeta.addEventListener('click', () => {
      mostrarDetalleProducto(tarjeta.dataset.product, 'oferta');
    });
  });

  // 3. Catálogo Ofertas (producto.html-oferta) -> Muestra solo la vista de ese producto en oferta
  document.querySelectorAll('producto.html-oferta .product-card[data-product]').forEach((tarjeta) => {
    tarjeta.addEventListener('click', () => {
      mostrarDetalleProducto(tarjeta.dataset.product, 'oferta');
    });
  });

  // 4. Reseña (resena.html) -> Muestra la vista de Reseñas
  const resenaProducto = document.querySelectorAll('.resena-producto')
    resenaProducto.forEach(resena => {
      resena.addEventListener('click', () => {
        mostrarResenas()
      })
    })
    
  // 5. Receta (receta.html) -> Mustra lla vista de las Recetas (comida, bebidas, postres)
  const recetaProducto = document.querySelectorAll('.receta-producto')
    recetaProducto.forEach(receta => {
      receta.addEventListener('click', () => {
        mostrarReceta()
      })
    })




  // ------------------------------------------------------------
  // CONTROLES DE CANTIDAD (+ / -)
  // ------------------------------------------------------------
  document.querySelectorAll('.selector-cantidad').forEach((selector) => {
    const input = selector.querySelector('input[type="number"]');
    const btnMenos = selector.querySelector('.btn-menos');
    const btnMas = selector.querySelector('.btn-mas');
    if (!input || !btnMenos || !btnMas) return;

    btnMas.addEventListener('click', () => {
      input.value = parseInt(input.value, 10) + 1;
    });

    btnMenos.addEventListener('click', () => {
      const valorActual = parseInt(input.value, 10);
      if (valorActual > 1) {
        input.value = valorActual - 1;
      }
    });
  });

  // ------------------------------------------------------------
  // FAVORITOS Y CARRITO (aun no se añade nada, porque no existe el carrito)
  // ------------------------------------------------------------
  document.querySelectorAll('.btn-fav, .btn-favorito').forEach((boton) => {
    boton.addEventListener('click', (evento) => {
      evento.stopPropagation();
      boton.classList.toggle('activo');
      const icono = boton.querySelector('i');
      if (icono) {
        icono.classList.toggle('fa-regular');
        icono.classList.toggle('fa-solid');
      }
    });
  });

  document.querySelectorAll('.btn-add, .btn-carrito').forEach((boton) => {
    boton.addEventListener('click', (evento) => {
      evento.stopPropagation();
      const contenidoOriginal = boton.innerHTML;
      boton.innerHTML = '<i class="fa-solid fa-check"></i> Añadido';
      boton.disabled = true;

      setTimeout(() => {
        boton.innerHTML = contenidoOriginal;
        boton.disabled = false;
      }, 1200);
    });
  });

  // Estado inicial de la página
  mostrarInicio();
});

/* ==========================================
   RESEÑA / RESENA
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Variables de estado
  let productoSeleccionado = null;
  let calificacion = 0;

  // Elementos del DOM
  const tarjetasProducto = document.querySelectorAll('.card-prod');
  const estrellas = document.querySelectorAll('.estrella');
  const textareaResena = document.getElementById('resena-text');
  const btnEnviar = document.getElementById('btn-enviar');
  const btnCancelar = document.getElementById('btn-cancelar');
  const btnCancelarI = document.getElementById('btn-cancelar-I');

  // 1. Selección de Producto
  tarjetasProducto.forEach((tarjeta) => {
    tarjeta.addEventListener('click', () => {
      tarjetasProducto.forEach((t) => t.classList.remove('seleccionado'));
      tarjeta.classList.add('seleccionado');
      productoSeleccionado = tarjeta.getAttribute('data-producto');
    });
  });

  // 2. Selección de Calificación con Estrellas
  estrellas.forEach((estrella) => {
    // Al pasar el mouse (hover)
    estrella.addEventListener('mouseover', () => {
      const valor = parseInt(estrella.getAttribute('data-value'));
      actualizarEstrellas(valor);
    });

    // Al quitar el mouse
    estrella.addEventListener('mouseout', () => {
      actualizarEstrellas(calificacion);
    });

    // Al hacer clic
    estrella.addEventListener('click', () => {
      calificacion = parseInt(estrella.getAttribute('data-value'));
      actualizarEstrellas(calificacion);
    });
  });

  function actualizarEstrellas(valor) {
    estrellas.forEach((e) => {
      const eValor = parseInt(e.getAttribute('data-value'));
      if (eValor <= valor) {
        e.classList.add('activa');
      } else {
        e.classList.remove('activa');
      }
    });
  }

  // 3. Botón Enviar Reseña
  btnEnviar.addEventListener('click', () => {
    const textoResena = textareaResena.value.trim();

    if (!productoSeleccionado) {
      alert('Por favor, selecciona un producto para opinar.');
      return;
    }

    if (calificacion === 0) {
      alert('Por favor, califica el producto con las estrellas.');
      return;
    }

    if (textoResena === '') {
      alert('Por favor, escribe tu reseña antes de enviar.');
      return;
    }

    // Confirmación exitosa
    alert(`¡Muchas gracias! Tu reseña sobre "${productoSeleccionado}" con ${calificacion} estrella(s) ha sido enviada con éxito.`);
    
    // Reiniciar formulario
    reiniciarFormulario();
  });

  // 4. Boton Cancelar
  btnCancelar.addEventListener('click', () => {
    reiniciarFormulario();
  });

  function reiniciarFormulario() {
    productoSeleccionado = null;
    calificacion = 0;
    tarjetasProducto.forEach((t) => t.classList.remove('seleccionado'));
    actualizarEstrellas(0);
    textareaResena.value = '';
  }

});

/* ==========================================
   RECETA    /   RESETA
========================================== */

/**
 * Muestra las recetas de la categoría seleccionada y oculta las demás.
 * @param {string} categoryId - El ID de la categoría a mostrar ('bebidas', 'comidas', 'postres')
 */
function showRecipes(categoryId) {
  // Ocultar todos los contenedores de recetas
  const containers = document.querySelectorAll('.recipes-container');
  containers.forEach(container => {
    container.classList.remove('active');
  });

  // Desactivar todos los botones de las pestañas
  const buttons = document.querySelectorAll('.tab-button');
  buttons.forEach(button => {
    button.classList.remove('active');
  });

  // Activar el contenedor de la categoría seleccionada
  const selectedContainer = document.getElementById(categoryId);
  if (selectedContainer) {
    selectedContainer.classList.add('active');
  }

  // Activar el botón correspondiente
  const activeButton = Array.from(buttons).find(button => 
    button.textContent.trim().toLowerCase() === categoryId
  );
  
  if (activeButton) {
    activeButton.classList.add('active');
  }
  
  // Cerrar cualquier receta expandida al cambiar de categoría y restaurar el orden
  const expandedCards = document.querySelectorAll('.recipe-card.expanded');
  expandedCards.forEach(card => {
    card.classList.remove('expanded');
    card.style.order = ''; // Restablecer orden CSS
    const button = card.querySelector('.toggle-details');
    if (button) {
      button.textContent = 'Ver Detalles';
    }
  });
}

/**
 * Alterna la visibilidad de la sección de detalles de una receta.
 * Mueve la receta activa al primer lugar.
 * @param {HTMLElement} button - El botón "Ver Detalles" que fue clikeado
 */
function toggleDetails(button) {
  // Obtener la tarjeta completa (.recipe-card)
  const card = button.closest('.recipe-card');
  if (!card) return;

  const container = card.closest('.recipes-container');
  const isExpanding = !card.classList.contains('expanded');

  // 1. Cerrar todas las demás tarjetas expandidas y restaurar su orden
  const allCards = container.querySelectorAll('.recipe-card');
  allCards.forEach(c => {
    if (c !== card) {
      c.classList.remove('expanded');
      c.style.order = ''; // Volver al orden normal
      const otherBtn = c.querySelector('.toggle-details');
      if (otherBtn) {
        otherBtn.textContent = 'Ver Detalles';
      }
    }
  });

  // 2. Aplicar lógica a la tarjeta actual
  if (isExpanding) {
    card.classList.add('expanded');
    button.textContent = 'Ocultar Detalles';

    // MOVER AL INICIO: Asignamos un orden menor en CSS Grid/Flex para que aparezca primero
    card.style.order = '-1';

    // Desplazar la vista suavemente al inicio del contenedor de recetas
    requestAnimationFrame(() => {
      const headerHeight = 130; // Ajusta según la altura de tu header fijo si tienes uno
      const containerTop = container.getBoundingClientRect().top + window.pageYOffset;
      
      window.scrollTo({
        top: containerTop - headerHeight - 10,
        behavior: 'smooth'
      });
    });
  } else {
    card.classList.remove('expanded');
    button.textContent = 'Ver Detalles';
    
    // Restaurar posición original
    card.style.order = '';

    requestAnimationFrame(() => {
      const cardRect = card.getBoundingClientRect();
      const headerHeight = 130;
      
      if (cardRect.top < headerHeight || cardRect.top > window.innerHeight) {
        const scrollPosition = window.pageYOffset + cardRect.top - headerHeight - 20;
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    });
  }
}

// Función para el menú responsive
function mostrarOcultarMenu() {
  const nav = document.getElementById('nav');
  if (nav) {
    nav.classList.toggle('responsive');
  }
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
  // Guardar el orden original de cada tarjeta en sus contenedores
  const containers = document.querySelectorAll('.recipes-container');
  containers.forEach(container => {
    const cards = container.querySelectorAll('.recipe-card');
    cards.forEach((card, index) => {
      card.style.order = index; // Asignar orden por defecto según su posición inicial
    });
  });

  // Asegurarse de que no haya tarjetas expandidas al inicio
  const expandedCards = document.querySelectorAll('.recipe-card.expanded');
  expandedCards.forEach(card => {
    card.classList.remove('expanded');
    card.style.order = '';
    const button = card.querySelector('.toggle-details');
    if (button) {
      button.textContent = 'Ver Detalles';
    }
  });
  
  // Event listeners para los botones de las pestañas
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const categoryId = this.textContent.trim().toLowerCase();
      showRecipes(categoryId);
    });
  });
});

/* ==========================================
   PERFIL
   ========================================== */
// Función para alternar entre formularios
function toggleForm(formId) {
  const datosForm = document.getElementById('datos');
  const tarjetaForm = document.getElementById('tarjeta');
  const btnDatos = document.querySelector('.btn-primary');
  const btnTarjeta = document.querySelector('.btn-secondary');
  
  if (formId === 'datos') {
    datosForm.classList.remove('hidden');
    tarjetaForm.classList.add('hidden');
    btnDatos.classList.add('active');
    btnTarjeta.classList.remove('active');
  } else if (formId === 'tarjeta') {
    tarjetaForm.classList.remove('hidden');
    datosForm.classList.add('hidden');
    btnTarjeta.classList.add('active');
    btnDatos.classList.remove('active');
  }
}
