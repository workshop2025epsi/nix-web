"use client";

import { cn } from "@/lib/utils";
import type {
    TabListProps as TabListPrimitiveProps,
    TabPanelProps as TabPanelPrimitiveProps,
    TabProps as TabPrimitiveProps,
    TabsProps as TabsPrimitiveProps,
} from "react-aria-components";
import {
    composeRenderProps,
    TabList as TabListPrimitive,
    TabPanel as TabPanelPrimitive,
    Tab as TabPrimitive,
    Tabs as TabsPrimitive,
} from "react-aria-components";

interface TabsProps extends TabsPrimitiveProps {
    ref?: React.RefObject<HTMLDivElement>;
}
const Tabs = ({ className, ref, ...props }: TabsProps) => {
    return (
        <TabsPrimitive
            className={cn(
                "group/tabs flex orientation-vertical:w-full orientation-vertical:flex-row orientation-horizontal:flex-col gap-4 forced-color-adjust-none",
                className,
            )}
            ref={ref}
            {...props}
        />
    );
};

interface TabListProps<T extends object> extends TabListPrimitiveProps<T> {
    ref?: React.RefObject<HTMLDivElement>;
}
const TabList = <T extends object>({ className, ref, ...props }: TabListProps<T>) => {
    return (
        <TabListPrimitive
            ref={ref}
            {...props}
            className={composeRenderProps(className, (className, { orientation }) =>
                cn([
                    "flex forced-color-adjust-none",
                    orientation === "horizontal" && "flex-row gap-x-5 border-border border-b",
                    orientation === "vertical" && "flex-col items-start gap-y-4 border-l",
                    className,
                ]),
            )}
        />
    );
};

interface TabProps extends TabPrimitiveProps {
    ref?: React.RefObject<HTMLDivElement>;
}
const Tab = ({ children, className, ref, ...props }: TabProps) => {
    return (
        <TabPrimitive
            ref={ref}
            {...props}
            className={cn(
                "relative flex cursor-default items-center whitespace-nowrap rounded-full font-medium text-fg text-sm outline-hidden transition hover:text-fg *:data-[slot=icon]:mr-2 *:data-[slot=icon]:size-4",
                "group-orientation-vertical/tabs:w-full group-orientation-vertical/tabs:py-0 group-orientation-vertical/tabs:pr-2 group-orientation-vertical/tabs:pl-4",
                "group-orientation-horizontal/tabs:pb-3",
                "selected:text-fg text-muted-fg focus:ring-0",
                "disabled:opacity-50",
                "href" in props && "cursor-pointer",
                className,
            )}
        >
            {({ isSelected }) => (
                <>
                    {children}
                    {isSelected && (
                        <span
                            data-slot="selected-indicator"
                            className={cn(
                                "absolute rounded bg-fg",
                                "group-orientation-horizontal/tabs:-bottom-px group-orientation-horizontal/tabs:inset-x-0 group-orientation-horizontal/tabs:h-0.5 group-orientation-horizontal/tabs:w-full",
                                "group-orientation-vertical/tabs:left-0 group-orientation-vertical/tabs:h-[calc(100%-10%)] group-orientation-vertical/tabs:w-0.5 group-orientation-vertical/tabs:transform",
                            )}
                        />
                    )}
                </>
            )}
        </TabPrimitive>
    );
};

interface TabPanelProps extends TabPanelPrimitiveProps {
    ref?: React.RefObject<HTMLDivElement>;
}
const TabPanel = ({ className, ref, ...props }: TabPanelProps) => {
    return (
        <TabPanelPrimitive
            {...props}
            ref={ref}
            className={cn("flex-1 text-fg text-sm focus-visible:outline-hidden", className)}
        />
    );
};

export { Tab, TabList, TabPanel, Tabs };
export type { TabListProps, TabPanelProps, TabProps, TabsProps };
