// origin-icons.tsx: small decorative SVG icons for the batch origin journey (field, collection, batch, trust).
// Hidden from screen readers; every icon sits next to text that carries the meaning.

import { View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

type IconName = 'sprout' | 'box' | 'tag' | 'pen' | 'lock' | 'eye-off' | 'pin' | 'grain' | 'calendar' | 'camera' | 'qr';

export function OriginIcon({ name, color, size = 28 }: { name: IconName; color: string; size?: number }) {
  const stroke = { stroke: color, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  return (
    <View aria-hidden>
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'sprout' ? (
        <>
          <Path d="M12 21v-9" {...stroke} />
          <Path d="M12 12c0-4 3-6 7-6 0 4-3 6-7 6Z" {...stroke} />
          <Path d="M12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5Z" {...stroke} />
          <Path d="M7 21h10" {...stroke} />
        </>
      ) : null}
      {name === 'box' ? (
        <>
          <Path d="M3 8l9-4 9 4-9 4-9-4Z" {...stroke} />
          <Path d="M3 8v8l9 4 9-4V8" {...stroke} />
          <Path d="M12 12v8" {...stroke} />
        </>
      ) : null}
      {name === 'tag' ? (
        <>
          <Path d="M3 12V4h8l10 10-8 8L3 12Z" {...stroke} />
          <Circle cx="7.5" cy="8.5" r="1.5" {...stroke} />
        </>
      ) : null}
      {name === 'calendar' ? (
        <>
          <Rect x="4" y="5" width="16" height="15" rx="2" {...stroke} />
          <Path d="M4 10h16M9 3v4M15 3v4" {...stroke} />
        </>
      ) : null}
      {name === 'camera' ? (
        <>
          <Path d="M4 8h3l2-3h6l2 3h3v11H4V8Z" {...stroke} />
          <Circle cx="12" cy="13" r="3.5" {...stroke} />
        </>
      ) : null}
      {name === 'qr' ? (
        <>
          <Rect x="4" y="4" width="6" height="6" rx="1" {...stroke} />
          <Rect x="14" y="4" width="6" height="6" rx="1" {...stroke} />
          <Rect x="4" y="14" width="6" height="6" rx="1" {...stroke} />
          <Path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" {...stroke} />
        </>
      ) : null}
      {name === 'pen' ? <Path d="M4 20l4-1 11-11-3-3L5 16l-1 4ZM14 7l3 3" {...stroke} /> : null}
      {name === 'lock' ? (
        <>
          <Rect x="5" y="11" width="14" height="9" rx="2" {...stroke} />
          <Path d="M8 11V8a4 4 0 0 1 8 0v3" {...stroke} />
        </>
      ) : null}
      {name === 'eye-off' ? (
        <>
          <Path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" {...stroke} />
          <Path d="M4 4l16 16" {...stroke} />
        </>
      ) : null}
      {name === 'pin' ? (
        <>
          <Path d="M12 21s-6-6-6-11a6 6 0 0 1 12 0c0 5-6 11-6 11Z" {...stroke} />
          <Circle cx="12" cy="10" r="2" {...stroke} />
        </>
      ) : null}
      {name === 'grain' ? (
        <>
          <Path d="M12 21V8" {...stroke} />
          <Path d="M12 8c-2-1-3-3-3-5 2 1 3 3 3 5ZM12 8c2-1 3-3 3-5-2 1-3 3-3 5Z" {...stroke} />
          <Path d="M12 13c-2-1-4-1-5-3 2 0 4 1 5 3ZM12 13c2-1 4-1 5-3-2 0-4 1-5 3Z" {...stroke} />
          <Path d="M12 18c-2-1-4-1-5-3 2 0 4 1 5 3ZM12 18c2-1 4-1 5-3-2 0-4 1-5 3Z" {...stroke} />
        </>
      ) : null}
    </Svg>
    </View>
  );
}
