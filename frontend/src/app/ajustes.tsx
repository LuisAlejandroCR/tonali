// ajustes.tsx: settings that really exist in the demo: haptics on save and restoring the demo data.
// Restoring asks for confirmation because it erases the records made on this device.

import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { Button, Card, Choice, Label, Screen, Section } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLedger } from '@/ledger/ledger-provider';

export default function SettingsScreen() {
  const theme = useTheme();
  const { hapticsEnabled, setHapticsEnabled, resetDemo, state } = useLedger();
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  const counts = `${state.deliveries.length} ${state.deliveries.length === 1 ? 'entrega' : 'entregas'} · ${state.batches.length} ${state.batches.length === 1 ? 'lote' : 'lotes'}`;

  async function onReset() {
    await resetDemo();
    setConfirming(false);
    setDone(true);
  }

  return (
    <Screen>
      {Platform.OS === 'web' ? (
        <Section title="Hápticos">
          <Card>
            <Label>No disponibles en el navegador. Puedes probarlos en un celular con Expo Go.</Label>
          </Card>
        </Section>
      ) : (
        <Section title="Experiencia">
          <Card>
            <View style={styles.row}>
              <Label style={{ flex: 1, fontWeight: '700' }}>Hápticos al guardar</Label>
              <View accessibilityRole="radiogroup" style={styles.choices}>
                <Choice label="Sí" selected={hapticsEnabled} onPress={() => setHapticsEnabled(true)} />
                <Choice label="No" selected={!hapticsEnabled} onPress={() => setHapticsEnabled(false)} />
              </View>
            </View>
            <Label variant="small">Vibración breve al guardar correctamente.</Label>
          </Card>
        </Section>
      )}

      {done ? (
        <View accessibilityLiveRegion="polite" style={[styles.done, { backgroundColor: theme.successSoft, borderColor: theme.success }]}>
          <Label variant="heading" style={{ color: theme.success }}>
            ✓ Datos de demostración restaurados
          </Label>
          <Label variant="small" style={{ color: theme.success }}>
            Inicio, Productor, Acopiador y TONALI ya muestran los datos iniciales.
          </Label>
        </View>
      ) : null}

      <Section title="Datos de demostración">
        <Card>
          <Label style={{ fontWeight: '700' }}>{`Ahora: ${counts}`}</Label>
          {confirming ? (
            <View accessibilityRole="alert" style={[styles.dialog, { borderColor: theme.border, backgroundColor: theme.surfaceMuted }]}>
              <Label variant="heading">¿Restaurar los datos?</Label>
              <Label variant="small">Se reemplazarán los cambios de esta demostración por los datos iniciales.</Label>
              <View style={styles.choices}>
                <View style={{ flex: 1 }}>
                  <Button label="Cancelar" variant="secondary" onPress={() => setConfirming(false)} />
                </View>
                <View style={{ flex: 1 }}>
                  <Button label="Sí, restaurar" variant="danger" onPress={onReset} />
                </View>
              </View>
            </View>
          ) : (
            <Button
              label="Restaurar datos"
              variant="secondary"
              onPress={() => {
                setDone(false);
                setConfirming(true);
              }}
            />
          )}
        </Card>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexWrap: 'wrap' },
  choices: { flexDirection: 'row', gap: Spacing.sm },
  done: { borderWidth: 1.5, borderRadius: 12, padding: Spacing.md, gap: Spacing.xs },
  dialog: { borderWidth: 1, borderRadius: 12, padding: Spacing.md, gap: Spacing.sm },
});
