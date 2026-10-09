<!-- CLAUDE.md: guía para Claude Code en el repo TONALI: misión, contexto, reglas, stack e idioma.
No confundir con AGENTS.md, la constitución que aplica a cualquier agente: este archivo es la capa
específica del proyecto y no la reemplaza. -->
# CLAUDE.md — TONALI

> Guía para Claude Code en este repositorio. **No reemplaza a [`AGENTS.md`](AGENTS.md)** — esa es
> la constitución. Este archivo es la capa específica: contexto, herencia, idioma y estilo.
>
> Se versiona en el repo por decisión del equipo (ver `docs/memoria.md`): `CLAUDE.md`, `AGENTS.md` y
> `docs/` son públicos. Nada de secretos ni datos personales aquí.

## Norte — la misión

> *Que quien compra una barra TONALI pueda comprobar quién cultivó lo que come, sin tener que creerle
> sólo a la marca, y que el pequeño productor tenga prueba de que su cosecha llegó ahí.*

Cosas que tienen que ser ciertas:

1. Consultar el origen no pide cuenta, billetera ni app: basta con escanear el QR.
2. Cada registro lo firma quien conoce el hecho (productor, acopiador, marca) y nadie lo reescribe.
3. Fotos y datos personales nunca suben a la cadena: ahí sólo va la huella (*hash*).

## Contexto

| Dato | Valor |
|---|---|
| Entrega / deadline | Semanal, curso BB101. Semana 3: domingo 11 de octubre de 2026 (se toma 10:00 a.m., hora de México), carga en Apex |
| Jurado / cliente | Docentes del curso BB101 · ⏳ confirmar nombres |
| Criterio de evaluación | Plantilla de cada semana en [ProyectoBase](https://github.com/mestupinanm/ProyectoBase) · ⏳ rúbrica detallada |

## Arranque de sesión (obligatorio)

```text
AGENTS.md
docs/memoria.md
docs/verificacion.md
git status
```

Después de `/compact` o `/new`: re-leer este archivo, `AGENTS.md` y `docs/memoria.md`.
No asumir el estado de un archivo sin leerlo.

## Ciclo SDD

| Paso | Dónde vive |
|---|---|
| Specify (qué + criterios de aceptación) | `docs/plan.md` |
| Plan (cómo: enfoque técnico, archivos, datos) | `docs/memoria.md` |
| Tasks (pasos pequeños y verificables) | `docs/plan.md` → *Bloques* |
| Implement | código |
| Verify | tests + lint + typecheck + ejercicio real; bitácora en `docs/memoria.md` |

## Reglas críticas para agentes IA

1. **Nunca commitear, nunca pushear — mostrar el comando listo.**
2. **Nunca exponer business logic** (fórmulas, pesos, umbrales, reglas de clasificación).
3. **No inventar estado del proyecto.** Sin verificar → `⏳ pendiente`.
4. **Documentar en el mismo lote — barrido completo de todos los `.md`, `README.md` incluido.**
5. **Degradación elegante con cualquier proveedor externo:** sin key o con el proveedor caído,
   la app arranca y responde con un resultado neutro tipado. Nunca un 500.
6. **Toda cifra lleva fuente y fecha.** Verificado en fuente primaria · repetido por prensa ·
   supuesto propio son tres cosas distintas y se marcan como tales.
7. **Sin secretos en el repo ni en la conversación.** Nunca imprimir el valor de una key.
8. **Aritmética financiera con librería decimal**, nunca `number` nativo.
9. **Cabeceras:** código 2–3 líneas (`// <filename>: …`); `.md` 3–4 líneas en español antes del
   primer encabezado.
10. **Commits de una línea, sin cuerpo y sin trailers** — nunca `Co-Authored-By:`, con uno o con
    veinte agentes.

## Exclusiones no negociables

| Excluido | Razón |
|---|---|
| Fotos y datos personales en la red | El registro es público e inalterable: no se pueden borrar después. |
| Pagos al productor en el MVP | Sólo tienen sentido si se validan antes los supuestos 1 y 2. |
| Mainnet en el MVP | El piloto corre en testnet, sin costo real. |

## Variables de entorno

Viven en `.env` (gitignored). Documentar el **nombre**, nunca el contenido.

| Variable | Nota |
|---|---|
| `EXPO_PUBLIC_SITE_URL` | Opcional. Dominio público que va en el QR de cada lote. |

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Expo SDK 57 (React Native + web), expo-router, TypeScript · `frontend/` |
| Backend | Servicio de TONALI que prepara transacciones y guarda fotos · ⏳ por definir |
| Datos | Contrato Soroban en testnet de Stellar, cuentas con passkey · fotos fuera de la cadena |
| Deploy | ⏳ por definir |

## Idioma

| Qué | Idioma |
|---|---|
| Código: identificadores, comentarios, nombres de archivos y carpetas | Inglés |
| Lo que lee el usuario en pantalla | Español (locale del proyecto) |
| `README.md` (público) | Español, escrito para el usuario, sin jerga |
| `docs/`, `CLAUDE.md`, `AGENTS.md` (privados) | Español |
| Commits | Inglés, Conventional Commits, **una línea, sin trailers** |

## Version control

- Repo: <https://github.com/LuisAlejandroCR/tonali> · rama `main`.
- **Público:** todo lo versionado, incluidos `docs/`, `CLAUDE.md` y `AGENTS.md`. **Privado (gitignored):** `.env` y las carpetas de semanas aún no publicadas.
- Cada integrante sube su archivo individual con su propio commit: el historial es evidencia de autoría.
- El agente prepara, el humano commitea.

## Output style: ADHD mode (activo por defecto)

*(Fuente: [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd))*

Liderar con la respuesta o próxima acción · numerar el trabajo multi-paso · cerrar con una acción
de menos de dos minutos · máximo 5 ítems por lista · errores con ubicación, causa y arreglo, sin drama.
Excepciones: explicar a fondo cuando se pide una explicación; confirmar antes de acciones destructivas;
tras tres intentos fallidos, parar y nombrar el supuesto dudoso.

## Herramientas de contexto — obligatorias en todo proyecto

| Herramienta | Para qué | Cuándo |
|---|---|---|
| [codegraph](https://github.com/colbymchenry/codegraph) | Grafo de código pre-indexado: símbolos, llamadas, radio de impacto | `codegraph init` antes de la primera pregunta estructural; `codegraph impact <símbolo>` antes de renombrar o borrar |
| [engram](https://github.com/Gentleman-Programming/engram) | Memoria persistente por MCP entre sesiones | `mem_current_project` al arrancar · `mem_search` antes de investigar · `mem_save` al cerrar un hallazgo · `mem_session_summary` al cerrar la sesión |
| `LEARNINGS.md` | La pregunta fija *¿Qué aprendí con este proyecto?* | Se llena mientras el proyecto vive, no el día que muere |

* El grafo y la base de recuerdos son **generados**: van al `.gitignore`, nunca se commitean.
* Ninguna de las dos sustituye leer el archivo. Dicen *dónde mirar*; el archivo dice *qué dice*.
* Nunca guardar en `engram` el valor de una key, un dato personal ni el log de la sesión.
* Lo de `LEARNINGS.md` que generaliza se anonimiza y sube a `procedures/knowledge/`. Sin nombres de
  cliente, evento, persona, URL privada ni cifras del encargo.

## Referencias

- Constitución → [`AGENTS.md`](AGENTS.md)
- Plan y criterios de aceptación → [`docs/plan.md`](docs/plan.md)
- Enfoque técnico y bitácora → [`docs/memoria.md`](docs/memoria.md)
- Datos verificados y pendientes → [`docs/verificacion.md`](docs/verificacion.md)
- Docs de librerías → <https://context7.com/>
- Aprendizajes de este proyecto → [`LEARNINGS.md`](LEARNINGS.md)
- Índice de código → <https://github.com/colbymchenry/codegraph>
- Memoria entre sesiones → <https://github.com/Gentleman-Programming/engram>
