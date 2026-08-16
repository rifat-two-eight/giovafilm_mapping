type InfoProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
  empty?: boolean;
};

export default function InfoCard({
  icon,
  label,
  value,
  highlight,
  empty,
}: InfoProps) {
  return (
    <div className="border rounded-xl p-2.5 md:p-3 bg-white">
      <div className="flex flex-nowrap items-center gap-1.5 text-orange-500 mb-1">
        <span className="shrink-0">{icon}</span>
        <p className="min-w-0 text-[11px] md:text-xs text-muted-foreground font-bold font-public-sans tracking-wide leading-none">
          {label}
        </p>
      </div>

      <p
        className={`font-public-sans mt-0.5 text-sm leading-snug ${
          empty
            ? "text-gray-400 font-medium italic"
            : highlight
              ? "text-orange-500 font-bold"
              : "text-gray-900 font-bold"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
