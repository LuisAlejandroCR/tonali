// productor.tsx: producer screen (story 1); registers and signs an amaranth delivery from the phone.
// Summary → three short steps (amount, date, optional photo) → confirmation → history. Photos stay on the device.

import { useState } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';

import { AnimatedCheck, StepCounter, StepSlide } from '@/components/motion';
import { OriginIcon } from '@/components/origin-icons';
import { BackHeader, HistoryList, StatSummary, SuccessCard } from '@/components/task-blocks';
import { Button, Card, Choice, DemoBand, Field, Label, Notice, RadioRow, Screen, TextAction } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { actorLabel, actorsByRole } from '@/domain/actors';
import { shortHash } from '@/domain/bytes';
import { formatDate, formatShortDate, isValidDate, toLocalDate } from '@/domain/dates';
import { registerDelivery } from '@/domain/ledger';
import { formatKilograms, parseKilograms } from '@/domain/quantity';
import { useTheme } from '@/hooks/use-theme';
import { confirmToUser } from '@/ledger/feedback';
import { useLedger } from '@/ledger/ledger-provider';
import { pickAndHashPhoto, type PhotoSource, type PickedPhoto } from '@/ledger/photo';

const PRODUCERS = actorsByRole('producer');
const TOTAL_STEPS = 3;

function yesterday(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return toLocalDate(date);
}

function StepIcon({ name, title, subtitle }: { name: 'grain' | 'calendar' | 'camera'; title: string; subtitle?: string }) {
  const theme = useTheme();
  return (
    <View style={styles.stepIcon}>
      <View style={[styles.iconCircle, { backgroundColor: theme.primarySoft }]}>
        <OriginIcon name={name} color={theme.primary} size={32} />
      </View>
      <Label variant="heading" style={{ textAlign: 'center' }}>
        {title}
      </Label>
      {subtitle ? <Label variant="small">{subtitle}</Label> : null}
    </View>
  );
}

export default function ProducerScreen() {
  const { generation } = useLedger();
  return <ProducerScreenTask key={generation} />;
}

function ProducerScreenTask() {
  const { state, submit, hapticsEnabled } = useLedger();
  const [producerId, setProducerId] = useState(PRODUCERS[0].id);
  const [switching, setSwitching] = useState(false);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [kilos, setKilos] = useState('');
  const [kilosError, setKilosError] = useState<string | null>(null);
  const [deliveredOn, setDeliveredOn] = useState(() => toLocalDate(new Date()));
  const [dateError, setDateError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<{ id: string; grams: number } | null>(null);

  const mine = state.deliveries.filter((item) => item.producerId === producerId).reverse();
  const count = (status: string) => mine.filter((item) => item.status === status).length;
  const rejected = count('rejected');
  const today = toLocalDate(new Date());

  function go(next: number) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    setError(null);
  }

  function continueFromAmount() {
    const grams = parseKilograms(kilos);
    if (!grams.ok) {
      setKilosError(grams.error);
      return;
    }
    setKilosError(null);
    go(2);
  }

  function continueFromDate() {
    const value = deliveredOn.trim();
    if (!isValidDate(value)) {
      setDateError('Escribe la fecha como AAAA-MM-DD, por ejemplo 2026-10-08.');
      return;
    }
    if (value > today) {
      setDateError('La fecha de entrega no puede ser futura.');
      return;
    }
    setDateError(null);
    go(3);
  }

  async function onPhoto(source: PhotoSource) {
    setBusy(true);
    const result = await pickAndHashPhoto(source);
    setBusy(false);
    if (!result) return;
    if (result.ok) setPhoto(result.value);
    else setError(result.error);
  }

  async function onSubmit() {
    const grams = parseKilograms(kilos);
    if (!grams.ok) {
      go(1);
      setKilosError(grams.error);
      return;
    }
    setBusy(true);
    const result = await submit((events, clock) =>
      registerDelivery(
        events,
        { producerId, grams: grams.value, deliveredOn: deliveredOn.trim(), photoHash: photo?.hash ?? null },
        clock,
      ),
    );
    setBusy(false);
    if (!result.ok || result.value.kind !== 'delivery_registered') {
      setError(result.ok ? 'No se pudo registrar la entrega.' : result.error);
      return;
    }
    setSaved({ id: result.value.deliveryId, grams: grams.value });
    confirmToUser(`Entrega ${result.value.deliveryId} registrada. Ahora espera la revisión del acopiador.`, 'saved', hapticsEnabled);
  }

  function startOver() {
    setSaved(null);
    setKilos('');
    setPhoto(null);
    setDeliveredOn(toLocalDate(new Date()));
    setDirection(-1);
    setStep(1);
  }

  return (
    <Screen>
      <DemoBand />
      <View style={styles.identity}>
        <Label variant="small">{`Registras como ${actorLabel(producerId)}`}</Label>
        <TextAction label={switching ? 'Cambiar ▴' : 'Cambiar ▾'} onPress={() => setSwitching((value) => !value)} />
      </View>
      {switching ? (
        <Card>
          <View accessibilityRole="radiogroup">
            {PRODUCERS.map((actor) => (
              <RadioRow
                key={actor.id}
                label={actor.label}
                selected={actor.id === producerId}
                onPress={() => {
                  setProducerId(actor.id);
                  setSwitching(false);
                  startOver();
                }}
              />
            ))}
          </View>
        </Card>
      ) : null}

      <StatSummary
        eyebrow="Tus entregas"
        stats={[
          { label: count('pending') === 1 ? 'pendiente' : 'pendientes', value: count('pending'), tone: 'warning' },
          { label: count('confirmed') === 1 ? 'confirmada' : 'confirmadas', value: count('confirmed'), tone: 'success' },
          ...(rejected > 0 ? [{ label: rejected === 1 ? 'rechazada' : 'rechazadas', value: rejected, tone: 'error' as const }] : []),
        ]}
      />

      {saved ? (
        <SuccessCard title="Entrega registrada">
          <AnimatedCheck />
          <Label style={{ textAlign: 'center', fontWeight: '700' }}>{`${saved.id} · ${formatKilograms(saved.grams)}`}</Label>
          <Label variant="muted" style={{ textAlign: 'center' }}>
            Ahora espera la revisión del acopiador.
          </Label>
          <Button label="Registrar otra" onPress={startOver} />
        </SuccessCard>
      ) : (
        <Card>
          <BackHeader
            label="Nueva entrega"
            onBack={step > 1 ? () => go(step - 1) : undefined}
            counter={<StepCounter current={step} total={TOTAL_STEPS} />}
          />

          <StepSlide stepKey={String(step)} direction={direction}>
            {step === 1 ? (
              <>
                <StepIcon name="grain" title="Amaranto" subtitle="¿Cuánto entregaste?" />
                <Field
                  label="Cantidad (kg)"
                  hint="Por ejemplo 25 o 18.5"
                  error={kilosError}
                  value={kilos}
                  onChangeText={setKilos}
                  keyboardType="decimal-pad"
                  inputMode="decimal"
                  placeholder="25"
                  onSubmitEditing={continueFromAmount}
                />
                <Button label="Continuar →" onPress={continueFromAmount} />
              </>
            ) : null}

            {step === 2 ? (
              <>
                <StepIcon name="calendar" title="¿Cuándo la entregaste?" />
                <View style={styles.choices}>
                  <Choice label="Hoy" selected={deliveredOn === today} onPress={() => setDeliveredOn(today)} />
                  <Choice label="Ayer" selected={deliveredOn === yesterday()} onPress={() => setDeliveredOn(yesterday())} />
                </View>
                <Field
                  label="Fecha de entrega"
                  hint={isValidDate(deliveredOn.trim()) ? formatDate(deliveredOn.trim()) : 'Formato AAAA-MM-DD'}
                  error={dateError}
                  value={deliveredOn}
                  onChangeText={setDeliveredOn}
                  autoCorrect={false}
                />
                <View style={styles.nav}>
                  <View style={{ flex: 1 }}>
                    <Button label="← Atrás" variant="secondary" onPress={() => go(1)} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button label="Continuar →" onPress={continueFromDate} />
                  </View>
                </View>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <StepIcon name="camera" title="Agrega una foto" subtitle="Opcional" />
                {photo ? (
                  <View style={styles.photo}>
                    <Image
                      source={{ uri: photo.uri }}
                      accessibilityLabel="Foto elegida de la entrega"
                      style={{ width: 56, height: 56, borderRadius: Radius.sm }}
                    />
                    <View style={{ flex: 1 }}>
                      <Label variant="small">Sólo se guarda su huella</Label>
                      <Label variant="mono">{shortHash(photo.hash)}</Label>
                    </View>
                  </View>
                ) : null}
                {Platform.OS !== 'web' ? (
                  <Button label="Tomar foto" variant="secondary" disabled={busy} onPress={() => onPhoto('camera')} />
                ) : null}
                <Button
                  label={photo ? 'Cambiar foto' : 'Elegir foto'}
                  variant="secondary"
                  disabled={busy}
                  onPress={() => onPhoto('library')}
                />
                <Label variant="small">La foto se queda en tu teléfono; sólo se guarda su huella.</Label>
                <Label style={{ fontWeight: '700' }}>{`${kilos.trim() || '—'} kg · ${isValidDate(deliveredOn.trim()) ? formatShortDate(deliveredOn.trim(), 0) : deliveredOn}`}</Label>
                <View style={styles.nav}>
                  <View style={{ flex: 1 }}>
                    <Button label="← Atrás" variant="secondary" disabled={busy} onPress={() => go(2)} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button label={busy ? 'Registrando…' : 'Registrar ✓'} disabled={busy} onPress={onSubmit} />
                  </View>
                </View>
              </>
            ) : null}
          </StepSlide>
          {error ? <Notice tone="error">{error}</Notice> : null}
        </Card>
      )}

      <HistoryList title="Mis entregas" items={mine} empty="Todavía no registras entregas con esta cuenta." />
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' },
  choices: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  stepIcon: { alignItems: 'center', gap: Spacing.xs, paddingVertical: Spacing.sm },
  iconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  photo: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  nav: { flexDirection: 'row', gap: Spacing.sm },
});
