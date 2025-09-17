"use client";

import { cn } from "@/lib/utils";
import { IconSearch } from "@intentui/icons";
import { createContext, use, useEffect } from "react";
import type {
    AutocompleteProps,
    CollectionRenderer,
    MenuProps,
    MenuTriggerProps,
    SearchFieldProps,
} from "react-aria-components";
import {
    Autocomplete,
    Button,
    Collection,
    CollectionRendererContext,
    DefaultCollectionRenderer,
    Dialog,
    Header,
    Input,
    Menu as MenuPrimitive,
    MenuSection,
    Modal,
    ModalContext,
    ModalOverlay,
    OverlayTriggerStateContext,
    SearchField,
    useFilter,
} from "react-aria-components";
import { DropdownKeyboard } from "./dropdown";
import { Loader } from "./loader";
import { MenuDescription, MenuItem, MenuLabel, type MenuSectionProps, MenuSeparator } from "./menu";

interface CommandMenuProviderProps {
    isPending?: boolean;
    escapeButton?: boolean;
}

const CommandMenuContext = createContext<CommandMenuProviderProps | undefined>(undefined);

const useCommandMenu = () => {
    const context = use(CommandMenuContext);

    if (!context) {
        throw new Error("useCommandMenu must be used within a <CommandMenuProvider />");
    }

    return context;
};

const sizes = {
    xs: "sm:max-w-xs",
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    "3xl": "sm:max-w-3xl",
};

interface CommandMenuProps extends AutocompleteProps, MenuTriggerProps, CommandMenuProviderProps {
    isDismissable?: boolean;
    "aria-label"?: string;
    shortcut?: string;
    isBlurred?: boolean;
    className?: string;
    size?: keyof typeof sizes;
}

const CommandMenu = ({
    onOpenChange,
    className,
    isDismissable = true,
    escapeButton = true,
    isPending,
    size = "xl",
    isBlurred,
    shortcut,
    ...props
}: CommandMenuProps) => {
    const { contains } = useFilter({ sensitivity: "base" });
    const filter = (textValue: string, inputValue: string) => contains(textValue, inputValue);
    useEffect(() => {
        if (!shortcut) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === shortcut && (e.metaKey || e.ctrlKey)) {
                onOpenChange?.(true);
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [shortcut, onOpenChange]);
    return (
        <CommandMenuContext value={{ isPending: isPending, escapeButton: escapeButton }}>
            <ModalContext value={{ isOpen: props.isOpen, onOpenChange: onOpenChange }}>
                <ModalOverlay
                    isDismissable={isDismissable}
                    className={({ isExiting, isEntering }) =>
                        cn(
                            "fixed inset-0 z-50 h-(--visual-viewport-height,100vh) w-screen overflow-hidden bg-black/15",
                            "grid grid-rows-[1fr_auto] justify-items-center text-center sm:grid-rows-[1fr_auto_3fr]",
                            isEntering && "fade-in animate-in duration-300",
                            isExiting && "fade-out animate-out duration-200",
                            isBlurred && "backdrop-blur-sm",
                        )
                    }
                    {...props}
                >
                    <Modal
                        className={({ isExiting, isEntering }) =>
                            cn(
                                "row-start-2 bg-overlay text-left text-overlay-fg shadow-lg outline-none ring ring-muted-fg/15 md:row-start-1 dark:ring-border",
                                "sm:-translate-x-1/2 max-h-[calc(var(--visual-viewport-height)*0.8)] w-full sm:fixed sm:top-[10%] sm:left-1/2",
                                "rounded-t-2xl md:rounded-xl",
                                isEntering && [
                                    "slide-in-from-bottom animate-in duration-300 ease-out",
                                    "md:fade-in md:zoom-in-95 md:slide-in-from-bottom-0",
                                ],
                                isExiting && [
                                    "slide-out-to-bottom animate-out",
                                    "md:fade-out md:zoom-out-95 md:slide-out-to-bottom-0",
                                ],
                                sizes[size],
                                className,
                            )
                        }
                    >
                        <Dialog
                            aria-label={props["aria-label"] ?? "Command Menu"}
                            className="flex max-h-[inherit] flex-col overflow-hidden outline-hidden"
                        >
                            <Autocomplete filter={filter} {...props} />
                        </Dialog>
                    </Modal>
                </ModalOverlay>
            </ModalContext>
        </CommandMenuContext>
    );
};

interface CommandMenuSearchProps extends SearchFieldProps {
    placeholder?: string;
    className?: string;
}

const CommandMenuSearch = ({ className, placeholder, ...props }: CommandMenuSearchProps) => {
    const state = use(OverlayTriggerStateContext)!;
    const { isPending, escapeButton } = useCommandMenu();
    return (
        <SearchField
            aria-label="Quick search"
            autoFocus
            className={cn("flex w-full items-center border-b px-2.5 py-1", className)}
            {...props}
        >
            {isPending ? (
                <Loader className="size-4.5" variant="spin" />
            ) : (
                <IconSearch
                    data-slot="command-menu-search-icon"
                    className="size-5 shrink-0 text-muted-fg"
                />
            )}
            <Input
                placeholder={placeholder ?? "Search..."}
                className="w-full min-w-0 bg-transparent px-2.5 py-2 text-base text-fg placeholder-muted-fg outline-hidden focus:outline-hidden sm:px-2 sm:py-1.5 sm:text-sm [&::-ms-reveal]:hidden [&::-webkit-search-cancel-button]:hidden"
            />
            {escapeButton && (
                <Button
                    onPress={() => state?.close()}
                    className="hidden cursor-default rounded border text-current/90 hover:bg-muted lg:inline lg:px-1.5 lg:py-0.5 lg:text-xs"
                >
                    Esc
                </Button>
            )}
        </SearchField>
    );
};

const CommandMenuList = <T extends object>({ className, ...props }: MenuProps<T>) => {
    return (
        <CollectionRendererContext.Provider value={renderer}>
            <MenuPrimitive
                className={cn(
                    "grid max-h-full flex-1 grid-cols-[auto_1fr] content-start overflow-y-auto p-2 sm:max-h-110 *:[[role=group]]:mb-6 *:[[role=group]]:last:mb-0",
                    className,
                )}
                {...props}
            />
        </CollectionRendererContext.Provider>
    );
};

const CommandMenuSection = <T extends object>({
    className,
    ref,
    ...props
}: MenuSectionProps<T>) => {
    return (
        <MenuSection
            ref={ref}
            className={cn(
                "col-span-full grid grid-cols-[auto_1fr] content-start gap-y-[calc(var(--spacing)*0.25)]",
                className,
            )}
            {...props}
        >
            {"title" in props && (
                <Header className="col-span-full mb-1 block min-w-(--trigger-width) truncate px-2.5 text-muted-fg text-xs">
                    {props.title}
                </Header>
            )}
            <Collection items={props.items}>{props.children}</Collection>
        </MenuSection>
    );
};

const CommandMenuItem = ({ className, ...props }: React.ComponentProps<typeof MenuItem>) => {
    const textValue =
        props.textValue || (typeof props.children === "string" ? props.children : undefined);
    return (
        <MenuItem
            {...props}
            textValue={textValue}
            className={cn("items-center gap-y-0.5", className)}
        />
    );
};

interface CommandMenuDescriptionProps extends React.ComponentProps<typeof MenuDescription> {}

const CommandMenuDescription = ({ className, ...props }: CommandMenuDescriptionProps) => {
    return (
        <MenuDescription className={cn("col-start-3 row-start-1 ml-auto", className)} {...props} />
    );
};

const renderer: CollectionRenderer = {
    CollectionRoot(props) {
        if (props.collection.size === 0) {
            return (
                <div className="col-span-full p-4 text-center text-muted-fg text-sm">
                    No results found.
                </div>
            );
        }
        return <DefaultCollectionRenderer.CollectionRoot {...props} />;
    },
    CollectionBranch: DefaultCollectionRenderer.CollectionBranch,
};

const CommandMenuSeparator = ({
    className,
    ...props
}: React.ComponentProps<typeof MenuSeparator>) => (
    <MenuSeparator className={cn("-mx-2", className)} {...props} />
);

const CommandMenuFooter = ({ className, ...props }: React.ComponentProps<"div">) => {
    return (
        <div
            className={cn(
                "col-span-full flex-none border-t px-2 py-1.5 text-muted-fg text-sm",
                "*:[kbd]:inset-ring *:[kbd]:inset-ring-fg/10 *:[kbd]:mx-1 *:[kbd]:inline-grid *:[kbd]:h-4 *:[kbd]:min-w-4 *:[kbd]:place-content-center *:[kbd]:rounded-xs *:[kbd]:bg-secondary",
                className,
            )}
            {...props}
        />
    );
};

const CommandMenuLabel = MenuLabel;
const CommandMenuKeyboard = DropdownKeyboard;
CommandMenu.Search = CommandMenuSearch;
CommandMenu.List = CommandMenuList;
CommandMenu.Item = CommandMenuItem;
CommandMenu.Label = CommandMenuLabel;
CommandMenu.Section = CommandMenuSection;
CommandMenu.Description = CommandMenuDescription;
CommandMenu.Keyboard = CommandMenuKeyboard;
CommandMenu.Separator = CommandMenuSeparator;
CommandMenu.Footer = CommandMenuFooter;

export {
    CommandMenu,
    CommandMenuDescription,
    CommandMenuFooter,
    CommandMenuItem,
    CommandMenuKeyboard,
    CommandMenuLabel,
    CommandMenuList,
    CommandMenuSearch,
    CommandMenuSection,
    CommandMenuSeparator,
};
export type { CommandMenuDescriptionProps, CommandMenuProps, CommandMenuSearchProps };
