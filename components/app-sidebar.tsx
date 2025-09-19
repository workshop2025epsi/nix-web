"use client";

import { Link } from "@/components/ui/link";
import Image from "next/image"; // Correction de l'importation d'Image

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarItem,
    SidebarLabel,
    SidebarRail,
    SidebarSection,
    SidebarSectionGroup,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth/auth.client";
import { sidebarMenus } from "@/resources/data";
import UserMenu from "./user-menu";

import { useTheme } from "next-themes"; // Importation de useTheme
import { usePathname } from "next/navigation";

export default function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const { data: session, isPending } = authClient.useSession();
    const pathname = usePathname();
    const { resolvedTheme } = useTheme(); // Utilisation de useTheme pour obtenir le thème actuel

    // Choisir le logo en fonction du thème
    const logoSrc = resolvedTheme === "dark" ? "/logo/logo-white.svg" : "/logo/logo-black.svg";

    return (
        <Sidebar {...props}>
            <SidebarHeader className="p-0 mt-4">
                <Link href="/docs/components/layouts/sidebar" className="flex items-center gap-x-2">
                    <SidebarLabel className="font-medium">
                        <Image
                            src={logoSrc} // Utilisation de la source du logo en fonction du thème
                            alt="Logo"
                            width={120}
                            height={6}
                            className="mx-auto flex w-full h-12"
                        />{" "}
                        {/* Ajout des attributs alt, width et height */}
                    </SidebarLabel>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarSectionGroup>
                    <SidebarSection>
                        {sidebarMenus.base.map((item) => (
                            <SidebarItem
                                isCurrent={item.link === pathname}
                                key={item.title}
                                tooltip={item.title}
                                href={item.link}
                            >
                                <item.icon data-slot="icon" />
                                <SidebarLabel>{item.title}</SidebarLabel>
                            </SidebarItem>
                        ))}
                    </SidebarSection>
                </SidebarSectionGroup>
            </SidebarContent>
            <SidebarFooter className="flex flex-row justify-between gap-4 group-data-[state=collapsed]:flex-col">
                {!isPending && session?.user ? <UserMenu user={session.user} /> : <UserMenu />}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
