<!-- plan.md: qué se entrega cada semana, criterios de aceptación y bloques de trabajo (SDD: Specify y Tasks).
No confundir con memoria.md (decisiones, enfoque técnico y bitácora) ni con verificacion.md (datos y fuentes). -->
# Plan

## Semana 2: Product Blueprint

Fecha límite: **domingo 4 de octubre, 5:00 p.m. (hora de México)**, con la carga del repositorio en Apex.
Plantilla del curso: [ProyectoBase/docs/semana2](https://github.com/mestupinanm/ProyectoBase/tree/main/docs/semana2).

### Criterios de aceptación

1. Cada integrante tiene su archivo en `docs/semana2/` (5 a 7 historias "como [rol] quiero [acción] para
   [beneficio]", ordenadas por importancia y con el porqué), subido **con su propio commit**.
2. `docs/semana2/ProductBlueprint.md` tiene las 8 secciones en el orden de la plantilla, y cada sección de
   150–300 palabras está dentro de ese rango.
3. El backlog vive en un tablero Kanban de GitHub Projects, con columnas y criterios de aceptación en cada
   tarjeta, y está enlazado desde la sección 6.
4. El Lean Canvas cubre los 9 bloques y no depende de un documento externo.
5. Toda cifra tiene fuente y fecha, o está marcada en `docs/verificacion.md`.

### Bloques

| # | Tarea | Responsable | Estado |
|---|---|---|---|
| 1 | Quitar `docs/semana2/` del `.gitignore` | Luis | ✅ |
| 2 | Historias individuales de Luis (`Luis_Cardenas.md`) | Luis | ✅ |
| 3 | Historias individuales de Gisell (`Gisell_Arroyo.md`) | Gisell | ✅ subidas · ⏳ falta la extensión `.md` y el formato de la plantilla |
| 4 | Integrar las historias de Gisell en la sección 1 del blueprint | Equipo | ✅ `3b0ba65` |
| 5 | Crear el tablero en GitHub Projects y pegar su enlace en la sección 6 | Equipo | ✅ [tablero](https://github.com/users/LuisAlejandroCR/projects/2) público, 7 tarjetas, vista Board · `92f89d5` |
| 6 | Confirmar el soporte de passkeys en Stellar (sección 8) | Luis | ✅ CAP-0051 |
| 7 | Revisión final del blueprint y commit del grupo | Equipo | ✅ |

**Verify (05/10/2026):** criterios 2 a 5 cumplidos. El criterio 1 sólo falta en el formato del archivo de Gisell.

## Semana 3: Functional Proof

Fecha límite: **domingo 11 de octubre de 2026**, con una sola carga del repositorio en Apex. El enunciado
dice 7:00 p.m. (hora de México) en el encabezado y 10:00 a.m. en la lista de verificación: se toma
**10:00 a.m.** para no arriesgar la entrega.

### Criterios de aceptación

1. `frontend/` (fuera de `docs/`) se instala y corre con los comandos del `README.md`, en el navegador y
   en Expo Go, y recorre el flujo principal del MVP: registrar entrega → confirmarla → crear el lote con
   su QR → consultar el lote como consumidor.
2. `docs/semana3/Documentacion.md` tiene las cuatro secciones en orden: Front construido (400–2000
   palabras, con capturas), Decisión técnica (200–500 palabras), Participación del equipo, Bloqueos y
   siguiente paso.
3. La decisión de contratos dice la opción (A o B), por qué y qué se descartó, apoyada en la sección 8
   del Blueprint. No se escribe ni se despliega ningún contrato.
4. `README.md` sólo tiene Requisitos, Instalación y Cómo correrlo.
5. Cada integrante tiene al menos un commit propio en el repositorio durante la semana 3.
6. Tests, lint y typecheck pasan. Las fotos no salen del dispositivo y no se guardan datos personales.
7. `docs/semana3/` ya no está en el `.gitignore` (lección de la semana 2).

### Bloques

| # | Tarea | Responsable | Estado |
|---|---|---|---|
| 1 | Sacar `docs/semana3/` del `.gitignore` y quitar la plantilla vacía `NombreApellido1.md` | Luis | ✅ |
| 2 | Proyecto Expo en `frontend/` (SDK 57, expo-router, TypeScript) | Luis | ✅ |
| 3 | Dominio: registro simulado que sólo agrega (entregas, confirmaciones, lotes), con tests | Luis | ✅ |
| 4 | Pantallas: inicio, productor, acopiador, panel de la marca y página pública del lote | Luis | ✅ |
| 5 | `docs/semana3/Documentacion.md` con capturas | Equipo | ✅ borrador · ⏳ fila de Gisell en Participación |
| 6 | `README.md` de ejecución | Luis | ✅ |
| 7 | Commit propio de Gisell (sección de participación o revisión de la página del consumidor) | Gisell | ⏳ |
| 8 | Opcional: publicar la versión web y pegar el enlace en el campo *Website* de Apex | Luis | ⏳ |
| 9 | Carga en Apex | Equipo | ⏳ |

**Verify (08/10/2026):** typecheck, lint, 38 tests y `expo-doctor` pasan; build web exportado; flujo completo
recorrido en el navegador. Falta: criterio 5 (commit de Gisell) y probar la foto en Expo Go.

## Semanas 4 y 5

⏳ pendiente (aún no se publican).
