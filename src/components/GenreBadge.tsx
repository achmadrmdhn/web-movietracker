interface GenreBadgeProps {
  name: string;
}

export default function GenreBadge({ name }: GenreBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-bg-elevated px-2.5 py-0.5 text-xs font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary">
      {name}
    </span>
  );
}
