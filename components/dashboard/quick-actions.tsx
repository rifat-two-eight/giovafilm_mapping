import { Card } from "../ui/card";

interface QuickAction {
  label: string;
  href: string;
}

const actions: QuickAction[] = [
  { label: "Create a new map", href: "#" },
  { label: "Add a place", href: "#" },
  { label: "Publish updates", href: "#" },
  { label: "Download monthly report", href: "#" },
];

export function QuickActions() {
  return (
    <Card className="bg-white gap-3 p-6 rounded-xl border-0 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
      <div className="space-y-2">
        {actions.map((action) => (
          <a
            key={action.label}
            href={action.href}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm block transition-colors"
          >
            {action.label}
          </a>
        ))}
      </div>
    </Card>
  );
}
