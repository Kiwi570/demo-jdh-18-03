/**
 * SectionTransition — dégradé entre deux sections
 * Usage : <SectionTransition from="#1E1008" to="#F5F0E8" height={80} />
 */
interface Props {
  from: string;
  to: string;
  height?: number;
}

export function SectionTransition({ from, to, height = 64 }: Props) {
  return (
    <div
      className="w-full pointer-events-none shrink-0"
      style={{
        height: `${height}px`,
        background: `linear-gradient(to bottom, ${from}, ${to})`,
      }}
    />
  );
}
