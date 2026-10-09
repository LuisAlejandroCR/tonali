<!-- verificacion.md: datos y cifras del proyecto con su fuente y su estado de verificación.
No confundir con memoria.md, que guarda decisiones, enfoque técnico y bitácora. -->
# Verificación de datos

Cada dato lleva una de tres marcas:

- ✅ **Verificado en fuente primaria**: alguien del equipo lo leyó en el documento original.
- 📰 **Citado, sin re-verificar**: aparece en un entregable con su fuente, pero nadie volvió a revisarlo.
- 🧪 **Supuesto propio**: una estimación del equipo que todavía no tiene fuente.

## Datos en uso

| Dato | Dónde se usa | Fuente | Estado |
|---|---|---|---|
| Cifras de la ENAFIN 2024 (solicitudes, rechazos, crédito activo de empresas de mujeres) | `semana1/Luis_Cardenas.md` | INEGI y CNBV, reporte publicado el 28/05/2025, pp. 14, 45–48, 92–94 | 📰 con enlace; confirmar cada página |
| Brecha de financiamiento de pymes de mujeres en América Latina: USD 92 mil millones | `semana1/Luis_Cardenas.md` | IFC, 2020 | 📰 con enlace |
| Brecha de financiamiento de MIPYMES: USD 5.2 billones (formales) y USD 2.9 billones (informales) | `semana1/Luis_Cardenas.md` | IFC, *MSME Finance*, consultado el 25/09/2026 | 📰 con enlace |
| Snacks en México: crecimiento de ~4% en valor y ~6% en volumen | `semana1/ProblemBrief.md` | Innova Market Insights, 2025 | 📰 **sin enlace ni fecha de consulta** |
| Mercado mexicano de barras: USD 440.4 millones (2025), crecimiento anual compuesto de 4.13% (2026–2034) | `semana1/ProblemBrief.md` | IMARC, 2025 | 📰 **sin enlace ni fecha de consulta** |
| La relevancia cultural es parte de la estrategia competitiva del sector | `semana1/ProblemBrief.md` | Euromonitor, 2025 | 📰 **sin enlace ni fecha de consulta** |
| La NOM-051 no obliga a declarar la procedencia de cada insumo | `semana1/ProblemBrief.md`, `semana2/ProductBlueprint.md` | NOM-051-SCFI/SSA1-2010 | 📰 confirmar en el texto vigente de la norma |
| Precio propuesto: $20 MXN por barra | Problem Brief, Product Blueprint | Equipo | 🧪 |
| Costo estimado: $8.96 MXN por unidad | Problem Brief | Equipo | 🧪 ⏳ documentar el desglose |
| Lote de unas 100 barras | Problem Brief, Product Blueprint | Equipo | 🧪 |
| Stellar admite passkeys para firmar con contratos Soroban | `semana2/ProductBlueprint.md` | [CAP-0051](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0051.md) (Protocol 21, estado *Final*) y la [guía de cuentas contrato](https://developers.stellar.org/docs/build/guides/contract-accounts), consultadas el 05/10/2026 | ✅ |
| Margen de referencia: $11.04 MXN por barra ($20 − $8.96) | `semana2/ProductBlueprint.md` (Lean Canvas) | Cálculo del equipo sobre dos supuestos | 🧪 hereda el estado de precio y costo |
| *Manage Data* borra la entrada si no hay valor; nombre y valor de hasta 64 bytes | `semana3/Documentacion.md` | [Lista de operaciones de Stellar](https://developers.stellar.org/docs/learn/fundamentals/transactions/list-of-operations), consultada el 08/10/2026 | ✅ |
| passkey-kit crea billeteras inteligentes con passkeys en Stellar; el repo se movió a `stellar/passkey-kit` | `semana3/Documentacion.md` | [README de passkey-kit](https://github.com/kalepail/passkey-kit), consultado el 08/10/2026 | ✅ |
| Barra de 40 g; ingredientes: avena, cacahuate, cacao, amaranto, miel, chía y canela; lema “Energía que nace de nuestras raíces” | Página pública del lote (`frontend/src/app/lote/[id].tsx`) | Problem Brief y `README.md` anterior | 🧪 ⏳ validar contra la etiqueta final |

## Pendientes de conseguir

| Pendiente | Para qué |
|---|---|
| Cotización real de una certificación de origen u orgánica | Convertir en cifra la fricción 3 (certificar es caro para lotes pequeños). |
| Precio a granel que recibe un productor de amaranto | Cuantificar lo que el productor no cobra (fricción 4). |
| Encuesta a 50 personas del segmento, con una pregunta sobre confianza en el origen | Validar el supuesto 1. La “pregunta 8” del supuesto 1 remite a esta encuesta. |
| Al menos una conversación con un productor o acopiador de amaranto en Morelos | Validar el supuesto 2. |
| Costo de operar el registro frente al margen por barra | Riesgo general del Problem Brief. |
