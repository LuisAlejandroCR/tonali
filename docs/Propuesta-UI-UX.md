<!-- Propuesta-UI-UX.md: propuesta de interacción, celebraciones y continuidad para las cinco pantallas del front de TONALI.
Contiene recomendaciones para productores, acopiadores, TONALI y consumidores, y qué parte ya se implementó.
Se distingue de semana3/Documentacion.md, que describe el Functional Proof implementado y verificado. -->

# Propuesta de UI/UX: progreso, celebraciones y continuidad

## Estado de implementación (08/10/2026)

| Recomendación | Estado |
|---|---|
| Mensaje de éxito con el hecho y el identificador, sólo después de guardar | ✅ registrar, confirmar, rechazar y crear lote |
| Botón en estado “Registrando…” / “Guardando…” / “Creando lote…” y bloqueado contra doble pulsación | ✅ |
| Anuncio del resultado a lectores de pantalla | ✅ `AccessibilityInfo.announceForAccessibility` |
| Háptico ligero opcional (sin vibración al rechazar ni al abrir un QR) | ✅ interruptor en Inicio · ⏳ probar en Expo Go |
| Siguiente paso tras cada acción (ir a confirmar, ir a crear lote, ver página pública) | ✅ |
| Aviso de demostración en la página del lote | ✅ |
| Bloque “Sobre la barra” en la página del lote | ✅ con datos del Problem Brief · ⏳ validar contra la etiqueta final |
| Página del lote rediseñada: recorrido de 3 pasos con iconos SVG, productores compactos con “Ver detalles”, confianza en 3 iconos, “Sobre la barra” plegable | ✅ |
| Aparición suave del lote, desactivada si el sistema pide reducir movimiento | ✅ sólo en la página del lote |
| Formularios en pasos cortos con icono y contador (productor 3 pasos, marca 3 etapas, acopiador una entrega a la vez) | ✅ |
| Deslizamiento entre pasos y check animado al guardar, con movimiento reducido | ✅ |
| Selector de fecha nativo | ⏳ campo de texto con atajos “Hoy” y “Ayer” |
| Confeti, rachas, rankings, notificaciones de retorno | Descartado en el MVP |

## Objetivo

Hacer visible el valor del registro de origen y que cada acción deje a la persona con una confirmación clara y un siguiente paso fácil de encontrar.

La experiencia debe ayudar a productores, acopiadores y al equipo de TONALI a completar el registro correctamente. Para quien escanea el QR, debe hacer comprensible el origen de su barra en pocos segundos. La gamificación acompaña el trabajo y la comprobación; no los convierte en una competencia ni presiona a volver a la app.

## Principios

1. **Celebrar resultados reales.** Confirmar una acción solo después de que el registro local se haya guardado correctamente.
2. **Explicar qué ocurrió.** El texto debe nombrar el hecho: entrega registrada, recepción confirmada o lote creado.
3. **Respetar el prototipo.** Mantener visible que los datos viven en el dispositivo y que las firmas son simuladas.
4. **Usar recompensas con sentido.** Preferir progreso de un proceso sobre puntos, rankings o rachas.
5. **Dar control y acceso.** La animación no debe ser necesaria para entender el resultado; los hápticos deben ser opcionales y respetar las preferencias del sistema.
6. **No exponer información.** Una celebración nunca debe revelar nombres, fotos ni otros datos que la pantalla no mostraría normalmente.

## Quick wins compartidos

- Añadir un estado de éxito breve y visible después de cada acción completada.
- Actualizar el contador y la tarjeta relacionada en Inicio al volver a esa pantalla.
- Mostrar un siguiente paso contextual cuando exista una acción pendiente.
- Mantener visible el progreso tras cerrar o recargar la app, de acuerdo con la persistencia local ya descrita.
- Evitar confeti, rachas diarias, rankings o notificaciones de retorno en este MVP. La utilidad principal es la trazabilidad clara, y estas mecánicas podrían distraer o presionar.

## Recomendaciones por pantalla

### 0. Inicio

**Oportunidad:** convertir las cuatro tarjetas en un resumen del flujo, no solo en accesos a roles.

- Mantener el orden productor → acopiador → TONALI → consumidor.
- Resaltar con un indicador discreto el próximo paso pendiente, por ejemplo: “1 entrega por confirmar”.
- Al actualizar el contador, usar una transición corta en el número y anunciar el nuevo valor para tecnologías de asistencia.
- Al abrir el lote de ejemplo, presentar una etiqueta inequívoca de demostración.
- Mantener la restauración de datos separada de las acciones de progreso y pedir confirmación, como ya hace el flujo descrito.

**Celebración:** ninguna celebración global al abrir Inicio. El progreso debe ser informativo; la respuesta celebratoria pertenece a la acción que lo produjo.

### 1. Registrar entrega — productor

**Quick win:** al guardar correctamente, mostrar una confirmación que incluya el identificador de entrega y su estado pendiente.

- Cambiar temporalmente el botón a “Registrando…” mientras se procesa la acción.
- Tras guardar: “Entrega E-000X registrada. Queda pendiente de confirmación por el acopiador.”
- Actualizar “Mis entregas” y el resumen del Inicio al navegar de regreso.
- Si la persona añadió una foto, explicar junto a la huella que el archivo sigue en el dispositivo, según el comportamiento actual del prototipo.
- Mantener errores de cantidad, fecha y foto junto al campo correspondiente; no celebrar un envío con errores.

**Animación y háptico:** transición corta del estado del botón a confirmación; un toque háptico ligero, si está disponible y habilitado.

### 2. Confirmar entregas — acopiador

**Quick win:** hacer visible el resultado de confirmar o rechazar y el efecto sobre la entrega.

- Al confirmar: “Recepción confirmada. Esta entrega ya puede incluirse en un lote.”
- Al rechazar: confirmar primero el motivo y después mostrar “Rechazo registrado”, manteniendo el motivo visible en el historial.
- Actualizar “Por confirmar (N)” inmediatamente después de guardar.
- Si la lista queda vacía, mostrar el estado actual “No hay entregas por confirmar” con el contexto de que las revisiones quedan en “Revisadas recientemente”.

**Animación y háptico:** retirar la tarjeta con una transición breve después de mostrar la confirmación; usar un toque ligero para confirmar y reservar el patrón de éxito normal para la acción guardada. No usar una vibración celebratoria al rechazar.

### 3. Panel de TONALI

**Quick win:** mostrar una confirmación tangible cuando el lote se crea y el QR queda disponible.

- Mientras se crea, indicar “Creando lote…” y evitar que una doble pulsación genere acciones repetidas.
- Al terminar: “Lote L-2026-00X creado” con fecha, número de barras, entregas asociadas y botón para abrir o compartir su página/QR.
- Resaltar las entregas ya usadas con el lote correspondiente para que no se interpreten como trabajo pendiente.
- En la lista de lotes, distinguir visualmente “Listo para revisar” o “Lote creado” solo si esos estados reflejan el comportamiento real del MVP.

**Celebración:** una tarjeta de logro compacta con el identificador del lote y acceso al QR. Un destello o escala breve sobre la tarjeta es suficiente; evitar una pantalla modal que interrumpa el flujo.

**Háptico:** patrón corto de confirmación solo después de crear el lote y guardarlo correctamente.

### 4. Origen de tu barra — consumidor

**Oportunidad principal:** esta es la pantalla de mayor valor para quien escanea. Además de explicar las firmas, puede conectar el registro con el producto físico sin prometer atributos no comprobados.

- Añadir un bloque breve de identidad del producto —nombre, lema e ingredientes— si el equipo confirma que corresponde a la etiqueta y al producto final. Mientras siga siendo propuesta, marcarlo internamente para validación antes de publicarlo.
- Mantener visible que los datos y las firmas pertenecen a una demostración mientras el MVP use datos locales y firmas simuladas.
- Presentar primero el resumen del lote y los productores; dejar la explicación de confianza y los detalles técnicos debajo.
- Usar una línea de progreso de tres pasos —productor, acopiador, TONALI— como explicación del proceso, no como puntuación.
- Diferenciar “verificado en este prototipo” de una verificación real en Stellar; no presentar firmas simuladas como prueba criptográfica.
- Si el lote no existe, conservar una salida útil: explicar cómo revisar el código y ofrecer volver a escanear, sin animación de éxito.

**Celebración:** al cargar un lote válido, una aparición suave del resumen puede dar sensación de descubrimiento. No añadir háptico automático al abrir un QR; la consulta es informativa y puede ocurrir en espacios donde la vibración sorprenda.

## Lenguaje de progreso sugerido

Usar estados concretos que correspondan a eventos registrados:

- “Entrega registrada”
- “Pendiente de confirmación”
- “Recepción confirmada”
- “Entrega rechazada” y su motivo
- “Lote creado”
- “No encontramos ese lote”

Evitar “¡Todo verificado!” mientras las firmas sean simuladas. Evitar llamar “completado” a un paso que todavía espera confirmación.

## Movimiento, hápticos y accesibilidad

- Respetar la preferencia del sistema para reducir movimiento. En ese caso, sustituir transiciones por cambios inmediatos de estado.
- No depender del color: combinar color con texto, icono y etiqueta.
- Mantener el foco en el mensaje de éxito después de una acción y anunciarlo con las capacidades accesibles de React Native.
- No mover contenido de forma que desplace el foco o haga perder el contexto.
- Hacer que los hápticos sean breves, diferenciables y opcionales; si no están disponibles en web o en el dispositivo, la confirmación visual y textual debe bastar.
- No activar vibración al entrar a la app, al recibir una notificación no solicitada ni en cada toque.

## Continuidad sin presión

- La tarjeta de Inicio debe reflejar el estado más reciente del registro local.
- Al regresar, dejar accesible el siguiente paso pendiente sin exigir completar todo el flujo en una sesión.
- Preservar las entregas y lotes ya registrados al salir o cerrar la app, de acuerdo con la persistencia local implementada.
- No usar rachas que se reinician, cuenta regresiva, mensajes de culpa o pérdida de progreso por no volver.
- Si en una etapa futura se agregan recordatorios, deberán ser solicitados o configurables y fáciles de desactivar.

## Secuencia de implementación

1. **Primero:** estados de guardado, éxito y error para registrar, confirmar, rechazar y crear lote.
2. **Luego:** actualizar contadores y siguientes pasos en Inicio tras cada acción.
3. **Después:** añadir transiciones breves y compatibles con movimiento reducido.
4. **En dispositivo:** probar hápticos en Expo Go y verificar la alternativa sin vibración en web.
5. **Antes de publicar:** validar cualquier bloque de ingredientes, lema y procedencia con la etiqueta aprobada; mantener la advertencia de demostración hasta reemplazar datos y firmas simuladas.

## Verificación UX sugerida

Revisar con usuarios si pueden responder sin ayuda:

- ¿Qué ocurrió después de registrar, confirmar o rechazar una entrega?
- ¿Qué paso sigue y quién debe hacerlo?
- ¿Qué datos de la página del lote son reales en este prototipo?
- ¿Pueden entender el origen de la barra sin confundir una firma simulada con una verificación real?
- ¿Pueden completar las tareas con movimiento reducido y sin hápticos?

Registrar problemas de comprensión y errores observados antes de decidir si hace falta una capa adicional de puntos, niveles o insignias. Para este flujo, la claridad y la confianza son la recompensa principal.
