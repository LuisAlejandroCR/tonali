// _layout.tsx: root navigator; wraps every screen in the origin-log provider and themed stack headers.

import { router, Stack } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useTheme } from '@/hooks/use-theme';
import { LedgerProvider } from '@/ledger/ledger-provider';

export default function RootLayout() {
  const theme = useTheme();
  return (
    <LedgerProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.surface },
          headerTintColor: theme.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: theme.background },
        }}>
        <Stack.Screen
          name="index"
          options={{
            title: 'TONALI',
            headerRight: () => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Ajustes"
                hitSlop={10}
                onPress={() => router.push('/ajustes')}
                style={{ paddingHorizontal: 12, minHeight: 44, justifyContent: 'center' }}>
                <Text style={{ fontSize: 22, color: theme.text }}>⚙</Text>
              </Pressable>
            ),
          }}
        />
        <Stack.Screen name="ajustes" options={{ title: 'Ajustes' }} />
        <Stack.Screen name="consultar" options={{ title: 'Origen de tu barra' }} />
        <Stack.Screen name="productor" options={{ title: 'Registrar entrega' }} />
        <Stack.Screen name="acopiador" options={{ title: 'Confirmar entregas' }} />
        <Stack.Screen name="marca" options={{ title: 'Panel de TONALI' }} />
        <Stack.Screen name="lote/[id]" options={{ title: 'Origen de tu barra' }} />
      </Stack>
    </LedgerProvider>
  );
}
