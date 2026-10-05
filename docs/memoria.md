<!-- memoria.md: enfoque técnico, decisiones y bitácora del proyecto TONALI.
No confundir con verificacion.md, que lista qué datos están comprobados y cuáles siguen pendientes. -->
# Memoria del proyecto

## Estado actual

| Semana | Entregable | Estado |
|---|---|---|
| 1 | Problem Brief (`docs/semana1/`) | Entregado |
| 2 | Product Blueprint (`docs/semana2/`), fecha límite: domingo 4 de octubre, 5:00 p.m. (hora de México) | En el repo desde el 05/10/2026 · ⏳ formato del archivo de Gisell |
| 3–5 | — | ⏳ pendiente (aún no se publica) |

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

## Enfoque técnico (semana 2, borrador)

- **Interfaz:** app web para celular (productor y acopiador), panel de TONALI y página pública del QR.
- **Lógica:** servicio de TONALI que prepara transacciones, guarda fotos y genera el QR. No firma por nadie.
- **Stellar:** una cuenta por actor, con passkeys, y un contrato Soroban de entregas y lotes que sólo agrega registros.

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
