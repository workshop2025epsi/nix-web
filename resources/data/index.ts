import {
    CassetteTape,
    FileText,
    Home,
    Router,
    Settings
} from "lucide-react";

export const sidebarMenus = {
    base: [
        {
            icon: Home,
            title: "Accueil",
            link: "/dashboard",
        },
        {
            icon: Router,
            title: "Agents",
            link: "/dashboard/agents",
        },
        {
            icon: CassetteTape,
            title: "Enregistrements",
            link: "/dashboard/records",
        },
        {
            icon: FileText,
            title: "Retranscriptions",
            link: "/dashboard/transcripts",
        },
    ],
    account: [
        {
            icon: Settings,
            title: "Réglages",
            link: "/dashboard/account/settings",
        },
    ],
};
