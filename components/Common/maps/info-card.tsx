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
    <div className="border rounded-xl p-4 bg-white min-h-[96px]">
      <div className="flex items-center gap-2 text-orange-500 mb-2">{icon}</div>

      <p className="text-xs text-muted-foreground font-bold font-public-sans tracking-wide">
        {label}
      </p>

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
