import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

async function delay(ms: number) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
}

const isValidUrl = (str: string) => {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
};

const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
const getInitials = (name: string) => {
    return (
        name
            ?.split(" ")
            ?.map((n) => n[0])
            ?.join("") ||
        name?.charAt(0) ||
        ""
    );
};


const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export {
    capitalize,
    cn,
    delay,
    formatDate,
    getInitials,
    isValidUrl
};

export * from "./colors";
export * from "./fonts";

