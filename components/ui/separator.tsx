"use client";

import { cn } from "@/lib/utils";
import { Separator as Divider, type SeparatorProps } from "react-aria-components";

const Separator = ({ orientation = "horizontal", className, ...props }: SeparatorProps) => {
    return (
        <Divider
            {...props}
            className={cn(
                "shrink-0 bg-border forced-colors:bg-[ButtonBorder]",
                orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
                className,
            )}
        />
    );
};

export { Separator };
export type { SeparatorProps };
