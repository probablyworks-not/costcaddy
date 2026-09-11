/**
 * Report-surface icon — Material Symbols Outlined ligature glyph. Report only;
 * never mix with App UI's inline stroked SVGs (see components/ui/Icon).
 */
export function MaterialIcon({
  name,
  size = 15,
  style,
}: {
  name: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        fontFamily: "var(--font-report-icons)",
        fontSize: size,
        lineHeight: 1,
        ...style,
      }}
    >
      {name}
    </span>
  );
}
