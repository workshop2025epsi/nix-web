"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

import { cn } from "@/lib/utils";
import { IconCalendarDays } from "@intentui/icons";
import type { DateDuration } from "@internationalized/date";
import {
    DatePicker as DatePickerPrimitive,
    type DatePickerProps as DatePickerPrimitiveProps,
    type DateValue,
    type PopoverProps,
    type ValidationResult,
} from "react-aria-components";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { DateInput } from "./date-field";
import { Description, FieldError, FieldGroup, type FieldProps, Label } from "./field";
import { Modal } from "./modal";
import { PopoverContent } from "./popover";
import { RangeCalendar } from "./range-calendar";

interface DatePickerOverlayProps extends Omit<PopoverProps, "children"> {
    range?: boolean;
    visibleDuration?: DateDuration;
    pageBehavior?: "visible" | "single";
}

const DatePickerOverlay = ({
    visibleDuration = { months: 1 },
    pageBehavior = "visible",
    range,
    ...props
}: DatePickerOverlayProps) => {
    const isMobile = useMediaQuery("(max-width: 767px)") ?? false;
    return isMobile ? (
        <Modal.Content aria-label="Date picker" closeButton={false}>
            <div className="flex justify-center p-6">
                {range ? (
                    <RangeCalendar pageBehavior={pageBehavior} visibleDuration={visibleDuration} />
                ) : (
                    <Calendar />
                )}
            </div>
        </Modal.Content>
    ) : (
        <PopoverContent
            showArrow={false}
            className={cn(
                "flex min-w-auto max-w-none snap-x justify-center p-4 sm:min-w-[16.5rem] sm:p-2 sm:pt-3",
                visibleDuration?.months === 1 ? "sm:max-w-2xs" : "sm:max-w-none",
            )}
            {...props}
        >
            {range ? (
                <RangeCalendar pageBehavior={pageBehavior} visibleDuration={visibleDuration} />
            ) : (
                <Calendar />
            )}
        </PopoverContent>
    );
};

const DatePickerIcon = () => (
    <Button
        size="sq-sm"
        intent="plain"
        className="size-7 shrink-0 rounded pressed:bg-transparent outline-hidden outline-offset-0 hover:bg-transparent focus-visible:text-fg focus-visible:ring-0 group-open:text-fg **:data-[slot=icon]:text-muted-fg group-open:*:data-[slot=icon]:text-fg"
    >
        <IconCalendarDays />
    </Button>
);

interface DatePickerProps<T extends DateValue>
    extends DatePickerPrimitiveProps<T>,
        Pick<DatePickerOverlayProps, "placement">,
        Omit<FieldProps, "placeholder"> {}

const DatePicker = <T extends DateValue>({
    label,
    className,
    description,
    errorMessage,
    placement,
    ...props
}: DatePickerProps<T>) => {
    return (
        <DatePickerPrimitive
            {...props}
            className={cn("group flex flex-col gap-y-1 *:data-[slot=label]:font-medium", className)}
        >
            {label && <Label>{label}</Label>}
            <FieldGroup className="min-w-40 *:[button]:last:mr-1.5 sm:*:[button]:last:mr-0.5">
                <DateInput className="w-full" />
                <DatePickerIcon />
            </FieldGroup>
            {description && <Description>{description}</Description>}
            <FieldError>{errorMessage}</FieldError>
            <DatePickerOverlay placement={placement} />
        </DatePickerPrimitive>
    );
};
export { DatePicker, DatePickerIcon, DatePickerOverlay };
export type { DatePickerProps, DateValue, ValidationResult };
