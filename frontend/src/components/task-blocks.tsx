// task-blocks.tsx: shared pieces for the role screens: a summary header, a success card and compact delivery rows.
// Keeps the producer, collector and brand screens on the same pattern: summary → main action → history.

import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { OriginIcon } from '@/components/origin-icons';
import { Card, Label, Pill, type Tone } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { actorLabel } from '@/domain/actors';
import { formatShortDate } from '@/domain/dates';
import { formatKilograms } from '@/domain/quantity';
import type { DeliveryStatus, DeliveryView } from '@/domain/types';
import { useTheme } from '@/hooks/use-theme';

export const STATUS: Record<DeliveryStatus, { label: string; tone: Tone }> = {
  pending: { label: 'Pendiente', tone: 'warning' },
  confirmed: { label: 'Confirmada', tone: 'success' },
  rejected: { label: 'Rechazada', tone: 'error' },
};

export function SummaryHeader({ eyebrow, headline, detail }: { eyebrow: string; headline: string; detail?: string }) {
  return (
    <Card tone="highlight">
      <Label variant="small">{eyebrow}</Label>
      <Label variant="heading" role="header">
        {headline}
      </Label>
      {detail ? <Label variant="muted">{detail}</Label> : null}
    </Card>
  );
}

export function StatSummary({ eyebrow, stats }: { eyebrow: string; stats: { label: string; value: number; tone: Tone }[] }) {
  const theme = useTheme();
  const colors = { info: theme.primary, success: theme.success, warning: theme.warning, error: theme.danger };
  return (
    <Card tone="highlight">
      <Label variant="small">{eyebrow}</Label>
      <View style={styles.stats}>
        {stats.map((stat) => (
          <View key={stat.label} accessible accessibilityLabel={`${stat.value} ${stat.label}`} style={styles.stat}>
            <Label variant="title" style={{ color: colors[stat.tone] }}>{String(stat.value)}</Label>
            <Label variant="small" style={{ color: theme.text }}>{stat.label}</Label>
          </View>
        ))}
      </View>
    </Card>
  );
}

export function SuccessCard({ title, children }: { title: string; children: ReactNode }) {
  const theme = useTheme();
  return (
    <View
      accessibilityLiveRegion="polite"
      style={[styles.success, { backgroundColor: theme.successSoft, borderColor: theme.success }]}>
      <Label variant="heading" style={{ color: theme.success }}>{`✓ ${title}`}</Label>
      {children}
    </View>
  );
}

export function FactLine({ icon, text }: { icon: 'grain' | 'pin' | 'sprout' | 'tag' | 'calendar' | 'box'; text: string }) {
  const theme = useTheme();
  return (
    <View style={styles.fact}>
      <OriginIcon name={icon} color={theme.primary} size={18} />
      <Label variant="small" style={{ color: theme.text }}>
        {text}
      </Label>
    </View>
  );
}

export function DeliveryRow({ delivery, showProducer = false }: { delivery: DeliveryView; showProducer?: boolean }) {
  const theme = useTheme();
  const status = STATUS[delivery.status];
  const when = [formatShortDate(delivery.deliveredOn), ...delivery.batchIds].join(' · ');
  const extra = delivery.review?.reason ? `Motivo: ${delivery.review.reason}` : null;
  return (
    <View style={[styles.row, { borderColor: theme.border }]}>
      <View style={{ flex: 1, gap: 2 }}>
        <Label style={{ fontWeight: '700' }}>
          {`${delivery.id} · ${formatKilograms(delivery.grams)}${showProducer ? ` · ${actorLabel(delivery.producerId)}` : ''}`}
        </Label>
        <Label variant="small">{when}</Label>
        {extra ? <Label variant="small">{extra}</Label> : null}
      </View>
      <Pill label={status.label} tone={status.tone} />
    </View>
  );
}

export function HistoryList({
  title,
  items,
  empty,
  initial = 3,
  showProducer = false,
}: {
  title: string;
  items: DeliveryView[];
  empty: string;
  initial?: number;
  showProducer?: boolean;
}) {
  const theme = useTheme();
  const [all, setAll] = useState(false);
  const visible = all ? items : items.slice(0, initial);
  return (
    <Card>
      <View style={styles.historyHeader}>
        <Label variant="heading" style={{ flex: 1 }}>{`${title} (${items.length})`}</Label>
        {items.length > initial ? (
          <Pressable accessibilityRole="button" onPress={() => setAll((value) => !value)} hitSlop={8}>
            <Label style={{ color: theme.primary, fontWeight: '700' }}>{all ? 'Ver menos' : 'Ver todas'}</Label>
          </Pressable>
        ) : null}
      </View>
      {items.length === 0 ? <Label variant="muted">{empty}</Label> : null}
      {visible.map((item) => (
        <DeliveryRow key={item.id} delivery={item} showProducer={showProducer} />
      ))}
    </Card>
  );
}

export function BackHeader({ label, onBack, counter }: { label: string; onBack?: () => void; counter?: ReactNode }) {
  const theme = useTheme();
  return (
    <View style={styles.backHeader}>
      {onBack ? (
        <Pressable accessibilityRole="button" accessibilityLabel={`Volver: ${label}`} onPress={onBack} hitSlop={10} style={styles.backHit}>
          <Label variant="heading" style={{ color: theme.primary }}>
            ←
          </Label>
        </Pressable>
      ) : null}
      <Label variant="heading" role="header" style={{ flex: 1 }}>
        {label}
      </Label>
      {counter}
    </View>
  );
}

export function TwoStepTrail({ first, second }: { first: string; second: string }) {
  const theme = useTheme();
  return (
    <View accessible accessibilityLabel={`Después de registrar: ${first}; luego ${second}`} style={styles.trail}>
      <View style={styles.trailStep}>
        <View style={[styles.dot, { backgroundColor: theme.primary, borderColor: theme.primary }]} />
        <Label variant="small" style={{ color: theme.text, fontWeight: '700' }}>
          {first}
        </Label>
      </View>
      <View style={[styles.trailLine, { backgroundColor: theme.border }]} />
      <View style={styles.trailStep}>
        <View style={[styles.dot, { borderColor: theme.primary }]} />
        <Label variant="small">{second}</Label>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  success: { borderWidth: 1.5, borderRadius: Radius.md, padding: Spacing.md, gap: Spacing.sm },
  stats: { flexDirection: 'row', gap: Spacing.lg, flexWrap: 'wrap' },
  stat: { minWidth: 88 },
  fact: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderTopWidth: 1, paddingTop: Spacing.sm },
  historyHeader: { flexDirection: 'row', alignItems: 'center', minHeight: 32 },
  trail: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  backHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, minHeight: 44 },
  backHit: { minWidth: 32, minHeight: 44, justifyContent: 'center' },
  trailStep: { flex: 1, alignItems: 'center', gap: Spacing.xs },
  trailLine: { height: 2, flex: 0.6, marginTop: 7 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2 },
});
