<!-- Documentacion.md: entregable grupal de la semana 3 (Functional Proof): front construido,
decisión técnica de contratos, participación y siguiente paso. No confundir con README.md,
que sólo dice cómo instalar y correr el proyecto, ni con docs/memoria.md (bitácora interna). -->

# Entregable 4: MVP funcional — TONALI

## 1. Aprendizajes y ajustes priorizados

Durante el desarrollo del MVP de TONALI aprendimos que es importante construir una solución que no solamente funcione desde el punto de vista técnico, sino que también sea fácil de utilizar para las personas que participan en el proceso de producción y distribución de las barras de amaranto.

El principal aprendizaje fue comprender la importancia de mantener un registro claro de las entregas de materias primas, desde que el productor entrega ingredientes como amaranto, cacahuate y miel, hasta que estos son utilizados para elaborar un lote de barras. La información debe ser comprensible y estar organizada para que cada participante pueda consultar el estado de sus operaciones.

También identificamos que la experiencia de usuario es fundamental. Por esta razón, la interfaz contempla diferentes apartados según el rol: productor, acopiador y marca. De esta manera, cada usuario puede realizar las actividades correspondientes a su participación en el proceso.

A partir de estos aprendizajes, los ajustes prioritarios para TONALI son:

1. Mejorar la validación de los datos capturados durante el registro de entregas.
2. Facilitar la consulta del estado de las entregas para los productores.
3. Permitir que la marca relacione las materias primas recibidas con los lotes de producción.
4. Mejorar la presentación de la información que consulta el consumidor mediante el código QR.
5. Preparar la integración del sistema con la red Stellar y el contrato inteligente desarrollado para el proyecto.

Actualmente, el MVP funciona como una demostración del flujo de trazabilidad. La integración con la red de prueba y el contrato inteligente todavía debe implementarse y validarse antes de considerarse una funcionalidad terminada.

## 2. Riesgos y pendientes

Durante el desarrollo de TONALI identificamos algunos riesgos y actividades pendientes que debemos atender para lograr que el sistema funcione de manera confiable.

Uno de los principales riesgos es la integridad de la información. Si los datos de una entrega se registran incorrectamente, la trazabilidad del producto podría verse afectada. Para reducir este riesgo, es necesario validar campos como el nombre del productor, el tipo de ingrediente, la cantidad entregada, la fecha y el estado de la recepción.

Otro riesgo es que la información mostrada en la aplicación no corresponda con los registros que se almacenen en la red. Para evitar inconsistencias, será necesario definir cómo se enviarán las operaciones al contrato inteligente y cómo se consultarán posteriormente sus resultados.

También debemos considerar la facilidad de uso. Algunos productores podrían tener poca experiencia con herramientas digitales, por lo que la aplicación debe presentar instrucciones claras, formularios sencillos y mensajes que permitan identificar si una operación se registró correctamente.

Los principales pendientes del proyecto son los siguientes:

- **Integración con Stellar:** conectar el frontend con la red de prueba correspondiente.
- **Contrato inteligente:** completar el desarrollo, despliegue y pruebas del contrato Soroban.
- **Registro de entregas:** implementar el registro verificable de las entregas de materias primas.
- **Confirmación de recepción:** permitir que el acopiador confirme o rechace una entrega y que el resultado quede registrado.
- **Creación de lotes:** relacionar los lotes de barras con las entregas de ingredientes utilizadas.
- **Consulta mediante QR:** asegurar que el consumidor pueda consultar la información pública del lote.
- **Pruebas de seguridad y funcionamiento:** verificar los datos, permisos y respuestas ante errores.
- **Evidencias del proyecto:** agregar los enlaces públicos del MVP, el video de demostración y el explorador de la red de prueba cuando estén disponibles.

Por el momento, debemos distinguir entre las funciones que ya se muestran en la demostración y aquellas que dependen de la integración con blockchain. No se considerará terminada una función hasta comprobar que opera correctamente en el entorno correspondiente.

## 3. Plan de validación con usuarios

El objetivo del plan de validación es comprobar que TONALI sea fácil de entender y que permita dar seguimiento a las materias primas utilizadas en la elaboración de las barras de amaranto. Para ello, se propone realizar pruebas con personas que representen los principales perfiles del sistema: productores, acopiadores, personal de la marca y consumidores.

### Objetivo de la validación

Evaluar la facilidad de uso del MVP, identificar errores durante el registro y consulta de información y comprobar si los usuarios comprenden cómo funciona el proceso de trazabilidad de TONALI.

### Usuarios participantes

- **Productores:** verificar si pueden registrar una entrega de ingredientes y consultar su estado.
- **Acopiadores:** comprobar si pueden revisar los datos de una entrega y confirmar o rechazar la recepción.
- **Personal de TONALI:** evaluar si puede relacionar las entregas recibidas con un lote de producción.
- **Consumidores:** comprobar si pueden consultar la información de origen de un lote mediante un código QR.

### Actividades de validación

1. Solicitar al productor que registre una entrega de amaranto, cacahuate o miel.
2. Pedir al acopiador que revise la información y confirme o rechace la entrega.
3. Solicitar al personal de la marca que consulte las entregas disponibles y explique cómo se relacionan con un lote de producción.
4. Mostrar al consumidor un código QR y pedirle que encuentre la información disponible sobre el producto.
5. Registrar los errores, dudas y dificultades que surjan durante cada actividad.
6. Recopilar comentarios sobre la claridad de los textos, la navegación y la utilidad de la información mostrada.

### Indicadores de evaluación

Para conocer los resultados de las pruebas se utilizarán los siguientes indicadores:

- **Tasa de finalización de tareas:** porcentaje de usuarios que completan una actividad sin ayuda.
- **Tiempo de realización:** tiempo que tarda cada participante en completar una tarea.
- **Errores detectados:** número y tipo de errores que se presentan durante las pruebas.
- **Facilidad de uso percibida:** opinión de los participantes sobre la navegación y comprensión de la aplicación.
- **Comprensión de la trazabilidad:** capacidad del usuario para explicar de dónde provienen los ingredientes y cómo se relacionan con el lote.

### Criterios de aceptación

Se considerará que el MVP cumple con los objetivos iniciales cuando los usuarios puedan identificar las funciones principales, completar las tareas asignadas y comprender la información presentada. Los errores encontrados se clasificarán según su importancia y se utilizarán para establecer las siguientes mejoras.

Las pruebas deberán documentarse con observaciones y resultados reales. Si alguna funcionalidad todavía no está conectada con la red de prueba, se evaluará únicamente su comportamiento en la demostración y se registrará la integración pendiente.

## 4. Evidencias públicas del proyecto

Agregar los enlaces correspondientes cuando estén disponibles y se hayan verificado.

- **Repositorio de GitHub:** [Agregar enlace al repositorio TONALI](URL_DEL_REPOSITORIO)
- **MVP o demostración en línea:** [Agregar enlace al MVP](URL_DEL_MVP)
- **Video de demostración (máximo 3 minutos):** [Agregar enlace al video](URL_DEL_VIDEO)
- **Contrato inteligente desplegado en testnet:** [Agregar enlace al contrato en el explorador](URL_DEL_CONTRATO)
- **Transacción de prueba en testnet:** [Agregar enlace a la transacción, si corresponde](URL_DE_LA_TRANSACCION)

> **Nota:** Los enlaces anteriores son marcadores de posición. Deben sustituirse por las direcciones reales. Si el contrato todavía no está desplegado, indicar que se encuentra pendiente en lugar de agregar un enlace inexistente.

## 5. Registro de contribuciones del equipo

Para evidenciar la participación de cada integrante, agregar los enlaces a los commits realizados durante la semana.

| Integrante | Usuario de GitHub | Actividad realizada | Enlace al commit |
|---|---|---|---|
| Luis Cardenas | LuisAlejandroCR | [Describir la contribución realizada] | [Agregar enlace] |
| Gisell Arroyo | G1s3llA | [Describir cómo se probará el MVP con productores, acopiadores, la marca y consumidores. Definir indicadores para evaluar la facilidad de uso.
Identificar riesgos y funcionalidades pendientes. Registrar las evidencias que faltan para completar la entrega.] | [Agregar enlace] |

Cada integrante debe registrar al menos un commit propio relacionado con el avance del proyecto durante la semana. Las actividades y los enlaces deben corresponder con los cambios que realmente se hayan realizado.

## 6. Conclusión

El desarrollo del MVP de TONALI nos ha permitido establecer una base para representar el proceso de trazabilidad de las barras de amaranto, desde la recepción de las materias primas hasta la consulta de información por parte del consumidor.

Las siguientes etapas se enfocarán en validar la experiencia de los usuarios, corregir los problemas identificados y completar la integración con Stellar y el contrato inteligente. Con ello, buscamos que TONALI ofrezca un proceso más transparente y organizado, que facilite el seguimiento del origen de los ingredientes y genere mayor confianza en el producto final.

El proyecto continuará mejorándose a partir de las pruebas realizadas y de las necesidades identificadas en cada uno de los perfiles de usuario.
