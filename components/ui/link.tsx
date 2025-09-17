"use client";

import { cn } from "@/lib/utils";
import { Link as LinkPrimitive, type LinkProps as LinkPrimitiveProps } from "react-aria-components";

interface LinkProps extends LinkPrimitiveProps {
    intent?: "primary" | "secondary" | "unstyled";
    ref?: React.RefObject<HTMLAnchorElement>;
}

const Link = ({ className, ref, intent = "unstyled", ...props }: LinkProps) => {
    return (
        <LinkPrimitive
            ref={ref}
            {...props}
            className={cn(
                className,
                cn([
                    "disabled:cursor-default disabled:opacity-60 forced-colors:disabled:text-[GrayText]",
                    intent === "unstyled" && "text-current",
                    intent === "primary" && "text-primary hover:text-primary/80",
                    intent === "secondary" && "text-muted-fg hover:text-fg",
                ]),
            )}
        >
            {(values) => (
                <>
                    {typeof props.children === "function" ? props.children(values) : props.children}
                </>
            )}
        </LinkPrimitive>
    );
};

export { Link };
export type { LinkProps };
