// acopiador.tsx: collector screen (story 4); confirms or rejects pending deliveries with a signed record.
// Sub-views: pending list → review one delivery (confirm, or reject with what does not match) → result; plus history.

import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimatedCheck, StepCounter, StepSlide } from '@/components/motion';
import { OriginIcon } from '@/components/origin-icons';
import { BackHeader, DeliveryRow, FactLine, SuccessCard, SummaryHeader } from '@/components/task-blocks';
import { Button, Card, Choice, DemoBand, Field, Label, Notice, Screen, TextAction } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { actorLabel, actorsByRole } from '@/domain/actors';
import { formatShortDate } from '@/domain/dates';
import { confirmDelivery, rejectDelivery } from '@/domain/ledger';
import { formatKilograms } from '@/domain/quantity';
import type { DeliveryView } from '@/domain/types';
import { useTheme } from '@/hooks/use-theme';
import { confirmToUser } from '@/ledger/feedback';
import { useLedger } from '@/ledger/ledger-provider';

const COLLECTOR_ID = actorsByRole('collector')[0].id;

const MISMATCH = [
  { key: 'cantidad', label: 'Cantidad', reason: 'La cantidad no coincide' },
  { key: 'fecha', label: 'Fecha', reason: 'La fecha no coincide' },
  { key: 'producto', label: 'Producto', reason: 'El producto no coincide' },
  { key: 'otro', label: 'Otro', reason: '' },
] as const;

const FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'confirmed', label: 'Confirmadas' },
  { key: 'rejected', label: 'Rechazadas' },
] as const;

type MismatchKey = (typeof MISMATCH)[number]['key'];
type FilterKey = (typeof FILTERS)[number]['key'];
type Mode = 'list' | 'review' | 'reject' | 'history';
type Outcome = { kind: 'confirmed' | 'rejected'; delivery: DeliveryView; reason: string | null };

function buildReason(kind: MismatchKey | null, note: string): string {
  const base = MISMATCH.find((item) => item.key === kind)?.reason ?? '';
  const detail = note.trim();
  if (base && detail) return `${base}: ${detail}`;
  return base || detail;
}

export default function CollectorScreen() {
  const { generation } = useLedger();
  return <CollectorScreenTask key={generation} />;
}

function CollectorScreenTask() {
  const theme = useTheme();
  const { state, submit, hapticsEnabled } = useLedger();
  const [mode, setMode] = useState<Mode>('list');
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [mismatch, setMismatch] = useState<MismatchKey | null>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [filter, setFilter] = useState<FilterKey>('all');

  const pending = state.deliveries.filter((item) => item.status === 'pending');
  const pendingGrams = pending.reduce((sum, item) => sum + item.grams, 0);
  const current = pending.find((item) => item.id === currentId) ?? null;
  const position = current ? pending.indexOf(current) + 1 : 0;
  const reviewed = state.deliveries
    .filter((item) => item.review !== null)
    .sort((a, b) => (b.review?.at ?? '').localeCompare(a.review?.at ?? ''));
  const filtered = filter === 'all' ? reviewed : reviewed.filter((item) => item.status === filter);

  function open(id: string) {
    setCurrentId(id);
    setOutcome(null);
    setError(null);
    setMismatch(null);
    setNote('');
    setMode('review');
  }

  function backToList() {
    setOutcome(null);
    setError(null);
    setCurrentId(null);
    setMode('list');
  }

  async function onConfirm() {
    if (!current) return;
    setError(null);
    setBusy(true);
    const result = await submit((events, clock) =>
      confirmDelivery(events, { deliveryId: current.id, collectorId: COLLECTOR_ID }, clock),
    );
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setOutcome({ kind: 'confirmed', delivery: current, reason: null });
    confirmToUser(`Recepción de ${current.id} confirmada. Ya puede incluirse en un lote.`, 'saved', hapticsEnabled);
  }

  async function onReject() {
    if (!current) return;
    const reason = buildReason(mismatch, note);
    if (!reason) {
      setError(mismatch === 'otro' ? 'Describe qué no coincide.' : 'Elige qué no coincide.');
      return;
    }
    setError(null);
    setBusy(true);
    const result = await submit((events, clock) =>
      rejectDelivery(events, { deliveryId: current.id, collectorId: COLLECTOR_ID, reason }, clock),
    );
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setOutcome({ kind: 'rejected', delivery: current, reason });
    confirmToUser(`Rechazo de ${current.id} registrado. El productor verá el motivo.`, 'neutral', hapticsEnabled);
  }

  const header = (
    <>
      <DemoBand />
      <Label variant="small">{`Revisas como ${actorLabel(COLLECTOR_ID)}`}</Label>
    </>
  );

  if (mode === 'history') {
    return (
      <Screen>
        {header}
        <Card>
          <BackHeader label="Revisadas recientemente" onBack={backToList} />
          <View accessibilityRole="radiogroup" style={styles.chips}>
            {FILTERS.map((item) => (
              <Choice key={item.key} label={item.label} selected={filter === item.key} onPress={() => setFilter(item.key)} />
            ))}
          </View>
          {filtered.length === 0 ? <Label variant="muted">No hay revisiones con este filtro.</Label> : null}
          {filtered.map((item) => (
            <DeliveryRow key={item.id} delivery={item} showProducer />
          ))}
        </Card>
      </Screen>
    );
  }

  if (outcome) {
    const { delivery } = outcome;
    const next = pending[0];
    return (
      <Screen>
        {header}
        {outcome.kind === 'confirmed' ? (
          <SuccessCard title="Recepción confirmada">
            <AnimatedCheck />
            <Label style={{ textAlign: 'center', fontWeight: '700' }}>{`${delivery.id} · ${formatKilograms(delivery.grams)}`}</Label>
            <Label variant="muted" style={{ textAlign: 'center' }}>
              Ya puede incluirse en un lote.
            </Label>
            {next ? <Button label="Siguiente entrega" onPress={() => open(next.id)} /> : null}
            <Button label="Volver a pendientes" variant="secondary" onPress={backToList} />
            {next ? null : <TextAction label="Ir a crear un lote (demo)" onPress={() => router.push('/marca')} />}
          </SuccessCard>
        ) : (
          <Card>
            <Label variant="heading" role="header">
              Rechazo registrado
            </Label>
            <Label style={{ fontWeight: '700' }}>{`${delivery.id} · ${actorLabel(delivery.producerId)}`}</Label>
            <Label>{`Motivo: ${outcome.reason}`}</Label>
            <Label variant="muted">El productor podrá verlo en su historial.</Label>
            <Button label="Volver a pendientes" variant="secondary" onPress={backToList} />
          </Card>
        )}
      </Screen>
    );
  }

  if (current && (mode === 'review' || mode === 'reject')) {
    return (
      <Screen>
        {header}
        <Card>
          {mode === 'review' ? (
            <BackHeader label="Entregas" onBack={backToList} counter={<StepCounter current={position} total={pending.length} />} />
          ) : (
            <BackHeader label="Revisar entrega" onBack={() => setMode('review')} />
          )}
          <StepSlide stepKey={`${current.id}-${mode}`} direction={1}>
            {mode === 'review' ? (
              <>
                <View style={styles.who}>
                  <View style={[styles.avatar, { backgroundColor: theme.primarySoft }]}>
                    <OriginIcon name="sprout" color={theme.primary} size={30} />
                  </View>
                  <Label variant="heading">{actorLabel(current.producerId)}</Label>
                </View>
                <FactLine icon="grain" text={`Amaranto · ${formatKilograms(current.grams)}`} />
                <FactLine icon="calendar" text={formatShortDate(current.deliveredOn, 0)} />
                <FactLine icon="pin" text="Morelos" />
                <Label variant="small">{`${current.id} · ${current.photoHash ? 'con foto (huella guardada)' : 'sin foto'}`}</Label>
                <Button label={busy ? 'Guardando…' : '✓ Confirmar recepción'} disabled={busy} onPress={onConfirm} />
                <TextAction
                  label="No coincide · Revisar"
                  tone="danger"
                  onPress={() => {
                    setError(null);
                    setMode('reject');
                  }}
                />
              </>
            ) : (
              <>
                <Label style={{ fontWeight: '700' }}>{`Rechazar ${current.id} · ${formatKilograms(current.grams)}`}</Label>
                <Label style={{ fontWeight: '700' }}>¿Qué no coincide? · elige una</Label>
                <View accessibilityRole="radiogroup" style={styles.chips}>
                  {MISMATCH.map((item) => (
                    <Choice key={item.key} label={item.label} selected={mismatch === item.key} onPress={() => setMismatch(item.key)} />
                  ))}
                </View>
                <Field
                  label={mismatch === 'otro' ? 'Detalle · obligatorio con “Otro”' : 'Detalle · opcional'}
                  hint="El productor verá el motivo."
                  value={note}
                  onChangeText={setNote}
                  maxLength={150}
                  multiline
                />
                <Button label="Volver" variant="secondary" disabled={busy} onPress={() => setMode('review')} />
                <Button label={busy ? 'Guardando…' : 'Registrar rechazo'} variant="danger" disabled={busy} onPress={onReject} />
              </>
            )}
          </StepSlide>
          {error ? <Notice tone="error">{error}</Notice> : null}
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      {header}
      <SummaryHeader
        eyebrow="Por revisar"
        headline={
          pending.length === 0
            ? 'Nada pendiente'
            : `${pending.length} ${pending.length === 1 ? 'entrega' : 'entregas'} · ${formatKilograms(pendingGrams)}`
        }
      />
      {pending.map((delivery) => (
        <Card key={delivery.id}>
          <Label style={{ fontWeight: '700' }}>{`${delivery.id} · ${actorLabel(delivery.producerId)}`}</Label>
          <Label variant="small">{`Amaranto · ${formatKilograms(delivery.grams)} · ${formatShortDate(delivery.deliveredOn)}`}</Label>
          <View style={styles.right}>
            <View style={{ minWidth: 150 }}>
              <Button label="Revisar →" onPress={() => open(delivery.id)} />
            </View>
          </View>
        </Card>
      ))}
      <Card>
        <View style={styles.historyHeader}>
          <Label variant="heading" style={{ flex: 1 }}>{`Revisadas recientemente (${reviewed.length})`}</Label>
          {reviewed.length > 0 ? <TextAction label="Ver todas" onPress={() => setMode('history')} /> : null}
        </View>
        {reviewed.length === 0 ? <Label variant="muted">Aún no revisas ninguna entrega.</Label> : null}
        {reviewed.slice(0, 1).map((item) => (
          <DeliveryRow key={item.id} delivery={item} showProducer />
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  who: { alignItems: 'center', gap: Spacing.xs, paddingVertical: Spacing.xs },
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  right: { alignItems: 'flex-end' },
  historyHeader: { flexDirection: 'row', alignItems: 'center' },
});
