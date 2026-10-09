// ui.tsx: small set of themed building blocks shared by every screen (layout, text, buttons, fields, notices).
// Built on React Native primitives so the same code renders on Android, iOS and web.

import type { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type TextStyle,
} from 'react-native';

import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Screen({ children }: { children: ReactNode }) {
  const theme = useTheme();
  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.screen}
      keyboardShouldPersistTaps="handled">
      <View style={styles.column}>{children}</View>
    </ScrollView>
  );
}

type TextVariant = 'title' | 'heading' | 'body' | 'muted' | 'small' | 'mono';

export function Label({
  children,
  variant = 'body',
  style,
  role,
}: {
  children: ReactNode;
  variant?: TextVariant;
  style?: TextStyle;
  role?: 'header';
}) {
  const theme = useTheme();
  const color = variant === 'muted' || variant === 'small' ? theme.textMuted : theme.text;
  return (
    <Text accessibilityRole={role} style={[styles[variant], { color }, style]}>
      {children}
    </Text>
  );
}

export function Card({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'muted' | 'highlight' }) {
  const theme = useTheme();
  const backgroundColor = tone === 'muted' ? theme.surfaceMuted : tone === 'highlight' ? theme.primarySoft : theme.surface;
  return <View style={[styles.card, { backgroundColor, borderColor: theme.border }]}>{children}</View>;
}

type ButtonVariant = 'primary' | 'secondary' | 'danger';

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  hint,
}: {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  hint?: string;
}) {
  const theme = useTheme();
  const filled = variant === 'primary';
  const accent = variant === 'danger' ? theme.danger : theme.primary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={hint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: filled ? accent : 'transparent',
          borderColor: accent,
          opacity: disabled ? 0.45 : pressed ? 0.8 : 1,
        },
      ]}>
      <Text style={[styles.buttonLabel, { color: filled ? theme.onPrimary : accent }]}>{label}</Text>
    </Pressable>
  );
}

export function Field({
  label,
  hint,
  error,
  ...input
}: { label: string; hint?: string; error?: string | null } & TextInputProps) {
  const theme = useTheme();
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: theme.text }]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={hint}
        placeholderTextColor={theme.textMuted}
        style={[
          styles.input,
          {
            color: theme.text,
            backgroundColor: theme.surface,
            borderColor: error ? theme.danger : theme.border,
          },
        ]}
        {...input}
      />
      {error ? (
        <Text accessibilityRole="alert" style={[styles.small, { color: theme.danger }]}>
          {error}
        </Text>
      ) : hint ? (
        <Text style={[styles.small, { color: theme.textMuted }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

export function Choice({
  label,
  selected,
  onPress,
  role = 'radio',
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  role?: 'radio' | 'checkbox';
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole={role}
      accessibilityState={{ checked: selected }}
      aria-checked={selected}
      onPress={onPress}
      style={[
        styles.choice,
        {
          backgroundColor: selected ? theme.primary : theme.surface,
          borderColor: selected ? theme.primary : theme.border,
        },
      ]}>
      <Text style={[styles.choiceLabel, { color: selected ? theme.onPrimary : theme.text }]}>{label}</Text>
    </Pressable>
  );
}

export type Tone = 'info' | 'success' | 'warning' | 'error';

export function Notice({ tone = 'info', children }: { tone?: Tone; children: ReactNode }) {
  const theme = useTheme();
  const palette = {
    info: [theme.primarySoft, theme.text],
    success: [theme.successSoft, theme.success],
    warning: [theme.warningSoft, theme.warning],
    error: [theme.dangerSoft, theme.danger],
  }[tone];
  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole={tone === 'error' ? 'alert' : undefined}
      style={[styles.notice, { backgroundColor: palette[0] }]}>
      <Text style={[styles.body, { color: palette[1] }]}>{children}</Text>
    </View>
  );
}

export function Pill({ label, tone }: { label: string; tone: Tone }) {
  const theme = useTheme();
  const [backgroundColor, color] = {
    info: [theme.primarySoft, theme.primary],
    success: [theme.successSoft, theme.success],
    warning: [theme.warningSoft, theme.warning],
    error: [theme.dangerSoft, theme.danger],
  }[tone];
  return (
    <View style={[styles.pill, { backgroundColor }]}>
      <Text style={[styles.pillLabel, { color }]}>{label}</Text>
    </View>
  );
}

export function Row({ label, value }: { label: string; value: ReactNode }) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.small, styles.rowLabel, { color: theme.textMuted }]}>{label}</Text>
      <Text style={[styles.small, styles.rowValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Label variant="heading" role="header">
        {title}
      </Label>
      {children}
    </View>
  );
}

export const DEMO_TEXT = 'Demostración · Firmas simuladas; aún no publicadas en Stellar.';

export function DemoBand() {
  const theme = useTheme();
  return (
    <View style={[styles.band, { backgroundColor: theme.warningSoft }]}>
      <Text style={[styles.small, { color: theme.warning, fontWeight: '700' }]}>{DEMO_TEXT}</Text>
    </View>
  );
}

export function CheckRow({
  title,
  detail,
  checked,
  onPress,
}: {
  title: string;
  detail: string;
  checked: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      aria-checked={checked}
      accessibilityLabel={`${title}. ${detail}`}
      onPress={onPress}
      style={[
        styles.checkRow,
        { borderColor: checked ? theme.primary : theme.border, backgroundColor: checked ? theme.primarySoft : theme.surface },
      ]}>
      <View style={[styles.box, { borderColor: theme.primary, backgroundColor: checked ? theme.primary : 'transparent' }]}>
        {checked ? <Text style={{ color: theme.onPrimary, fontWeight: '800' }}>✓</Text> : null}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.body, { color: theme.text, fontWeight: '700' }]}>{title}</Text>
        <Text style={[styles.small, { color: theme.textMuted }]}>{detail}</Text>
      </View>
    </Pressable>
  );
}

export function RadioRow({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      aria-checked={selected}
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.radioRow, { borderColor: theme.border }]}>
      <View style={[styles.radio, { borderColor: theme.primary }]}>
        {selected ? <View style={[styles.radioDot, { backgroundColor: theme.primary }]} /> : null}
      </View>
      <Text style={[styles.body, { color: theme.text, fontWeight: selected ? '700' : '500' }]}>{label}</Text>
    </Pressable>
  );
}

export function TextAction({ label, onPress, tone = 'primary' }: { label: string; onPress: () => void; tone?: 'primary' | 'danger' }) {
  const theme = useTheme();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} hitSlop={8} style={{ minHeight: 44, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={[styles.body, { color: tone === 'danger' ? theme.danger : theme.primary, fontWeight: '700', textDecorationLine: 'underline' }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.xxl, flexGrow: 1 },
  column: { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center', gap: Spacing.md },
  title: { fontSize: 30, lineHeight: 36, fontWeight: '800' },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 23 },
  muted: { fontSize: 16, lineHeight: 23 },
  small: { fontSize: 14, lineHeight: 20 },
  mono: { fontSize: 13, lineHeight: 18, fontFamily: 'monospace' },
  card: { borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: Spacing.sm },
  button: {
    minHeight: 48,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: { fontSize: 16, fontWeight: '700' },
  field: { gap: Spacing.xs },
  fieldLabel: { fontSize: 15, fontWeight: '600' },
  input: { minHeight: 48, borderWidth: 1.5, borderRadius: Radius.sm, paddingHorizontal: Spacing.md, fontSize: 16 },
  choice: {
    minHeight: 44,
    borderWidth: 1.5,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  choiceLabel: { fontSize: 15, fontWeight: '600' },
  notice: { borderRadius: Radius.sm, padding: Spacing.md },
  pill: { alignSelf: 'flex-start', borderRadius: Radius.pill, paddingHorizontal: Spacing.md, paddingVertical: 3 },
  pillLabel: { fontSize: 13, fontWeight: '700' },
  row: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  rowLabel: { minWidth: 110 },
  rowValue: { flex: 1, flexBasis: 160, fontWeight: '600' },
  section: { gap: Spacing.sm },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, minHeight: 48, borderTopWidth: 1 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  band: { borderRadius: Radius.sm, paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderWidth: 1.5, borderRadius: Radius.sm, padding: Spacing.md, minHeight: 56 },
  box: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
