import { AppSidebar } from "@/components/ui/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/shdcn/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />

            <SidebarInset className="bg-zinc-50">
                <header className="flex h-10 items-center border-b border-zinc-200 bg-zinc-50 px-4">
                    <SidebarTrigger />
                </header>

                <main className="min-h-screen bg-zinc-50 p-8">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}