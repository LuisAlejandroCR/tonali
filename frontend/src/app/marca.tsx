// marca.tsx: brand panel (story 2); builds a batch from confirmed deliveries and shows its printable QR.
// Three steps: ① choose deliveries → ② batch date and bar count → ③ the created batch with its QR.

import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { AnimatedCheck, StepCounter, StepSlide } from '@/components/motion';
import { BackHeader, FactLine } from '@/components/task-blocks';
import { Button, Card, CheckRow, DemoBand, Field, Label, Notice, Row, Screen, Section, TextAction } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { actorLabel, actorsByRole } from '@/domain/actors';
import { formatDate, formatShortDate, isValidDate, toLocalDate } from '@/domain/dates';
import { createBatch, getBatchOrigin } from '@/domain/ledger';
import { formatKilograms, parseUnits } from '@/domain/quantity';
import type { BatchView, DeliveryView, LedgerState } from '@/domain/types';
import { useTheme } from '@/hooks/use-theme';
import { confirmToUser } from '@/ledger/feedback';
import { useLedger } from '@/ledger/ledger-provider';
import { batchPath, publicBatchUrl } from '@/ledger/links';

const BRAND_ID = actorsByRole('brand')[0].id;
const STEPS = ['Entregas', 'Lote', 'QR'];

function BatchQr({ batchId, size }: { batchId: string; size: number }) {
  return (
    <View style={styles.qr}>
      <QRCode value={publicBatchUrl(batchId)} size={size} color="#2B1A12" backgroundColor="#FFFFFF" ecl="M" />
    </View>
  );
}

function originSummary(state: LedgerState, batch: BatchView): string {
  const origin = getBatchOrigin(state, batch.id);
  if (!origin) return `${batch.units} barras`;
  const producers = origin.producerIds.length;
  return `${batch.units} barras · ${formatKilograms(origin.totalGrams)} · ${producers} ${producers === 1 ? 'productor' : 'productores'}`;
}

function DeliveryChoice({ delivery, selected, onToggle }: { delivery: DeliveryView; selected: boolean; onToggle: () => void }) {
  return (
    <CheckRow
      title={`${delivery.id} · ${actorLabel(delivery.producerId)}`}
      detail={`Amaranto · ${formatKilograms(delivery.grams)} · ${formatShortDate(delivery.deliveredOn)}${
        delivery.batchIds.length > 0 ? ` · ya en ${delivery.batchIds.join(', ')}` : ''
      }`}
      checked={selected}
      onPress={onToggle}
    />
  );
}

export default function BrandScreen() {
  const { generation } = useLedger();
  return <BrandScreenTask key={generation} />;
}

function BrandScreenTask() {
  const theme = useTheme();
  const { state, submit, hapticsEnabled } = useLedger();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [producedOn, setProducedOn] = useState(() => toLocalDate(new Date()));
  const [units, setUnits] = useState('100');
  const [unitsError, setUnitsError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [showUsed, setShowUsed] = useState(false);

  const confirmed = state.deliveries.filter((item) => item.status === 'confirmed');
  const available = confirmed.filter((item) => item.batchIds.length === 0);
  const used = confirmed.filter((item) => item.batchIds.length > 0);
  const chosen = confirmed.filter((item) => selected.includes(item.id));
  const chosenGrams = chosen.reduce((sum, item) => sum + item.grams, 0);
  const chosenProducers = new Set(chosen.map((item) => item.producerId)).size;
  const chosenSummary =
    chosen.length === 0
      ? 'Ninguna entrega elegida'
      : `${chosen.length} ${chosen.length === 1 ? 'entrega' : 'entregas'} · ${formatKilograms(chosenGrams)} · ${chosenProducers} ${chosenProducers === 1 ? 'productor' : 'productores'}`;
  const created = createdId ? state.batches.find((batch) => batch.id === createdId) : undefined;
  const others = [...state.batches].reverse().filter((batch) => batch.id !== createdId);

  function go(next: number) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    setError(null);
  }

  function toggle(id: string) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  async function onCreate() {
    setError(null);
    const parsedUnits = parseUnits(units);
    if (!parsedUnits.ok) {
      setUnitsError(parsedUnits.error);
      return;
    }
    setUnitsError(null);
    setBusy(true);
    const result = await submit((events, clock) =>
      createBatch(
        events,
        { brandId: BRAND_ID, deliveryIds: selected, producedOn: producedOn.trim(), units: parsedUnits.value },
        clock,
      ),
    );
    setBusy(false);
    if (!result.ok || result.value.kind !== 'batch_created') {
      setError(result.ok ? 'No se pudo crear el lote.' : result.error);
      return;
    }
    setCreatedId(result.value.batchId);
    setSelected([]);
    go(3);
    confirmToUser(`Lote ${result.value.batchId} creado. Su QR está listo.`, 'saved', hapticsEnabled);
  }

  function startOver() {
    setCreatedId(null);
    setDirection(-1);
    setStep(1);
  }

  return (
    <Screen>
      <DemoBand />
      <Label variant="small">{`Firmas como ${actorLabel(BRAND_ID)}`}</Label>

      {showUsed ? (
        <Card>
          <BackHeader label="Nuevo lote" onBack={() => setShowUsed(false)} />
          <Label style={{ fontWeight: '700' }}>{`Entregas ya usadas (${used.length})`}</Label>
          {used.map((delivery) => (
            <View key={delivery.id} style={styles.usedRow}>
              <Label style={{ fontWeight: '700' }}>{`${delivery.id} · ${actorLabel(delivery.producerId)}`}</Label>
              <Label variant="small">{`${formatKilograms(delivery.grams)} · Lote ${delivery.batchIds.join(', ')}`}</Label>
            </View>
          ))}
        </Card>
      ) : step === 3 && created ? (
        <Card>
          <Label variant="heading" role="header">
            Nuevo lote
          </Label>
          <StepCounter current={3} total={STEPS.length} labels={STEPS} />
          <Label variant="heading" style={{ color: theme.success }}>
            ✓ Lote creado
          </Label>
          <AnimatedCheck />
          <Label variant="title" style={{ textAlign: 'center' }}>
            {created.id}
          </Label>
          <BatchQr batchId={created.id} size={180} />
          <Label style={{ textAlign: 'center', fontWeight: '700' }}>{originSummary(state, created).split(' · ').slice(0, 2).join(' · ')}</Label>
          <Label variant="muted" style={{ textAlign: 'center' }}>{`Amaranto · ${originSummary(state, created).split(' · ').slice(2).join(' · ')}`}</Label>
          <Button label="Ver página pública" onPress={() => router.push(batchPath(created.id))} />
          <TextAction label="Crear otro lote" onPress={startOver} />
        </Card>
      ) : (
        <Card>
          <Label variant="heading" role="header">
            Nuevo lote
          </Label>
          <StepCounter current={step} total={STEPS.length} labels={STEPS} />
          <StepSlide stepKey={String(step)} direction={direction}>
            {step === 1 ? (
              <>
                <Label style={{ fontWeight: '700' }}>Elige entregas</Label>
                {available.length === 0 ? (
                  <Label variant="muted">No hay entregas confirmadas sin lote. Cuando el acopiador confirme una, aparecerá aquí.</Label>
                ) : null}
                {available.map((delivery) => (
                  <DeliveryChoice key={delivery.id} delivery={delivery} selected={selected.includes(delivery.id)} onToggle={() => toggle(delivery.id)} />
                ))}
                {used.length > 0 ? (
                  <TextAction label={`Ver entregas ya usadas (${used.length})`} onPress={() => setShowUsed(true)} />
                ) : null}
                <Label style={{ fontWeight: '700' }} >{chosenSummary}</Label>
                <Button label="Continuar →" disabled={chosen.length === 0} onPress={() => go(2)} />
                {chosen.length === 0 ? <Label variant="small">Marca al menos una entrega para continuar.</Label> : null}
              </>
            ) : null}

            {step === 2 ? (
              <>
                <FactLine icon="calendar" text="Elaboración" />
                <Field
                  label="Fecha de elaboración"
                  hint={isValidDate(producedOn.trim()) ? formatDate(producedOn.trim()) : 'Formato AAAA-MM-DD'}
                  value={producedOn}
                  onChangeText={setProducedOn}
                  autoCorrect={false}
                />
                <FactLine icon="box" text="Barras" />
                <Field
                  label="Número de barras"
                  error={unitsError}
                  value={units}
                  onChangeText={setUnits}
                  keyboardType="number-pad"
                  inputMode="numeric"
                />
                <Label style={{ fontWeight: '700' }}>{`${chosenSummary} · ${units.trim() || '—'} barras`}</Label>
                <View style={styles.nav}>
                  <View style={{ flex: 1 }}>
                    <Button label="← Atrás" variant="secondary" disabled={busy} onPress={() => go(1)} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button label={busy ? 'Creando…' : 'Crear lote →'} disabled={busy} onPress={onCreate} />
                  </View>
                </View>
              </>
            ) : null}
          </StepSlide>
          {error ? <Notice tone="error">{error}</Notice> : null}
        </Card>
      )}

      <Section title={`Lotes creados (${state.batches.length})`}>
        {others.length === 0 && !created ? <Label variant="muted">Todavía no hay lotes.</Label> : null}
        {others.map((batch) => (
          <Card key={batch.id}>
            <Label variant="heading">{batch.id}</Label>
            <BatchQr batchId={batch.id} size={120} />
            <Row label="Elaborado el" value={formatDate(batch.producedOn)} />
            <Row label="Resumen" value={originSummary(state, batch)} />
            <TextAction label="Ver página pública" onPress={() => router.push(batchPath(batch.id))} />
          </Card>
        ))}
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  qr: { alignItems: 'center', padding: Spacing.md, backgroundColor: '#FFFFFF', borderRadius: Radius.sm },
  nav: { flexDirection: 'row', gap: Spacing.sm },
  usedRow: { gap: 2, paddingVertical: Spacing.xs },
});
