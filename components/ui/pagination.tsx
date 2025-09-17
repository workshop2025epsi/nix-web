"use client";

import { cn } from "@/lib/utils";
import {
    IconChevronLgLeft,
    IconChevronLgRight,
    IconChevronWallLeft,
    IconChevronWallRight,
    IconDotsHorizontal,
} from "@intentui/icons";
import type { ListBoxItemProps, ListBoxProps, ListBoxSectionProps } from "react-aria-components";
import { ListBox, ListBoxItem, ListBoxSection, Separator } from "react-aria-components";
import { type ButtonProps, buttonStyles } from "./button";

type PaginationProps = React.ComponentProps<"nav">;
const Pagination = ({ className, ref, ...props }: PaginationProps) => (
    <nav
        aria-label="pagination"
        ref={ref}
        className={cn("mx-auto flex w-full justify-center gap-1.5", className)}
        {...props}
    />
);

interface PaginationSectionProps<T> extends ListBoxSectionProps<T> {
    ref?: React.RefObject<HTMLElement>;
}
const PaginationSection = <T extends object>({
    className,
    ref,
    ...props
}: PaginationSectionProps<T>) => (
    <ListBoxSection ref={ref} {...props} className={cn("flex gap-1.5", className)} />
);

interface PaginationListProps<T> extends ListBoxProps<T> {
    ref?: React.RefObject<HTMLDivElement>;
}
const PaginationList = <T extends object>({ className, ref, ...props }: PaginationListProps<T>) => {
    return (
        <ListBox
            ref={ref}
            orientation="horizontal"
            aria-label={props["aria-label"] || "Pagination"}
            layout="grid"
            className={cn(className, "flex flex-row gap-1.5")}
            {...props}
        />
    );
};

const renderListItem = (
    props: ListBoxItemProps & {
        textValue?: string;
        "aria-current"?: string | undefined;
        isDisabled?: boolean;
        className?: string;
    },
    children: React.ReactNode,
) => <ListBoxItem {...props}>{children}</ListBoxItem>;

interface PaginationItemProps
    extends ListBoxItemProps,
        Pick<ButtonProps, "isCircle" | "size" | "intent"> {
    children?: React.ReactNode;
    className?: string;
    isCurrent?: boolean;
    segment?:
        | "label"
        | "separator"
        | "ellipsis"
        | "default"
        | "last"
        | "first"
        | "previous"
        | "next";
}

const PaginationItem = ({
    segment = "default",
    size = "sm",
    intent = "plain",
    className,
    isCurrent,
    children,
    ...props
}: PaginationItemProps) => {
    const textValue =
        typeof children === "string"
            ? children
            : typeof children === "number"
              ? children.toString()
              : undefined;

    const renderPaginationIndicator = (indicator: React.ReactNode) =>
        renderListItem(
            {
                textValue: segment,
                "aria-current": isCurrent ? "page" : undefined,
                isDisabled: isCurrent,
                className: buttonStyles({
                    intent: "outline",
                    className: cn("size-9 cursor-default font-normal text-fg", className),
                }),
                ...props,
            },
            indicator,
        );

    switch (segment) {
        case "label":
            return renderListItem(
                {
                    textValue: textValue,
                    className: cn("grid place-content-center px-3.5 tabular-nums", className),
                    ...props,
                },
                children,
            );
        case "separator":
            return renderListItem(
                {
                    textValue: "Separator",
                    className: cn("grid place-content-center", className),
                    ...props,
                },
                <Separator
                    orientation="vertical"
                    className="h-4 w-px shrink-0 rotate-[14deg] bg-border"
                />,
            );
        case "ellipsis":
            return renderListItem(
                {
                    textValue: "More pages",
                    className: cn("outline-hidden", className),
                    ...props,
                },
                <span
                    aria-hidden
                    className={cn("grid size-9 place-content-center px-2", className)}
                >
                    <IconDotsHorizontal />
                </span>,
            );
        case "previous":
            return renderPaginationIndicator(<IconChevronLgLeft />);
        case "next":
            return renderPaginationIndicator(<IconChevronLgRight />);
        case "first":
            return renderPaginationIndicator(<IconChevronWallLeft />);
        case "last":
            return renderPaginationIndicator(<IconChevronWallRight />);
        default:
            return renderListItem(
                {
                    textValue: textValue,
                    "aria-current": isCurrent ? "page" : undefined,
                    isDisabled: isCurrent,
                    className: buttonStyles({
                        intent: isCurrent ? "outline" : intent,
                        size,
                        className: cn(
                            "h-9 min-w-10 cursor-default font-normal tabular-nums disabled:opacity-100",
                            className,
                        ),
                    }),
                    ...props,
                },
                children,
            );
    }
};

Pagination.Item = PaginationItem;
Pagination.List = PaginationList;
Pagination.Section = PaginationSection;

export { Pagination, PaginationItem, PaginationList, PaginationSection };
export type { PaginationItemProps, PaginationListProps, PaginationProps, PaginationSectionProps };
