import { Outlet, Link } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function AdminLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="w-full">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-foreground font-medium">Dashboard</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="ml-auto">
                        <ThemeToggle />
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto @container/main">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
