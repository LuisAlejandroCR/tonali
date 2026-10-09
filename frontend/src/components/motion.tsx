// motion.tsx: short, optional motion for step flows: a lateral slide between steps and an animated check on success.
// Both collapse to an instant state change when the system asks for reduced motion.

import { useEffect, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (active) setReduce(value);
      })
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  return reduce;
}

export function StepSlide({ stepKey, direction, children }: { stepKey: string; direction: 1 | -1; children: ReactNode }) {
  const reduce = useReducedMotion();
  const [offset] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (reduce) {
      offset.setValue(0);
      return;
    }
    offset.setValue(24 * direction);
    Animated.timing(offset, { toValue: 0, duration: 180, useNativeDriver: true }).start();
  }, [stepKey, direction, reduce, offset]);
  return <Animated.View style={{ transform: [{ translateX: offset }], gap: Spacing.sm }}>{children}</Animated.View>;
}

export function AnimatedCheck() {
  const theme = useTheme();
  const reduce = useReducedMotion();
  const [scale] = useState(() => new Animated.Value(reduce ? 1 : 0.4));
  useEffect(() => {
    if (reduce) {
      scale.setValue(1);
      return;
    }
    Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }, [reduce, scale]);
  return (
    <View style={styles.center} aria-hidden>
      <Animated.View style={[styles.check, { backgroundColor: theme.success, transform: [{ scale }] }]}>
        <Text style={[styles.mark, { color: theme.surface }]}>✓</Text>
      </Animated.View>
    </View>
  );
}

export function StepCounter({ current, total, labels }: { current: number; total: number; labels?: string[] }) {
  const theme = useTheme();
  if (!labels) {
    return <Text style={[styles.counter, { color: theme.textMuted }]}>{`${current} de ${total}`}</Text>;
  }
  return (
    <View
      style={styles.labels}
      accessible
      accessibilityLabel={`Paso ${current} de ${total}: ${labels[current - 1]}. ${labels
        .map((label, index) => `${label} ${index + 1 < current ? 'hecho' : index + 1 === current ? 'actual' : 'pendiente'}`)
        .join(', ')}`}>
      {labels.map((label, index) => {
        const active = index + 1 === current;
        const done = index + 1 < current;
        return (
          <View key={label} style={styles.labelItem}>
            <View
              style={[
                styles.bullet,
                {
                  borderColor: active || done ? theme.primary : theme.border,
                  backgroundColor: done ? theme.primary : 'transparent',
                },
              ]}>
              <Text style={{ color: done ? theme.onPrimary : theme.primary, fontSize: 12, fontWeight: '800' }}>
                {done ? '✓' : active ? '●' : ''}
              </Text>
            </View>
            <Text style={{ color: active ? theme.text : theme.textMuted, fontWeight: active ? '700' : '500', fontSize: 14 }}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center' },
  check: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  mark: { fontSize: 30, fontWeight: '800', lineHeight: 34 },
  counter: { fontSize: 14, fontWeight: '700' },
  labels: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  labelItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  bullet: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
