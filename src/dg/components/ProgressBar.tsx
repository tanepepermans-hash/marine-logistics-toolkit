interface ProgressBarProps {
  value: number; // 0-100
  colorClass?: string; // tailwind bg-* class for the fill
  trackClassName?: string;
  className?: string;
  height?: number;
}

export default function ProgressBar({
  value,
  colorClass = "bg-hazard-orange",
  trackClassName = "bg-white/10",
  className = "",
  height = 8,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`w-full overflow-hidden rounded-full ${trackClassName} ${className}`}
      style={{ height }}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full ${colorClass} transition-all duration-500 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
