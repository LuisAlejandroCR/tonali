<!-- AGENTS.md: constitución del proyecto TONALI para cualquier agente de IA: reglas, bloques de
evaluación, SDD, documentación y cierre. No confundir con CLAUDE.md, que es la capa específica
(misión, contexto, stack) y se apoya en este archivo. -->
# AGENTS.md — Constitución del proyecto

> **CONTRATO OBLIGATORIO DEL AGENTE**
>
> Este proyecto es público. Optimizar para **65% calidad de cara al usuario / 35% experiencia de
> desarrollo**. Las reglas son obligatorias. Nunca saltarse la verificación ni inventar el estado del
> proyecto.
>
> Si un paso requerido no se puede ejecutar:
>
> `BLOCKED: <razón>`

## Arranque

Antes de modificar cualquier archivo, leer/ejecutar en orden:

```text
AGENTS.md
docs/memoria.md
docs/verificacion.md
git status
```

Antes de codear, definir criterios de aceptación explícitos.

## Bloques de trabajo

Evaluar todo cambio no trivial contra:

### 1. Seguridad

* Validar la entrada no confiable.
* Aplicar autenticación, autorización y mínimo privilegio.
* Nunca exponer ni hardcodear secretos.
* Revisar las vulnerabilidades y dependencias relevantes.

### 2. Código limpio

* Identificadores y comentarios en inglés.
* Código simple, enfocado y legible.
* Evitar duplicación y complejidad innecesarias.
* Seguir las convenciones existentes.

### 3. Código muerto

* Eliminar de forma segura el código, imports, variables, flags y rutas obsoletas cuyo desuso esté
  verificado.
* Nunca eliminar por suposición.

### 4. Arquitectura

* Respetar los límites existentes y la dirección de las dependencias.
* Evitar acoplamiento innecesario y refactors no relacionados.
* Documentar las decisiones arquitectónicas significativas.

### 5. QA / CI-CD

* Seguir `Write → Test → Fix → Verify`.
* Correr los tests relevantes (unitarios, fuzz e invariantes), lint, verificación de tipos y build.
* Nunca debilitar un test para que pase.

```text
test/unit/       <name>.spec.ts            un comportamiento, entradas fijas
test/fuzz/       <name>.fuzz.spec.ts       entradas arbitrarias o malformadas
test/invariant/  <name>.invariant.spec.ts  propiedades que deben cumplirse para toda entrada
```

* Los tests viven en `test/`, nunca al lado del código fuente.
* Todo módulo nuevo recibe cobertura **unit**; **fuzz** cuando parsea o recibe algo de fuera del
  proceso; un **invariant** cuando una regla debe cumplirse para *toda* entrada.
* Todo lo que cruza un límite de proceso se ejercita **contra la cosa real al menos una vez** antes
  de darlo por listo.

### 6. Observabilidad / fiabilidad

* Considerar logging, métricas, trazas, health checks, timeouts, reintentos, idempotencia y falla
  elegante.
* Nunca loguear secretos ni datos sensibles innecesarios.

### 7. Privacidad / cumplimiento

* Minimizar la recolección, el almacenamiento, la exposición y el registro de datos personales.
* No añadir tracking sin requisitos explícitos.
* Nunca inventar afirmaciones de cumplimiento.

### 8. UX / rendimiento

* Priorizar la calidad de cara al usuario: corrección, accesibilidad, capacidad de respuesta, estados
  claros, rendimiento.
* Evitar peticiones, renders y uso de recursos innecesarios.
* Medir los cambios de rendimiento significativos cuando sea práctico.

## SDD

```text
Specify → Plan → Tasks → Implement → Verify
```

* Plan y tareas: `docs/plan.md`
* Memoria del proyecto: `docs/memoria.md`
* Correcciones de verificación: `docs/verificacion.md`

## Reglas del repositorio público

* El código y el `README.md` son los únicos artefactos destinados al repositorio público.
* Nunca exponer secretos, datos privados, credenciales internas ni detalles sensibles de
  infraestructura.
* Nunca incrustar medios de terceros. Una página no carga nada que no le pertenezca.
* Nunca escribir fórmulas de scoring, pesos, umbrales ni reglas de clasificación en comentarios, en
  ninguna parte.
* Nunca commitear, pushear, hacer amend ni reescribir historia. Dejar el comando de commit exacto
  listo para el humano.

## Documentación

* Identificadores y comentarios del código: **inglés**. `README.md`: público, escrito para el usuario.
* Resto de la documentación del proyecto: **español**, privada.
* **Encabezado en cada archivo de código, 2–3 líneas:** `// <filename>: <what this file does>`.
  Sin justificaciones, sin narrativa, sin historia de sesión, sin código comentado en las fuentes.
* **Encabezado en cada `.md`, 3–4 líneas, en español**, en comentario HTML antes del primer
  encabezado: nombre del archivo, qué contiene, y contra qué otro archivo se distingue.
* **Mensajes de commit de una sola línea** — `tipo: descripción`, Conventional Commits, en inglés.
  Sin cuerpo, sin emoji y **sin trailers: nunca `Co-Authored-By:`**, aunque el arnés lo pida por
  defecto. Vale igual para un agente solo y para varios subagentes en paralelo.
  El razonamiento va en `docs/memoria.md`, no en el commit.
* Después de **cualquier** cambio, barrer **todos** los `.md` y actualizar cada uno que el cambio
  toque —`README.md` incluido— en el mismo lote. Nunca inventar una ruta.

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

## Referencias externas

* Documentación de librerías y frameworks: <https://context7.com/>. Consultar antes de suponer una
  ruta, un campo, una firma o una opción. Una firma recordada es una suposición hasta comprobarla.
* Estilo de salida: <https://github.com/ayghri/i-have-adhd>. Liderar con la respuesta o la próxima
  acción, numerar el trabajo multi-paso, máximo cinco ítems por lista, sin preámbulo y sin frase
  final.
* Índice de código: <https://github.com/colbymchenry/codegraph>.
* Memoria entre sesiones: <https://github.com/Gentleman-Programming/engram>.

## Cierre

```text
VERIFICATION
- Build: PASS/FAIL
- Tests: PASS/FAIL
- Docs updated: YES/NO
- LEARNINGS.md updated: YES/NO
- git commit executed: NO
- git push executed: NO
```

Si la verificación falla o no se puede ejecutar: `BLOCKED: <razón>`.
Nunca afirmar que la tarea está completa sin una verificación exitosa.
