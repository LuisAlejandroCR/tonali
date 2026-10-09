// consultar.tsx: consumer entry without the package at hand; explains the QR and accepts a typed batch code.
// No account and no registration: the page only opens /lote/<code>.

import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { OriginIcon } from '@/components/origin-icons';
import { Button, Card, Field, Label, Screen } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { DEMO_BATCH_ID } from '@/domain/demo-data';
import { useTheme } from '@/hooks/use-theme';
import { useLedger } from '@/ledger/ledger-provider';
import { batchPath } from '@/ledger/links';

const BATCH_CODE = /^L-\d{4}-\d{3}$/;

export default function LookupScreen() {
  const theme = useTheme();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { state } = useLedger();

  function onLookup() {
    const value = code.trim().toUpperCase();
    if (!BATCH_CODE.test(value)) {
      setError(`Escribe el código como aparece junto al QR, por ejemplo ${DEMO_BATCH_ID}.`);
      return;
    }
    if (!state.batches.some((batch) => batch.id === value)) {
      setError('No encontramos ese lote en esta demostración. Revisa el código e inténtalo de nuevo.');
      return;
    }
    setError(null);
    router.push(batchPath(value));
  }

  return (
    <Screen>
      <Card>
        <View style={styles.center}>
          <View style={[styles.icon, { backgroundColor: theme.primarySoft }]}>
            <OriginIcon name="qr" color={theme.primary} size={32} />
          </View>
          <Label variant="heading" style={{ textAlign: 'center' }}>
            Escanea el QR del empaque
          </Label>
          {error ? null : (
            <Label variant="small" style={{ textAlign: 'center' }}>
              La cámara de tu teléfono abrirá directamente el origen del lote.
            </Label>
          )}
        </View>
      </Card>

      <Card>
        <Label style={{ fontWeight: '700' }}>¿Tienes el código del lote?</Label>
        <Field
          label="Código de lote"
          hint="Busca lotes de esta demo guardados en este dispositivo."
          error={error}
          value={code}
          onChangeText={(value) => {
            setCode(value);
            setError(null);
          }}
          autoCapitalize="characters"
          autoCorrect={false}
          placeholder={DEMO_BATCH_ID}
          onSubmitEditing={onLookup}
        />
        <Button label="Ver origen" onPress={onLookup} />
      </Card>

      <Label variant="small" style={{ textAlign: 'center' }}>
        Sin cuenta
      </Label>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm },
  icon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
});
