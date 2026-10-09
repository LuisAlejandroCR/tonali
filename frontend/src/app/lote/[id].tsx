// [id].tsx: public batch page opened by the package QR (stories 3 and 5); read-only, no account or wallet.
// Leads with the producer → collector → brand journey; ids, fingerprints and signatures sit behind "Ver detalles".

import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { OriginIcon } from '@/components/origin-icons';
import { Button, Card, DemoBand, Label, Notice, Row, Screen, Section } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { actorLabel } from '@/domain/actors';
import { shortHash } from '@/domain/bytes';
import { formatDate, formatShortDate, formatTimestamp } from '@/domain/dates';
import { getBatchOrigin } from '@/domain/ledger';
import { formatKilograms } from '@/domain/quantity';
import type { DeliveryView } from '@/domain/types';
import { useTheme } from '@/hooks/use-theme';
import { useLedger } from '@/ledger/ledger-provider';

const WIDE_LAYOUT = 520;

function Disclosure({ title, children }: { title: string; children: ReactNode }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <Card>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((value) => !value)}
        style={styles.rowHeader}>
        <OriginIcon name="grain" color={theme.primary} size={24} />
        <Label variant="heading" style={{ flex: 1 }}>
          {title}
        </Label>
        <Label style={{ color: theme.primary, fontWeight: '700' }}>{open ? 'Ocultar' : 'Ver +'}</Label>
      </Pressable>
      {open ? children : null}
    </Card>
  );
}

function Journey({ deliveries, brandId }: { deliveries: number; brandId: string }) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const wide = width >= WIDE_LAYOUT;
  const steps = [
    { icon: 'sprout' as const, role: 'Productor', state: `${deliveries} ${deliveries === 1 ? 'entrega firmada' : 'entregas firmadas'}` },
    { icon: 'box' as const, role: 'Acopiador', state: 'Recepción confirmada' },
    { icon: 'tag' as const, role: actorLabel(brandId), state: 'Lote creado' },
  ];
  return (
    <View
      accessible
      accessibilityLabel={`Recorrido: ${steps.map((step) => `${step.role}, ${step.state}`).join('; ')}`}
      style={[styles.journey, { flexDirection: wide ? 'row' : 'column', gap: wide ? 0 : Spacing.xs }]}>
      {steps.map((step, index) => (
        <View key={step.role} style={{ flexDirection: wide ? 'row' : 'column', flex: wide ? 1 : undefined }}>
        <View
          style={[styles.journeyItem, { flexDirection: wide ? 'column' : 'row', flex: wide ? 1 : undefined }]}>
          <View style={[styles.journeyIcon, { backgroundColor: theme.surface, borderColor: theme.primary }]}>
            <OriginIcon name={step.icon} color={theme.primary} />
          </View>
          <View style={{ alignItems: wide ? 'center' : 'flex-start', flex: wide ? undefined : 1 }}>
            <Label style={{ fontWeight: '700', textAlign: wide ? 'center' : 'left' }}>{`${index + 1}. ${step.role}`}</Label>
            <Label variant="small" style={{ color: theme.success, fontWeight: '700', textAlign: wide ? 'center' : 'left' }}>
              {`✓ ${step.state}`}
            </Label>
          </View>
        </View>
        {index < steps.length - 1 ? (
          <View
            style={[
              wide ? styles.connectorWide : styles.connectorTall,
              { backgroundColor: theme.primary },
            ]}
          />
        ) : null}
        </View>
      ))}
    </View>
  );
}

function ProducerEntry({ delivery }: { delivery: DeliveryView }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <View style={[styles.producer, { borderColor: theme.border }]}>
      <View style={styles.rowHeader}>
        <View style={{ flex: 1 }}>
          <Label style={{ fontWeight: '700' }}>{actorLabel(delivery.producerId)}</Label>
          <Label variant="small">{`${formatKilograms(delivery.grams)} · ${formatShortDate(delivery.deliveredOn)}`}</Label>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          accessibilityLabel={`Ver detalles de ${actorLabel(delivery.producerId)}`}
          onPress={() => setOpen((value) => !value)}
          hitSlop={8}>
          <Label style={{ color: theme.primary, fontWeight: '700' }}>{open ? 'Ocultar' : 'Ver detalles'}</Label>
        </Pressable>
      </View>
      {open ? (
        <View style={{ gap: Spacing.xs }}>
          <Row label="Registro" value={`${delivery.id}, firmado por el productor`} />
          {delivery.review ? (
            <Row label="Recepción" value={`${actorLabel(delivery.review.collectorId)}, ${formatTimestamp(delivery.review.at)}`} />
          ) : null}
          <Row label="Foto" value={delivery.photoHash ? `huella ${shortHash(delivery.photoHash)} (no se publica)` : 'sin foto'} />
          <Row label="Firmas" value={`${delivery.producerSignature.value} · ${delivery.review?.signature.value ?? '—'} (simuladas)`} />
        </View>
      ) : null}
    </View>
  );
}

function useReveal(): Animated.Value {
  const [opacity] = useState(() => new Animated.Value(0));
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => true)
      .then((reduce) => {
        if (!active) return;
        if (reduce) opacity.setValue(1);
        else Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }).start();
      });
    return () => {
      active = false;
    };
  }, [opacity]);
  return opacity;
}

const TRUST = [
  { icon: 'pen' as const, text: 'Cada actor firma su paso' },
  { icon: 'lock' as const, text: 'Los registros sólo se agregan' },
  { icon: 'eye-off' as const, text: 'La foto no se publica' },
];

export default function BatchOriginScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, ready } = useLedger();
  const origin = ready && id ? getBatchOrigin(state, id) : null;
  const opacity = useReveal();

  if (!ready) {
    return (
      <Screen>
        <Label variant="muted">Buscando el lote…</Label>
      </Screen>
    );
  }

  if (!origin) {
    return (
      <Screen>
        <Notice tone="error">{`No encontramos el lote ${id ?? ''}. Revisa el código impreso junto al QR de tu empaque y vuelve a escanearlo.`}</Notice>
        <Button label="¿Qué es TONALI?" variant="secondary" onPress={() => router.replace('/')} />
      </Screen>
    );
  }

  const { batch, deliveries, totalGrams, producerIds } = origin;

  return (
    <Screen>
      <Animated.View style={{ opacity, gap: Spacing.lg }}>
        <DemoBand />

        <Card tone="highlight">
          <Label variant="title" role="header">
            {batch.id}
          </Label>
          <Label>{`Elaborado el ${formatDate(batch.producedOn)} · ${batch.units} barras`}</Label>
          <Label variant="muted">{`Amaranto de ${producerIds.length} ${producerIds.length === 1 ? 'productor' : 'productores'} de Morelos · ${formatKilograms(totalGrams)}`}</Label>
          <Journey deliveries={deliveries.length} brandId={batch.brandId} />
        </Card>

        <Section title={`Productores (${producerIds.length})`}>
          <Card>
            <View style={styles.inline}>
              <OriginIcon name="pin" color={theme.primary} size={20} />
              <Label variant="small">Amaranto · Morelos</Label>
            </View>
            {deliveries.map((delivery) => (
              <ProducerEntry key={delivery.id} delivery={delivery} />
            ))}
          </Card>
        </Section>

        <View style={[styles.trust, { borderColor: theme.border, backgroundColor: theme.surfaceMuted }]}>
          {TRUST.map((item) => (
            <View key={item.text} style={styles.trustItem}>
              <OriginIcon name={item.icon} color={theme.primary} size={24} />
              <Label variant="small" style={{ textAlign: 'center', color: theme.text }}>
                {item.text}
              </Label>
            </View>
          ))}
        </View>

        <Disclosure title="Sobre la barra TONALI">
          <Label variant="muted">“Energía que nace de nuestras raíces.”</Label>
          <Label>Barra de 40 g con identidad de Morelos.</Label>
          <Row label="Ingredientes" value="Avena, cacahuate, cacao, amaranto, miel, chía y canela" />
          <Label variant="small">Este registro rastrea por ahora el amaranto. Los demás insumos llegarán después.</Label>
        </Disclosure>

        <Button label="¿Qué es TONALI?" variant="secondary" onPress={() => router.push('/')} />
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  journey: { gap: Spacing.md, paddingTop: Spacing.md },
  journeyItem: { alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.xs },
  connectorTall: { width: 2, height: 18, marginLeft: 29 },
  connectorWide: { height: 2, width: 20, marginTop: 26 },
  journeyIcon: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  rowHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, minHeight: 44 },
  producer: { borderTopWidth: 1, paddingTop: Spacing.sm, gap: Spacing.sm },
  inline: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  trust: { flexDirection: 'row', borderWidth: 1, borderRadius: Radius.md, padding: Spacing.md, gap: Spacing.sm },
  trustItem: { flex: 1, alignItems: 'center', gap: Spacing.xs },
});
