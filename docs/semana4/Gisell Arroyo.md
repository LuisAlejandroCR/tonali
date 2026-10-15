# Entregable 4: MVP funcional — TONALI

## 1. Aprendizajes y ajustes priorizados

Durante el desarrollo de TONALI comprendí que la trazabilidad de un producto requiere organizar correctamente la información desde la recepción de las materias primas hasta la consulta que realiza el consumidor. No basta con mostrar los datos; también es importante que cada usuario pueda entenderlos y realizar sus actividades de manera sencilla.

Uno de los principales aprendizajes fue reconocer que cada participante tiene necesidades diferentes. El productor necesita registrar sus entregas y conocer su estado; el acopiador debe revisar y confirmar la recepción; la marca necesita relacionar los ingredientes con los lotes de producción, y el consumidor requiere información clara sobre el origen del producto.

Por esta razón, considero prioritario mejorar la claridad de los formularios, validar los datos registrados y facilitar la consulta del estado de las entregas. También es necesario comprobar que la información de cada lote corresponda con las materias primas utilizadas.

Los ajustes que propongo priorizar son:

1. Revisar que los formularios soliciten los datos necesarios para registrar una entrega.
2. Mejorar los mensajes que indican el estado de las operaciones.
3. Facilitar la consulta de las entregas y los lotes.
4. Comprobar que el código QR permita acceder a la información pública del lote.
5. Completar y probar la integración con Stellar y el contrato inteligente.

Actualmente, las funciones deben distinguirse entre las que ya están disponibles en la demostración y las que todavía necesitan integración y pruebas.

## 2. Riesgos y pendientes

Uno de los principales riesgos de TONALI es que la información de una entrega se registre de manera incorrecta. Un error en la cantidad, el tipo de ingrediente o los datos del productor puede afectar el seguimiento de las materias primas. Para reducir este riesgo, se deben establecer validaciones en los formularios y revisar los datos antes de confirmar una operación.

Otro aspecto importante es la consistencia de la información. Es necesario comprobar que los registros de las entregas puedan relacionarse correctamente con los lotes de producción y que la información consultada por el consumidor corresponda con el lote seleccionado.

También debe considerarse la facilidad de uso. Si la aplicación tiene instrucciones poco claras o demasiados pasos, algunos usuarios podrían tener dificultades para utilizarla. Por eso, se propone probar la aplicación con personas que representen los diferentes perfiles y registrar las dudas que surjan durante las actividades.

Entre los pendientes principales se encuentran:

- Completar la integración del frontend con la red de prueba de Stellar.
- Verificar el funcionamiento del contrato inteligente Soroban.
- Probar el registro, la confirmación y el rechazo de entregas.
- Comprobar la relación entre las entregas de ingredientes y los lotes de producción.
- Verificar la consulta pública de la información mediante el código QR.
- Realizar pruebas de funcionamiento y registrar los errores encontrados.
- Agregar las evidencias públicas del MVP, el video de demostración y el explorador de testnet cuando estén disponibles.

Estos pendientes deben verificarse antes de presentar las funcionalidades como terminadas. La demostración de la interfaz no significa necesariamente que una operación ya esté registrada en blockchain.

## 3. Plan de validación con usuarios

El objetivo de la validación es comprobar que los usuarios comprendan las funciones principales de TONALI y puedan completar las actividades relacionadas con la trazabilidad de las barras de amaranto.

### Usuarios participantes

- **Productores:** probar el registro de una entrega de amaranto, cacahuate o miel.
- **Acopiadores:** revisar la información registrada y comprobar el proceso de confirmación o rechazo.
- **Personal de la marca:** revisar cómo se relacionan las entregas con los lotes de producción.
- **Consumidores:** consultar la información de un lote mediante el código QR.

### Actividades de prueba

1. Pedir al productor que registre una entrega con los datos solicitados por la aplicación.
2. Solicitar al acopiador que revise los datos y realice la acción correspondiente.
3. Pedir al personal de la marca que identifique las entregas disponibles y explique cómo se relacionan con un lote.
4. Solicitar al consumidor que escanee el código QR y encuentre la información disponible sobre el producto.
5. Registrar las dificultades, errores y preguntas que surjan durante las pruebas.
6. Recopilar las opiniones de los participantes para identificar oportunidades de mejora.

### Indicadores de evaluación

Para evaluar los resultados se utilizarán los siguientes indicadores:

| Indicador | ¿Qué permite evaluar? |
|---|---|
| Finalización de tareas | Si los usuarios completan las actividades solicitadas. |
| Tiempo de realización | Cuánto tardan en completar cada actividad. |
| Errores encontrados | Qué problemas aparecen durante el uso. |
| Facilidad de uso | Qué tan clara resulta la navegación. |
| Comprensión de la trazabilidad | Si el usuario comprende el origen de los ingredientes y su relación con el lote. |

### Criterios de aceptación

Se considerará que una actividad cumple su objetivo cuando el usuario pueda realizarla y explicar el resultado obtenido. Los problemas encontrados se registrarán y clasificarán según su importancia para determinar cuáles deben corregirse primero.

Las pruebas deberán documentarse con resultados reales. Si una función todavía no está conectada con Stellar o con el contrato inteligente, se evaluará únicamente el comportamiento disponible y se anotará la integración como pendiente.

## 4. Evidencias públicas del proyecto

Los siguientes enlaces deben completarse con las direcciones reales del proyecto:

- **Repositorio de GitHub:** [Agregar enlace al repositorio](URL_DEL_REPOSITORIO)
- **MVP en línea:** [Agregar enlace al MVP](URL_DEL_MVP)
- **Video de demostración de máximo 3 minutos:** [Agregar enlace al video](URL_DEL_VIDEO)
- **Contrato desplegado en testnet:** [Agregar enlace al explorador](URL_DEL_CONTRATO)
- **Transacción de prueba:** [Agregar enlace a la transacción](URL_DE_LA_TRANSACCION)

Si alguna evidencia todavía no existe, debe indicarse como pendiente en lugar de colocar un enlace ficticio.

## 5. Conclusión

El desarrollo de TONALI permite establecer una base para mejorar la trazabilidad de las barras de amaranto, al organizar la información de los productores, las entregas de materias primas, los lotes de producción y la consulta del consumidor.

Desde mi participación, considero importante documentar los riesgos y establecer un plan de validación que permita comprobar si la aplicación responde a las necesidades de cada usuario. Las pruebas ayudarán a identificar errores y a definir qué mejoras deben atenderse primero.

El siguiente paso consiste en completar las integraciones pendientes, comprobar el funcionamiento del sistema y reunir evidencias verificables. De esta manera, TONALI podrá avanzar hacia una solución más clara, útil y confiable para dar seguimiento al origen de sus productos.
