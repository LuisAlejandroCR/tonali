// index.tsx: start screen; picks a demo flow (producer, collector, brand) or opens the consumer lookup.
// No login or profile: demo roles are chosen here and the consumer arrives through the package QR.

import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { OriginIcon } from '@/components/origin-icons';
import { Button, Label, Notice, Screen } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLedger } from '@/ledger/ledger-provider';

const TRAIL = [
  { icon: 'sprout' as const, label: 'Productor' },
  { icon: 'box' as const, label: 'Acopiador' },
  { icon: 'tag' as const, label: 'TONALI' },
];

interface FlowEntry {
  icon: 'sprout' | 'box' | 'tag';
  title: string;
  role: string;
  href: Href;
  badge?: string;
}

function FlowCard({ entry }: { entry: FlowEntry }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${entry.title}, ${entry.role}${entry.badge ? `, ${entry.badge}` : ''}`}
      onPress={() => router.push(entry.href)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.85 : 1 },
      ]}>
      <View style={[styles.icon, { backgroundColor: theme.primarySoft }]}>
        <OriginIcon name={entry.icon} color={theme.primary} size={26} />
      </View>
      <View style={{ flex: 1 }}>
        <Label variant="heading">{entry.title}</Label>
        <Label variant="small">{entry.role}</Label>
        {entry.badge ? (
          <Label variant="small" style={{ color: theme.warning, fontWeight: '700' }}>
            {entry.badge}
          </Label>
        ) : null}
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const { state, storageWarning } = useLedger();
  const narrow = useWindowDimensions().width < 400;
  const pending = state.deliveries.filter((item) => item.status === 'pending').length;
  const available = state.deliveries.filter((item) => item.status === 'confirmed' && item.batchIds.length === 0).length;

  const flows: FlowEntry[] = [
    { icon: 'sprout', title: 'Registrar entrega', role: 'Productor de amaranto', href: '/productor' },
    {
      icon: 'box',
      title: 'Confirmar entregas',
      role: 'Acopiador',
      href: '/acopiador',
      badge: pending > 0 ? `${pending} por revisar` : undefined,
    },
    {
      icon: 'tag',
      title: 'Crear lote',
      role: 'TONALI',
      href: '/marca',
      badge: available > 0 ? `${available} sin lote` : undefined,
    },
  ];

  return (
    <Screen>
      <View style={styles.hero}>
        <Label variant="title" role="header" style={{ textAlign: 'center' }}>
          Sigue el origen de tu amaranto
        </Label>
        <View
          accessible
          accessibilityLabel="Recorrido: Productor, Acopiador, TONALI"
          style={[styles.trail, narrow ? styles.trailNarrow : null]}>
          {TRAIL.map((step, index) => (
            <View key={step.label} style={[styles.trailItem, narrow && index > 0 ? { paddingLeft: Spacing.xl } : null]}>
              {index > 0 ? <Label style={{ color: theme.primary, fontWeight: '700' }}>→</Label> : null}
              <OriginIcon name={step.icon} color={theme.primary} size={18} />
              <Label variant="small" style={{ color: theme.primary, fontWeight: '700' }}>
                {step.label}
              </Label>
            </View>
          ))}
        </View>
      </View>

      {storageWarning ? <Notice tone="error">{storageWarning}</Notice> : null}

      {flows.map((entry) => (
        <FlowCard key={entry.title} entry={entry} />
      ))}

      <Button label="Consultar un QR" variant="secondary" onPress={() => router.push('/consultar')} />

      <View style={[styles.band, { backgroundColor: theme.warningSoft }]}>
        <Label variant="small" style={{ color: theme.warning, fontWeight: '700', textAlign: 'center' }}>
          Demostración · Datos locales
        </Label>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: Spacing.xs, paddingVertical: Spacing.md },
  card: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderWidth: 1, borderRadius: Radius.md, padding: Spacing.md, minHeight: 72 },
  icon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  trail: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: Spacing.sm },
  trailNarrow: { flexDirection: 'column', alignItems: 'flex-start', alignSelf: 'center', gap: 2 },
  trailItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  band: { borderRadius: Radius.sm, paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md },
});
