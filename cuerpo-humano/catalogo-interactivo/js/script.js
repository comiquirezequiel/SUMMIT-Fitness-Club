document.addEventListener('DOMContentLoaded', () => {
    const modeloPrincipal    = document.getElementById('modelo-interactivo');
    const partesModelo       = document.querySelectorAll('.parte-modelo');
    const contenedorDetalle  = document.getElementById('contenedor-detalle');
    const subMusculos        = document.querySelectorAll('.sub-musculo');
    const btnVolver          = document.getElementById('btn-volver');
    const columnaLista       = document.getElementById('columna-lista');
    const columnaVisual      = document.getElementById('columna-visual');
    const tituloPanel        = document.getElementById('titulo-panel');
    const textoMecanico      = document.getElementById('texto-mecanico');
    const instruccionInicial = document.getElementById('instruccion-inicial');
    const leyendaColores     = document.getElementById('leyenda-colores');
    const tooltip            = document.getElementById('tooltip-zona');
    const badgeZona          = document.getElementById('badge-zona-activa');

    let animando          = false;
    let badgeTimeout      = null;
    let ultimoTituloVisto = '';

    // ──────────────────────────────────────────────
    // BASE DE DATOS
    // ──────────────────────────────────────────────
    const infoMecanicaData = {
        // PECHO
        "pecho-superior": {
            titulo: "Fibras Claviculares (Pecho Superior)",
            mecanica: "<strong>Función principal:</strong> Flexión de hombro y aducción horizontal.<br><br><strong>Ejercicios Clave:</strong><br>• Press inclinado con barra o mancuernas<br>• Aperturas en polea alta<br>• Fondos con inclinación hacia adelante",
            color: "#22C55E"
        },
        "pecho-medio": {
            titulo: "Fibras Esternocostales (Pecho Medio)",
            mecanica: "<strong>Función principal:</strong> Aducción horizontal pura.<br><br><strong>Ejercicios Clave:</strong><br>• Press plano con barra<br>• Press con mancuernas en banco plano<br>• Peck-Deck / Mariposa",
            color: "#F97316"
        },
        "pecho-inferior": {
            titulo: "Fibras Abdominales (Pecho Inferior)",
            mecanica: "<strong>Función principal:</strong> Aducción horizontal descendente.<br><br><strong>Ejercicios Clave:</strong><br>• Fondos en paralelas<br>• Press declinado<br>• Aperturas en polea baja",
            color: "#C026D3"
        },

        // BRAZO FRENTE
        "deltoide-frontal": {
            titulo: "Deltoides Anterior (Hombro Frontal)",
            mecanica: "<strong>Función principal:</strong> Flexión y rotación interna del hombro.<br><br><strong>Ejercicios Clave:</strong><br>• Press militar con barra<br>• Elevaciones frontales con mancuernas<br>• Press Arnold",
            color: "#EF4444"
        },
        "deltoide-lateral": {
            titulo: "Deltoides Medio (Hombro Lateral)",
            mecanica: "<strong>Función principal:</strong> Abducción del brazo (alejarlo del cuerpo).<br><br><strong>Ejercicios Clave:</strong><br>• Elevaciones laterales con mancuernas<br>• Remo al mentón agarre ancho<br>• Elevaciones en polea baja lateral",
            color: "#22D3EE"
        },
        "cabeza-larga": {
            titulo: "Bíceps — Cabeza Larga",
            mecanica: "<strong>Función principal:</strong> Flexión de codo y supinación; parte exterior del bíceps.<br><br><strong>Ejercicios Clave:</strong><br>• Curl con mancuernas (codos atrás)<br>• Curl martillo<br>• Curl en banco inclinado",
            color: "#EAB308"
        },
        "cabeza-corta": {
            titulo: "Bíceps — Cabeza Corta",
            mecanica: "<strong>Función principal:</strong> Flexión de codo; parte interior que da grosor al brazo.<br><br><strong>Ejercicios Clave:</strong><br>• Curl predicador (Scott)<br>• Curl con barra agarre ancho<br>• Curl en polea baja",
            color: "#A855F7"
        },
        "antebrazo-braquiorradial": {
            titulo: "Músculo Braquiorradial",
            mecanica: "<strong>Función principal:</strong> Flexión del antebrazo en posición neutra.<br><br><strong>Ejercicios Clave:</strong><br>• Curl invertido con barra<br>• Curl martillo<br>• Dominadas con agarre prono",
            color: "#EC4899"
        },
        "antebrazo-flexores": {
            titulo: "Flexores de la Muñeca",
            mecanica: "<strong>Función principal:</strong> Flexión palmar de la muñeca y agarre.<br><br><strong>Ejercicios Clave:</strong><br>• Curl de muñeca con barra<br>• Paseo del granjero<br>• Dead hang en barra",
            color: "#10B981"
        },

        // BRAZO TRASERO
        "deltoides-posterior": {
            titulo: "Deltoides Posterior (Hombro Atrás)",
            mecanica: "<strong>Función principal:</strong> Extensión horizontal y rotación externa del hombro.<br><br><strong>Ejercicios Clave:</strong><br>• Pájaros (Rear delt flyes)<br>• Face pull en polea alta<br>• Peck-deck invertido",
            color: "#FFA726"
        },
        "triceps-larga": {
            titulo: "Tríceps — Cabeza Larga",
            mecanica: "<strong>Función principal:</strong> Extensión del codo y estabilización del hombro. Es la cabeza más grande del tríceps.<br><br><strong>Ejercicios Clave:</strong><br>• Extensiones tras nuca<br>• Press francés con barra EZ<br>• Rompecráneos",
            color: "#AB47BC"
        },
        "triceps-lateral": {
            titulo: "Tríceps — Cabeza Lateral",
            mecanica: "<strong>Función principal:</strong> Extensión del codo. Da el aspecto de 'herradura' al brazo.<br><br><strong>Ejercicios Clave:</strong><br>• Extensiones en polea alta con cuerda<br>• Press de banca con agarre cerrado<br>• Fondos en paralelas",
            color: "#EC407A"
        },
        "triceps-medial": {
            titulo: "Tríceps — Cabeza Medial",
            mecanica: "<strong>Función principal:</strong> Extensión del codo. Trabaja en sinergia con las otras cabezas.<br><br><strong>Ejercicios Clave:</strong><br>• Extensiones en polea alta con barra recta<br>• Tate press con mancuernas",
            color: "#26C6DA"
        },
        "antebrazo-extensores": {
            titulo: "Extensores del Antebrazo",
            mecanica: "<strong>Función principal:</strong> Extensión de la muñeca y los dedos.<br><br><strong>Ejercicios Clave:</strong><br>• Curl de muñeca invertido<br>• Rodillo de muñeca (Wrist roller)",
            color: "#FF7043"
        },

        // PIERNA TRASERA
        "gluteo": {
            titulo: "Glúteo Mayor y Medio",
            mecanica: "<strong>Función principal:</strong> Extensión, abducción y rotación externa de la cadera. Estabiliza la pelvis.<br><br><strong>Ejercicios Clave:</strong><br>• Hip thrust (Empuje de cadera)<br>• Sentadillas profundas<br>• Peso muerto rumano<br>• Patada de glúteo en polea",
            color: "#6366F1"
        },
        "isquiotibiales": {
            titulo: "Isquiosurales (Femorales)",
            mecanica: "<strong>Función principal:</strong> Flexión de rodilla y extensión de cadera.<br><br><strong>Ejercicios Clave:</strong><br>• Peso muerto rumano o con piernas rígidas<br>• Curl femoral acostado<br>• Curl femoral sentado<br>• Buenos días (Good mornings)",
            color: "#EF4444"
        },
        "gemelos": {
            titulo: "Gastrocnemio y Sóleo (Pantorrillas)",
            mecanica: "<strong>Función principal:</strong> Flexión plantar del pie (ponerse en puntas de pie).<br><br><strong>Ejercicios Clave:</strong><br>• Elevación de talones de pie (Gastrocnemio)<br>• Elevación de talones sentado (Sóleo)<br>• Saltos a la cuerda",
            color: "#4ADE80"
        },
        "abductores": {
            titulo: "Abductores de Cadera",
            mecanica: "<strong>Función principal:</strong> Separar la pierna del eje del cuerpo (abducción).<br><br><strong>Ejercicios Clave:</strong><br>• Máquina de abductores<br>• Abducción en polea baja<br>• Banded lateral walks (caminata lateral con banda)",
            color: "#FCD34D"
        },

        // ABDOMEN
        "recto-abdominal": {
            titulo: "Recto Abdominal",
            mecanica: "<strong>Función principal:</strong> Flexión del tronco (aproximar costillas a pelvis).<br><br><strong>Ejercicios Clave:</strong><br>• Crunch con peso<br>• Elevación de piernas en barra<br>• Rueda abdominal (ab wheel)<br>• Cable crunch",
            color: "#F87171"
        },
        "oblicuos": {
            titulo: "Oblicuos (Interno y Externo)",
            mecanica: "<strong>Función principal:</strong> Rotación y flexión lateral del tronco; estabilización de la columna.<br><br><strong>Ejercicios Clave:</strong><br>• Russian twist con peso<br>• Cable woodchop (leñador)<br>• Plancha lateral<br>• Crunch de bicicleta",
            color: "#FBBF24"
        },
        "serrato-anterior": {
            titulo: "Serrato Anterior",
            mecanica: "<strong>Función principal:</strong> Protracción y rotación de la escápula; fija el omóplato al tórax.<br><br><strong>Ejercicios Clave:</strong><br>• Push-up plus (empuje extra al final)<br>• Press en polea con protracción<br>• Pullover con mancuerna",
            color: "#38BDF8"
        },
        // ESPALDA
        "trapecio-superior": {
            titulo: "Trapecio Superior",
            mecanica: "<strong>Función principal:</strong> Elevación y retracción de los hombros; extensión del cuello.<br><br><strong>Ejercicios Clave:</strong><br>• Encogimientos con barra o mancuernas<br>• Remo al mentón agarre estrecho<br>• Face pull en polea alta",
            color: "#FB923C"
        },
        "espalda-alta": {
            titulo: "Romboides y Trapecio Medio",
            mecanica: "<strong>Función principal:</strong> Retracción de las escápulas; mantener la postura erguida.<br><br><strong>Ejercicios Clave:</strong><br>• Remo con barra o mancuernas<br>• Face pull<br>• Remo en polea baja con agarre estrecho<br>• Band pull-apart",
            color: "#818CF8"
        },
        "dorsales-anchos": {
            titulo: "Dorsal Ancho (Latissimus Dorsi)",
            mecanica: "<strong>Función principal:</strong> Extensión, aducción y rotación interna del hombro. Da la forma de 'V' a la espalda.<br><br><strong>Ejercicios Clave:</strong><br>• Dominadas con agarre prono<br>• Jalón al pecho en polea alta<br>• Remo con barra en pronación<br>• Pullover",
            color: "#2DD4BF"
        },
        "lumbar": {
            titulo: "Erectores Espinales (Zona Lumbar)",
            mecanica: "<strong>Función principal:</strong> Extensión y estabilización de la columna vertebral.<br><br><strong>Ejercicios Clave:</strong><br>• Peso muerto convencional<br>• Hiperextensiones en banco romano<br>• Good mornings<br>• Superman (suelo)",
            color: "#F472B6"
        },
        // PIERNA FRENTE
        "cuadriceps": {
            titulo: "Cuádriceps (4 cabezas)",
            mecanica: "<strong>Función principal:</strong> Extensión de la rodilla; el recto femoral también flexiona la cadera.<br><br><strong>Ejercicios Clave:</strong><br>• Sentadilla con barra<br>• Prensa de piernas<br>• Extensión en máquina<br>• Zancadas (lunges)",
            color: "#84CC16"
        },
        "aductores": {
            titulo: "Aductores (Cara Interna)",
            mecanica: "<strong>Función principal:</strong> Aducción del muslo (cerrar las piernas); estabilización de la cadera.<br><br><strong>Ejercicios Clave:</strong><br>• Sentadilla sumo<br>• Aductores en máquina<br>• Zancada lateral<br>• Cable kick-in",
            color: "#FB923C"
        },
        "tibia-anterior": {
            titulo: "Tibial Anterior",
            mecanica: "<strong>Función principal:</strong> Dorsiflexión del pie (levantar la punta del pie); inversión del pie.<br><br><strong>Ejercicios Clave:</strong><br>• Elevaciones de puntera de pie (toe raises)<br>• Caminar de talones<br>• Resistencia con banda elástica en dorsiflexión",
            color: "#38BDF8"
        }
    };

    // Leyendas por vista
    const leyendasPorVista = {
        "vista-pecho":          ["pecho-superior", "pecho-medio", "pecho-inferior"],
        "vista-brazos-frente":  ["deltoide-frontal", "deltoide-lateral", "cabeza-larga", "cabeza-corta", "antebrazo-braquiorradial", "antebrazo-flexores"],
        "vista-brazos-trasero": ["deltoides-posterior", "triceps-larga", "triceps-lateral", "triceps-medial", "antebrazo-extensores"],
        "vista-piernas-trasera":["gluteo", "isquiotibiales", "gemelos", "abductores"],
        "vista-abdomen":        ["recto-abdominal", "oblicuos", "serrato-anterior"],
        "vista-espalda":        ["trapecio-superior", "espalda-alta", "dorsales-anchos", "lumbar"],
        "vista-piernas-frente": ["cuadriceps", "aductores", "tibia-anterior"]
    };

    // ──────────────────────────────────────────────
    // HELPERS
    // ──────────────────────────────────────────────

    /** Muestra el badge de zona activa brevemente */
    function mostrarBadge(titulo) {
        clearTimeout(badgeTimeout);
        badgeZona.textContent = `↩ ${titulo}`;
        badgeZona.classList.add('visible');
        badgeTimeout = setTimeout(() => {
            badgeZona.classList.remove('visible');
        }, 2500);
    }

    /** Construye la leyenda de colores para la vista dada */
    function construirLeyenda(idVista) {
        const ids = leyendasPorVista[idVista];
        if (!ids) { leyendaColores.style.display = 'none'; return; }

        leyendaColores.innerHTML = '<div class="leyenda-titulo">Regiones</div>';
        ids.forEach(id => {
            const datos = infoMecanicaData[id];
            if (!datos) return;
            const item = document.createElement('div');
            item.className = 'leyenda-item';
            item.innerHTML = `<span class="leyenda-dot" style="background:${datos.color}"></span><span>${datos.titulo}</span>`;
            item.addEventListener('click', () => {
                const el = document.getElementById(id);
                if (el) el.dispatchEvent(new Event('click'));
            });
            leyendaColores.appendChild(item);
        });
        leyendaColores.style.display = 'block';
    }

    /** Detecta si estamos en móvil */
    const esMobile = () => window.innerWidth <= 768;

    // ──────────────────────────────────────────────
    // TOOLTIP FLOTANTE (solo desktop)
    // ──────────────────────────────────────────────
    partesModelo.forEach(parte => {
        const tituloZona = parte.getAttribute('data-titulo');
        if (!tituloZona) return;

        parte.addEventListener('mouseenter', (e) => {
            if (esMobile()) return;
            tooltip.textContent = tituloZona;
            tooltip.classList.add('visible');
        });

        parte.addEventListener('mousemove', (e) => {
            if (esMobile()) return;
            // Offset para que no tape el cursor
            tooltip.style.left = (e.clientX + 16) + 'px';
            tooltip.style.top  = (e.clientY - 10) + 'px';
        });

        parte.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });

    // ──────────────────────────────────────────────
    // 1. CLIC EN PARTE DEL MODELO GENERAL
    // ──────────────────────────────────────────────
    partesModelo.forEach(parte => {
        parte.addEventListener('click', () => {
            if (animando) return;

            const idDetalle     = parte.getAttribute('data-detalle');
            const tituloSeccion = parte.getAttribute('data-titulo');
            if (!idDetalle) return;

            animando = true;
            tooltip.classList.remove('visible');

            // Guardar título para el badge al volver
            ultimoTituloVisto = tituloSeccion || 'Detalle Muscular';

            // Activar el SVG de detalle correcto
            document.querySelectorAll('.svg-detalle').forEach(svg => svg.classList.remove('activo'));
            const svgAMostrar = document.getElementById(idDetalle);
            if (svgAMostrar) svgAMostrar.classList.add('activo');

            // Ocultar modelo principal y esperar que termine la transición CSS
            modeloPrincipal.classList.add('oculto');

            modeloPrincipal.addEventListener('transitionend', () => {
                contenedorDetalle.classList.add('activo');
                btnVolver.classList.add('visible');
                columnaVisual.classList.add('con-panel');
                columnaLista.classList.add('visible');

                tituloPanel.innerText = ultimoTituloVisto;
                instruccionInicial.style.display = 'flex';
                textoMecanico.innerHTML = '';

                construirLeyenda(idDetalle);
                animando = false;
            }, { once: true });
        });
    });

    // ──────────────────────────────────────────────
    // 2. CLIC EN UN MÚSCULO DE COLOR
    // ──────────────────────────────────────────────
    subMusculos.forEach(sub => {
        sub.addEventListener('click', (e) => {
            e.stopPropagation();
            subMusculos.forEach(s => s.classList.remove('activo'));
            sub.classList.add('activo');

            const datos = infoMecanicaData[sub.id];
            if (datos) {
                tituloPanel.innerText = datos.titulo;
                instruccionInicial.style.display = 'none';
                textoMecanico.innerHTML = datos.mecanica;
            }
        });
    });

    // ──────────────────────────────────────────────
    // 3. CLIC EN "VOLVER"
    // ──────────────────────────────────────────────
    btnVolver.addEventListener('click', () => {
        if (animando) return;
        animando = true;

        contenedorDetalle.classList.remove('activo');
        btnVolver.classList.remove('visible');
        columnaLista.classList.remove('visible');
        columnaVisual.classList.remove('con-panel');
        subMusculos.forEach(s => s.classList.remove('activo'));

        // Limpiar panel después de que el sheet/columna se cierre
        setTimeout(() => {
            tituloPanel.innerText = '—';
            textoMecanico.innerHTML = '';
            instruccionInicial.style.display = 'flex';
            leyendaColores.style.display = 'none';
            leyendaColores.innerHTML = '';
        }, 300);

        // Mostrar modelo principal y esperar su transición
        setTimeout(() => {
            document.querySelectorAll('.svg-detalle').forEach(svg => svg.classList.remove('activo'));
            modeloPrincipal.classList.remove('oculto');

            modeloPrincipal.addEventListener('transitionend', () => {
                // Mostrar badge con la zona que acaba de explorar
                if (ultimoTituloVisto) mostrarBadge(ultimoTituloVisto);
                animando = false;
            }, { once: true });
        }, 150);
    });

    // ──────────────────────────────────────────────
    // 4. SWIPE DOWN EN MÓVIL PARA CERRAR SHEET
    // ──────────────────────────────────────────────
    let touchStartY = 0;

    columnaLista.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    columnaLista.addEventListener('touchend', (e) => {
        const deltaY = e.changedTouches[0].clientY - touchStartY;
        // Si el usuario deslizó hacia abajo más de 60px, cerrar el sheet
        if (deltaY > 60 && !animando) {
            btnVolver.click();
        }
    }, { passive: true });
});
