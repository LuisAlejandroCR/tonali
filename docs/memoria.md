<!-- memoria.md: enfoque técnico, decisiones y bitácora del proyecto TONALI.
No confundir con verificacion.md, que lista qué datos están comprobados y cuáles siguen pendientes. -->
# Memoria del proyecto

## Estado actual

| Semana | Entregable | Estado |
|---|---|---|
| 1 | Problem Brief (`docs/semana1/`) | Entregado |
| 2 | Product Blueprint (`docs/semana2/`), fecha límite: domingo 4 de octubre, 5:00 p.m. (hora de México) | En el repo desde el 05/10/2026 · ⏳ formato del archivo de Gisell |
| 3 | Functional Proof (`frontend/`, `docs/semana3/`), fecha límite: domingo 11 de octubre | Front y docs listos el 08/10/2026 · ⏳ commit de Gisell y carga en Apex |
| 4–5 | — | ⏳ pendiente (aún no se publica) |

## Decisiones

| Decisión | Por qué |
|---|---|
| Problema elegido: el origen local de un snack que no se puede comprobar (propuesta de Gisell) | Cumple dos criterios de la Sesión 1: partes que no confían entre sí comparten un registro, y un histórico que no puede alterarse. |
| Oportunidad priorizada: la fricción 1 (el origen se pierde en la mezcla del acopiador) | Es la causa raíz: si se registra en el origen, las demás fricciones se reducen en cadena. |
| MVP en testnet, con un solo insumo (amaranto) | Valida los supuestos 1 y 2 sin costo real y sin carga operativa extra. |
| El consumidor sólo lee: sin cuenta y sin billetera | La lectura del QR no debe tener fricción. Las escrituras las firma quien conoce el hecho. |
| Fotos y datos personales fuera de la cadena; en la red sólo va la huella (*hash*) de la foto y un identificador del productor | Minimizar los datos personales expuestos en un registro público e inalterable. |
| El Lean Canvas va como tabla dentro de `ProductBlueprint.md` | El entregable pide no usar documentos externos. El enlace obligatorio apunta al ancla `#5-lean-canvas` del mismo archivo. |
| `CLAUDE.md` y `AGENTS.md` se versionan en el repo | Decisión del equipo: compartir las reglas con todos los integrantes, y que el agente de cada uno (incluido el de Gisell) arranque con el mismo contexto. Por eso son públicos: nunca poner secretos ni datos personales en ellos. |
| El equipo es de dos personas: Gisell Arroyo y Luis Cardenas | Confirmado el 05/10/2026. Se quitó la fila vacía del Problem Brief. |
| Las tarjetas del Kanban son borradores del proyecto, no issues del repo | Basta para la semana 2. Se pueden convertir en issues cuando empiece el código. |
| El front se hace en Expo (React Native) con TypeScript y expo-router | El producto terminará como app móvil (decisión de Luis, 08/10/2026). Expo también exporta a web: el jurado lo ve en el navegador y la página pública del QR sigue siendo una URL que se abre sin instalar nada. |
| Contratos: opción A, contrato Soroban propio para entregas, confirmaciones y lotes | Las reglas del Blueprint (§8) son de nuestro dominio: un lote sólo enlaza entregas confirmadas y nada se edita. Ninguna herramienta del ecosistema las trae hechas. Las cuentas con passkey no se escriben: se reutiliza una billetera inteligente existente (detalle en `docs/semana3/Documentacion.md`). |
| Icono: semilla de amaranto con un camino de tres nodos, sin símbolos de blockchain, QR ni sellos | Comunica origen y recorrido sin prometer una verificación que el prototipo no tiene. Detalle y pendientes en `docs/icono-app.md`. |
| Sin login ni perfil en el MVP de demostración | Los roles de prueba se eligen en Inicio y el consumidor entra por el QR. Login y perfil llegan con cuentas reales (passkey), sincronización y permisos por actor. Ajustes sólo expone lo que existe: hápticos y restaurar datos. |
| En la semana 3 el registro es simulado y vive en el dispositivo | Se pide sólo el front. La capa de datos imita al contrato (sólo agrega registros, valida las mismas reglas) para que la semana 4 sólo cambie la implementación, no las pantallas. |

## Enfoque técnico (semana 2, borrador)

- **Interfaz:** app web para celular (productor y acopiador), panel de TONALI y página pública del QR.
- **Lógica:** servicio de TONALI que prepara transacciones, guarda fotos y genera el QR. No firma por nadie.
- **Stellar:** una cuenta por actor, con passkeys, y un contrato Soroban de entregas y lotes que sólo agrega registros.

## Enfoque técnico (semana 3)

- **Proyecto:** `frontend/`, Expo SDK 57, expo-router (una ruta por pantalla), TypeScript estricto.
- **Pantallas:** inicio (elegir rol) · productor (registrar entrega) · acopiador (confirmar o rechazar) ·
  panel de la marca (crear lote y ver su QR) · página pública del lote (`/lote/<id>`), que es lo que abre
  el QR.
- **Datos:** `src/ledger/` define la interfaz del registro y una implementación simulada que guarda una
  lista de eventos que sólo crece (entrega registrada, confirmada, rechazada, lote creado). El estado de
  cada entrega se deriva de esa lista. Persiste en el dispositivo con AsyncStorage y arranca con datos
  de demostración ficticios.
- **Fotos:** se eligen con expo-image-picker y se calcula su huella SHA-256 con expo-crypto en el
  dispositivo. La foto no se sube a ningún lado; al registro sólo llega la huella.
- **Firmas:** simuladas y marcadas como tales en pantalla hasta conectar las cuentas con passkey.
- **Tests:** Vitest y fast-check sobre el dominio (`frontend/test/unit`, `fuzz`, `invariant`).

## Convenciones del equipo

- Commits de una línea, Conventional Commits en inglés, sin cuerpo y sin `Co-Authored-By`.
- Cada integrante sube su archivo individual con su propio commit: el historial es evidencia de autoría.
- Un agente que commitee desde un entorno remoto usa `--author` con la identidad del integrante.

## Bitácora

| Fecha | Qué pasó |
|---|---|
| 2026-09-30 | Se quitó `docs/semana2/` del `.gitignore`: la carpeta de la semana 2 no se habría subido. |
| 2026-09-30 | Borradores de `docs/semana2/Luis_Cardenas.md` (7 historias) y `docs/semana2/ProductBlueprint.md` (8 secciones). Faltan las historias de Gisell, el enlace al Kanban y la tercera persona del equipo. |
| 2026-09-30 | Se crearon `docs/memoria.md`, `docs/verificacion.md`, `docs/plan.md` y `LEARNINGS.md` para que cualquier agente del equipo arranque con contexto. |
| 2026-10-05 | Blueprint: se integraron las historias de Gisell (sus #1, #2 y #6 entran como historias 3, 7 y 5; las demás quedan fuera con motivo), se renumeró §4, se cerraron los ⏳ del Lean Canvas y de passkeys (CAP-0051). Sigue pendiente el enlace al Kanban. |
| 2026-10-05 | El equipo es de dos personas (Gisell y Luis): no hay tercer integrante. Se creó el proyecto privado [TONALI · Backlog](https://github.com/users/LuisAlejandroCR/projects/2) vinculado al repo, con los campos Prioridad, Alcance y Orden. Faltan las 7 tarjetas, hacerlo público y cambiar la vista a Board. |
| 2026-10-05 | Tablero público con 7 tarjetas y vista Board. Barrido de `.md`: cabeceras en `AGENTS.md` y `CLAUDE.md`, `CLAUDE.md` con datos reales del proyecto, `README.md` y `plan.md` al día. |
| 2026-10-08 | Semana 3: front en Expo SDK 57 (5 pantallas), registro simulado que sólo agrega, 38 tests, capturas y `Documentacion.md`. Decisión de contratos: opción A. `README.md` reducido a requisitos, instalación y ejecución. |
| 2026-10-08 | Propuesta UI/UX guardada en `docs/Propuesta-UI-UX.md` e implementados sus quick wins: mensajes de éxito, siguiente paso, vibración opcional (expo-haptics), aviso de demo y bloque “Sobre la barra” en la página del lote. Capturas rehechas en modo claro. |
| 2026-10-08 | Página del lote rediseñada: el recorrido productor → acopiador → TONALI es la imagen principal (iconos SVG propios en `origin-icons.tsx`), detalles plegables y fundido que respeta movimiento reducido. |
| 2026-10-08 | Pantallas de productor, acopiador y marca con el patrón resumen → acción → resultado/historial (`task-blocks.tsx`); se quitó `delivery-card.tsx`, que quedó sin uso. |
| 2026-10-08 | Ajustes de UI: misma banda de demostración en las cuatro pantallas operativas, casillas visibles al elegir entregas, rechazar como acción secundaria, selector de productor plegado, resumen con cifras, icono de calendario y menos espacio vertical. |
| 2026-10-08 | Flujos por pasos: productor en 3 pasos, acopiador con “¿Qué no coincide?” y marca en ① Entregas → ② Lote → ③ QR (`motion.tsx`: deslizamiento y check animado con movimiento reducido). Se quitaron `accessibilityElementsHidden`/`importantForAccessibility` en favor de `aria-hidden` (React Native Web los rechazaba). |
| 2026-10-08 | Coherencia entre bocetos y app: fecha corta en listas (`formatShortDate`, con test) y completa en detalles; rechazo con categoría obligatoria y detalle opcional; indicador de pasos ● / ✓ / ○; resumen del lote con barras. Recorrido verificado con la misma entrega E-0006 (P-01 · 25 kg) hasta L-2026-002 (100 barras · 45 kg · 1 productor). |
| 2026-10-08 | Subpantallas dentro de cada ruta (`BackHeader` con “←”): productor con panel “Cambiar productor” (Actual / Cerrar); acopiador con lista → revisión → resultado y un historial con filtros; marca con “Entregas ya usadas” de sólo lectura e indicador ✓ ✓ ● en el resultado. Ya no se pueden volver a elegir entregas ya usadas desde la pantalla (el dominio lo sigue permitiendo). |
| 2026-10-08 | Inicio rediseñado (tres flujos + “Escanear un QR”), nuevas rutas `/ajustes` (hápticos, restaurar) y `/consultar` (código de lote), selector de productor como lista de opciones. Se quitó `DemoBanner`, que quedó sin uso. |
| 2026-10-08 | Pulido de Inicio (recorrido con iconos, pendientes junto al rol, “Consultar un QR”), Ajustes (aviso “¿Restaurar los datos?”, texto para navegador) y Consultar (icono QR, “lote no encontrado” en la misma pantalla). |
| 2026-10-08 | Consultar aclara que busca en los lotes de la demo de este dispositivo; Ajustes muestra “Ahora: …” y una confirmación al restaurar; Inicio apila el recorrido bajo 400 px y pone los pendientes en su propia línea. |
| 2026-10-08 | Restaurar datos incrementa `generation` en `LedgerProvider`; Productor, Acopiador y TONALI usan esa clave para reiniciar su estado local y no mostrar resultados de registros que ya no existen (verificado con las pantallas abiertas en la pila). En Consultar, editar el código borra el aviso. |
| 2026-10-09 | Icono de la app: SVG maestros en `frontend/assets/icon/`, PNG regenerables con `frontend/scripts/render_icons.py` (icono, adaptable de Android con icono temático, arranque claro y oscuro, favicon). Se quitaron los iconos de la plantilla de Expo. Variante clara con amaranto y verde claros por contraste. |
