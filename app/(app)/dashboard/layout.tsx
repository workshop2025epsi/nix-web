import AppSidebar from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function AppLayout(props: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="w-full md:hidden justify-between flex px-2 py-2">
                    <SidebarTrigger />
                </div>
                {props.children}
            </SidebarInset>
        </SidebarProvider>
    );
}
