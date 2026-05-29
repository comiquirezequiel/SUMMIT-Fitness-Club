document.addEventListener('DOMContentLoaded', () => {
    const modeloPrincipal = document.getElementById('modelo-interactivo');
    const partesModelo = document.querySelectorAll('.parte-modelo');
    const contenedorDetalle = document.getElementById('contenedor-detalle');
    const subMusculos = document.querySelectorAll('.sub-musculo');
    const btnVolver = document.getElementById('btn-volver');
    const columnaLista = document.getElementById('columna-lista');
    const columnaVisual = document.getElementById('columna-visual');

    const tituloPanel = document.getElementById('titulo-panel');
    const textoMecanico = document.getElementById('texto-mecanico');
    const instruccionInicial = document.getElementById('instruccion-inicial');
    const leyendaColores = document.getElementById('leyenda-colores');

    let animando = false;

    // ──────────────────────────────────────────────
    // BASE DE DATOS
    // ──────────────────────────────────────────────
    const infoMecanicaData = {
        // PECHO
        "pecho-superior": {
            titulo: "Fibras Claviculares (Pecho Superior)",
            mecanica: "<strong>Función principal:</strong> Flexión de hombro y aducción horizontal.<br><br><strong>Ejercicios Clave:</strong><br>• Press inclinado con barra o mancuernas<br>• Aperturas en polea alta<br>• Fondos con inclinación hacia adelante",
            color: "#0AFF0A"
        },
        "pecho-medio": {
            titulo: "Fibras Esternocostales (Pecho Medio)",
            mecanica: "<strong>Función principal:</strong> Aducción horizontal pura.<br><br><strong>Ejercicios Clave:</strong><br>• Press plano con barra<br>• Press con mancuernas en banco plano<br>• Peck-Deck / Mariposa",
            color: "#F68616"
        },
        "pecho-inferior": {
            titulo: "Fibras Abdominales (Pecho Inferior)",
            mecanica: "<strong>Función principal:</strong> Aducción horizontal descendente.<br><br><strong>Ejercicios Clave:</strong><br>• Fondos en paralelas<br>• Press declinado<br>• Aperturas en polea baja",
            color: "#CC25ED"
        },
        
        // BRAZO FRENTE
        "deltoide-frontal": {
            titulo: "Deltoides Anterior (Hombro Frontal)",
            mecanica: "<strong>Función principal:</strong> Flexión y rotación interna del hombro.<br><br><strong>Ejercicios Clave:</strong><br>• Press militar con barra<br>• Elevaciones frontales con mancuernas<br>• Press Arnold",
            color: "#A70B0B"
        },
        "deltoide-lateral": {
            titulo: "Deltoides Medio (Hombro Lateral)",
            mecanica: "<strong>Función principal:</strong> Abducción del brazo (alejarlo del cuerpo).<br><br><strong>Ejercicios Clave:</strong><br>• Elevaciones laterales con mancuernas<br>• Remo al mentón agarre ancho<br>• Elevaciones en polea baja lateral",
            color: "#17C6D3"
        },
        "cabeza-larga": {
            titulo: "Bíceps — Cabeza Larga",
            mecanica: "<strong>Función principal:</strong> Flexión de codo y supinación; parte exterior del bíceps.<br><br><strong>Ejercicios Clave:</strong><br>• Curl con mancuernas (codos atrás)<br>• Curl martillo<br>• Curl en banco inclinado",
            color: "#DFB321"
        },
        "cabeza-corta": {
            titulo: "Bíceps — Cabeza Corta",
            mecanica: "<strong>Función principal:</strong> Flexión de codo; parte interior que da grosor al brazo.<br><br><strong>Ejercicios Clave:</strong><br>• Curl predicador (Scott)<br>• Curl con barra agarre ancho<br>• Curl en polea baja",
            color: "#DB1CED"
        },
        "antebrazo-braquiorradial": {
            titulo: "Músculo Braquiorradial",
            mecanica: "<strong>Función principal:</strong> Flexión del antebrazo en posición neutra.<br><br><strong>Ejercicios Clave:</strong><br>• Curl invertido con barra<br>• Curl martillo<br>• Dominadas con agarre prono",
            color: "#C7159A"
        },
        "antebrazo-flexores": {
            titulo: "Flexores de la Muñeca",
            mecanica: "<strong>Función principal:</strong> Flexión palmar de la muñeca y agarre.<br><br><strong>Ejercicios Clave:</strong><br>• Curl de muñeca con barra<br>• Paseo del granjero<br>• Dead hang en barra",
            color: "#0AFF0A"
        },

        // BRAZO TRASERO
        "deltoides-posterior": {
            titulo: "Deltoides Posterior (Hombro Atrás)",
            mecanica: "<strong>Función principal:</strong> Extensión horizontal y rotación externa del hombro.<br><br><strong>Ejercicios Clave:</strong><br>• Pájaros (Rear delt flyes)<br>• Face pull en polea alta<br>• Peck-deck invertido",
            color: "#FF9800"
        },
        "triceps-larga": {
            titulo: "Tríceps — Cabeza Larga",
            mecanica: "<strong>Función principal:</strong> Extensión del codo y estabilización del hombro. Es la cabeza más grande del tríceps.<br><br><strong>Ejercicios Clave:</strong><br>• Extensiones tras nuca<br>• Press francés con barra EZ<br>• Rompecráneos",
            color: "#8E24AA"
        },
        "triceps-lateral": {
            titulo: "Tríceps — Cabeza Lateral",
            mecanica: "<strong>Función principal:</strong> Extensión del codo. Da el aspecto de 'herradura' al brazo.<br><br><strong>Ejercicios Clave:</strong><br>• Extensiones en polea alta con cuerda<br>• Press de banca con agarre cerrado<br>• Fondos en paralelas",
            color: "#E91E63"
        },
        "triceps-medial": {
            titulo: "Tríceps — Cabeza Medial",
            mecanica: "<strong>Función principal:</strong> Extensión del codo. Trabaja en sinergia con las otras cabezas.<br><br><strong>Ejercicios Clave:</strong><br>• Extensiones en polea alta con barra recta<br>• Tate press con mancuernas",
            color: "#00ACC1"
        },
        "antebrazo-extensores": {
            titulo: "Extensores del Antebrazo",
            mecanica: "<strong>Función principal:</strong> Extensión de la muñeca y los dedos.<br><br><strong>Ejercicios Clave:</strong><br>• Curl de muñeca invertido<br>• Rodillo de muñeca (Wrist roller)",
            color: "#F4511E"
        },

        // PIERNA TRASERA
        "gluteo": {
            titulo: "Glúteo Mayor y Medio",
            mecanica: "<strong>Función principal:</strong> Extensión, abducción y rotación externa de la cadera. Estabiliza la pelvis.<br><br><strong>Ejercicios Clave:</strong><br>• Hip thrust (Empuje de cadera)<br>• Sentadillas profundas<br>• Peso muerto rumano<br>• Patada de glúteo en polea",
            color: "#3F51B5"
        },
        "isquiotibiales": {
            titulo: "Isquiosurales (Femorales)",
            mecanica: "<strong>Función principal:</strong> Flexión de rodilla y extensión de cadera.<br><br><strong>Ejercicios Clave:</strong><br>• Peso muerto rumano o con piernas rígidas<br>• Curl femoral acostado<br>• Curl femoral sentado<br>• Buenos días (Good mornings)",
            color: "#E53935"
        },
        "gemelos": {
            titulo: "Gastrocnemio y Sóleo (Pantorrillas)",
            mecanica: "<strong>Función principal:</strong> Flexión plantar del pie (ponerse en puntas de pie).<br><br><strong>Ejercicios Clave:</strong><br>• Elevación de talones de pie (Gastrocnemio)<br>• Elevación de talones sentado (Sóleo)<br>• Saltos a la cuerda",
            color: "#43A047"
        },
        "abductores": {
            titulo: "Abductores de Cadera",
            mecanica: "<strong>Función principal:</strong> Separar la pierna del eje del cuerpo (abducción).<br><br><strong>Ejercicios Clave:</strong><br>• Máquina de abductores<br>• Abducción en polea baja<br>• Banded lateral walks (caminata lateral con banda)",
            color: "#FDD835"
        },

        // ABDOMEN
        "recto-abdominal": {
            titulo: "Recto Abdominal",
            mecanica: "<strong>Función principal:</strong> Flexión del tronco (aproximar costillas a pelvis).<br><br><strong>Ejercicios Clave:</strong><br>• Crunch con peso<br>• Elevación de piernas en barra<br>• Rueda abdominal (ab wheel)<br>• Cable crunch",
            color: "#FF4545"
        },
        "oblicuos": {
            titulo: "Oblicuos (Interno y Externo)",
            mecanica: "<strong>Función principal:</strong> Rotación y flexión lateral del tronco; estabilización de la columna.<br><br><strong>Ejercicios Clave:</strong><br>• Russian twist con peso<br>• Cable woodchop (leñador)<br>• Plancha lateral<br>• Crunch de bicicleta",
            color: "#FFB800"
        },
        "serrato-anterior": {
            titulo: "Serrato Anterior",
            mecanica: "<strong>Función principal:</strong> Protracción y rotación de la escápula; fija el omóplato al tórax.<br><br><strong>Ejercicios Clave:</strong><br>• Push-up plus (empuje extra al final)<br>• Press en polea con protracción<br>• Pullover con mancuerna",
            color: "#00E5FF"
        },
        // ESPALDA
        "trapecio-superior": {
            titulo: "Trapecio Superior",
            mecanica: "<strong>Función principal:</strong> Elevación y retracción de los hombros; extensión del cuello.<br><br><strong>Ejercicios Clave:</strong><br>• Encogimientos con barra o mancuernas<br>• Remo al mentón agarre estrecho<br>• Face pull en polea alta",
            color: "#FF6B35"
        },
        "espalda-alta": {
            titulo: "Romboides y Trapecio Medio",
            mecanica: "<strong>Función principal:</strong> Retracción de las escápulas; mantener la postura erguida.<br><br><strong>Ejercicios Clave:</strong><br>• Remo con barra o mancuernas<br>• Face pull<br>• Remo en polea baja con agarre estrecho<br>• Band pull-apart",
            color: "#7B61FF"
        },
        "dorsales-anchos": {
            titulo: "Dorsal Ancho (Latissimus Dorsi)",
            mecanica: "<strong>Función principal:</strong> Extensión, aducción y rotación interna del hombro. Da la forma de 'V' a la espalda.<br><br><strong>Ejercicios Clave:</strong><br>• Dominadas con agarre prono<br>• Jalón al pecho en polea alta<br>• Remo con barra en pronación<br>• Pullover",
            color: "#00C9A7"
        },
        "lumbar": {
            titulo: "Erectores Espinales (Zona Lumbar)",
            mecanica: "<strong>Función principal:</strong> Extensión y estabilización de la columna vertebral.<br><br><strong>Ejercicios Clave:</strong><br>• Peso muerto convencional<br>• Hiperextensiones en banco romano<br>• Good mornings<br>• Superman (suelo)",
            color: "#FF3CAC"
        },
        // PIERNA FRENTE
        "cuadriceps": {
            titulo: "Cuádriceps (4 cabezas)",
            mecanica: "<strong>Función principal:</strong> Extensión de la rodilla; el recto femoral también flexiona la cadera.<br><br><strong>Ejercicios Clave:</strong><br>• Sentadilla con barra<br>• Prensa de piernas<br>• Extensión en máquina<br>• Zancadas (lunges)",
            color: "#39FF14"
        },
        "aductores": {
            titulo: "Aductores (Cara Interna)",
            mecanica: "<strong>Función principal:</strong> Aducción del muslo (cerrar las piernas); estabilización de la cadera.<br><br><strong>Ejercicios Clave:</strong><br>• Sentadilla sumo<br>• Aductores en máquina<br>• Zancada lateral<br>• Cable kick-in",
            color: "#FF6B35"
        },
        "tibia-anterior": {
            titulo: "Tibial Anterior",
            mecanica: "<strong>Función principal:</strong> Dorsiflexión del pie (levantar la punta del pie); inversión del pie.<br><br><strong>Ejercicios Clave:</strong><br>• Elevaciones de puntera de pie (toe raises)<br>• Caminar de talones<br>• Resistencia con banda elástica en dorsiflexión",
            color: "#00BFFF"
        }
    };

    // Leyendas por vista
    const leyendasPorVista = {
        "vista-pecho": ["pecho-superior", "pecho-medio", "pecho-inferior"],
        "vista-brazos-frente": ["deltoide-frontal", "deltoide-lateral", "cabeza-larga", "cabeza-corta", "antebrazo-braquiorradial", "antebrazo-flexores"],
        "vista-brazos-trasero": ["deltoides-posterior", "triceps-larga", "triceps-lateral", "triceps-medial", "antebrazo-extensores"],
        "vista-piernas-trasera": ["gluteo", "isquiotibiales", "gemelos", "abductores"],
        "vista-abdomen": ["recto-abdominal", "oblicuos", "serrato-anterior"],
        "vista-espalda": ["trapecio-superior", "espalda-alta", "dorsales-anchos", "lumbar"],
        "vista-piernas-frente": ["cuadriceps", "aductores", "tibia-anterior"]
    };

    // ──────────────────────────────────────────────
    // FUNCIÓN: Construir leyenda de colores
    // ──────────────────────────────────────────────
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

    // ──────────────────────────────────────────────
    // 1. CLIC EN PARTE DEL MODELO GENERAL
    // ──────────────────────────────────────────────
    partesModelo.forEach(parte => {
        parte.addEventListener('click', () => {
            if (animando) return;

            const idDetalle = parte.getAttribute('data-detalle');
            const tituloSeccion = parte.getAttribute('data-titulo');

            if (idDetalle) {
                animando = true;

                document.querySelectorAll('.svg-detalle').forEach(svg => svg.classList.remove('activo'));
                const svgAMostrar = document.getElementById(idDetalle);
                if (svgAMostrar) svgAMostrar.classList.add('activo');

                modeloPrincipal.classList.add('oculto');

                setTimeout(() => {
                    contenedorDetalle.classList.add('activo');
                    btnVolver.classList.add('visible');

                    columnaVisual.classList.add('con-panel');
                    columnaLista.classList.add('visible');

                    tituloPanel.innerText = tituloSeccion || "Detalle Muscular";
                    instruccionInicial.style.display = 'flex';
                    textoMecanico.innerHTML = '';

                    construirLeyenda(idDetalle);

                    animando = false;
                }, 400);
            }
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

        setTimeout(() => {
            tituloPanel.innerText = '—';
            textoMecanico.innerHTML = '';
            instruccionInicial.style.display = 'flex';
            leyendaColores.style.display = 'none';
            leyendaColores.innerHTML = '';
        }, 300);

        setTimeout(() => {
            modeloPrincipal.classList.remove('oculto');
            document.querySelectorAll('.svg-detalle').forEach(svg => svg.classList.remove('activo'));
            animando = false;
        }, 500);
    });
});