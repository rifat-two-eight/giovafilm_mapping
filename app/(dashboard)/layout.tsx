import { AppSidebar } from "@/components/dashboard/app-sidebar";
import DashTopHeader from "@/components/dashboard/dash-top-header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className=" bg-[#F5F6FA] h-screen">
      {/* bg-[#E2E8F0] */}
      <div className="flex w-full h-screen">
        <AppSidebar  />
        <div className="flex-1">
          <DashTopHeader />
          <div className="min-h-0  p-8 overflow-auto bg-[#F5F6FA]">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
