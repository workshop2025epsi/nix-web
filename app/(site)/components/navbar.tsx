"use client";
import { Link } from "@/components/ui/link";
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu";
import {
    Navbar,
    NavbarGap,
    NavbarItem,
    NavbarMobile,
    type NavbarProps,
    NavbarProvider,
    NavbarSection,
    NavbarSpacer,
    NavbarStart,
    NavbarTrigger,
} from "@/components/ui/navbar";

const categories = [
    {
        id: 1,
        label: "Entrées",
        url: "#",
    },
    {
        id: 2,
        label: "Plats Principaux",
        url: "#",
    },
    {
        id: 3,
        label: "Desserts",
        url: "#",
    },
    {
        id: 4,
        label: "Boissons",
        url: "#",
    },
    {
        id: 5,
        label: "Vins",
        url: "#",
    },
    {
        id: 6,
        label: "Cocktails",
        url: "#",
    },
    {
        id: 7,
        label: "Menus Enfants",
        url: "#",
    },
    {
        id: 8,
        label: "Végétarien",
        url: "#",
    },
    {
        id: 9,
        label: "Sans Gluten",
        url: "#",
    },
    {
        id: 10,
        label: "Spécialités du Chef",
        url: "#",
    },
];

export default function SiteNavbar(props: NavbarProps) {
    return (
        <NavbarProvider>
            <Navbar {...props}>
                <NavbarStart>
                    <Link
                        className="flex items-center gap-x-2 font-medium"
                        aria-label="Goto documentation of Navbar"
                        href="/docs/components/layouts/navbar"
                    >
                        <span>La bonne blanquette</span>
                    </Link>
                </NavbarStart>
                <NavbarGap />
                <NavbarSection>
                    <NavbarItem href="#">Menu</NavbarItem>
                    <NavbarItem href="#">Plats</NavbarItem>
                    <Menu>
                        <NavbarItem>Categories</NavbarItem>
                        <MenuContent
                            className="min-w-(--trigger-width) sm:min-w-56"
                            items={categories}
                        >
                            {(item) => (
                                <MenuItem id={item.id} textValue={item.label} href={item.url}>
                                    {item.label}
                                </MenuItem>
                            )}
                        </MenuContent>
                    </Menu>
                </NavbarSection>
                <NavbarSpacer />
            </Navbar>
            <NavbarMobile>
                <NavbarTrigger />
                <NavbarSpacer />
                <NavbarSection>
                    <NavbarItem href="#">Menu</NavbarItem>
                    <NavbarItem href="#">Plats</NavbarItem>
                    <Menu>
                        <NavbarItem>Categories</NavbarItem>
                        <MenuContent
                            className="min-w-(--trigger-width) sm:min-w-56"
                            items={categories}
                        >
                            {(item) => (
                                <MenuItem id={item.id} textValue={item.label} href={item.url}>
                                    {item.label}
                                </MenuItem>
                            )}
                        </MenuContent>
                    </Menu>
                </NavbarSection>
            </NavbarMobile>
        </NavbarProvider>
    );
}
