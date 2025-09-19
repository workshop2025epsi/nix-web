"use client"

import type {
  DialogTriggerProps,
  PopoverProps as PopoverPrimitiveProps,
} from "react-aria-components"
import {
  DialogTrigger as DialogTriggerPrimitive,
  OverlayArrow,
  Popover as PopoverPrimitive,
} from "react-aria-components"
import { composeTailwindRenderProps } from "@/lib/primitive"
import {
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

type PopoverProps = DialogTriggerProps
const Popover = (props: PopoverProps) => {
  return <DialogTriggerPrimitive {...props} />
}

const PopoverTitle = DialogTitle
const PopoverHeader = DialogHeader
const PopoverBody = DialogBody
const PopoverFooter = DialogFooter

interface PopoverContentProps extends PopoverPrimitiveProps {
  showArrow?: boolean
  ref?: React.Ref<HTMLDivElement>
}

const PopoverContent = ({
  children,
  showArrow = false,
  className,
  ref,
  ...props
}: PopoverContentProps) => {
  const offset = props.offset ?? (showArrow ? 12 : 8)
  return (
    <PopoverPrimitive
      ref={ref}
      offset={offset}
      className={composeTailwindRenderProps(className, [
        "group/popover min-w-(--trigger-width) max-w-xs origin-(--trigger-anchor-point) rounded-xl border bg-overlay text-overlay-fg shadow-xs outline-hidden transition-transform [--gutter:--spacing(6)] sm:text-sm dark:backdrop-saturate-200 **:[[role=dialog]]:[--gutter:--spacing(4)]",
        "entering:fade-in entering:animate-in",
        "exiting:fade-out exiting:animate-out",
        "placement-left:entering:slide-in-from-right-1 placement-right:entering:slide-in-from-left-1 placement-top:entering:slide-in-from-bottom-1 placement-bottom:entering:slide-in-from-top-1",
        "placement-left:exiting:slide-out-to-right-1 placement-right:exiting:slide-out-to-left-1 placement-top:exiting:slide-out-to-bottom-1 placement-bottom:exiting:slide-out-to-top-1",
        "forced-colors:bg-[Canvas]",
      ])}
      {...props}
    >
      {(values) => (
        <>
          {showArrow && (
            <OverlayArrow className="group">
              <svg
                width={12}
                height={12}
                viewBox="0 0 12 12"
                className="group-placement-left:-rotate-90 block fill-overlay stroke-border group-placement-bottom:rotate-180 group-placement-right:rotate-90 forced-colors:fill-[Canvas] forced-colors:stroke-[ButtonBorder]"
              >
                <path d="M0 0 L6 6 L12 0" />
              </svg>
            </OverlayArrow>
          )}
          {typeof children === "function" ? children(values) : children}
        </>
      )}
    </PopoverPrimitive>
  )
}

const PopoverTrigger = DialogTrigger
const PopoverClose = DialogClose
const PopoverDescription = DialogDescription

Popover.Trigger = PopoverTrigger
Popover.Close = PopoverClose
Popover.Description = PopoverDescription
Popover.Content = PopoverContent
Popover.Body = PopoverBody
Popover.Footer = PopoverFooter
Popover.Header = PopoverHeader
Popover.Title = PopoverTitle

export type { PopoverProps, PopoverContentProps }
export {
  Popover,
  PopoverTrigger,
  PopoverClose,
  PopoverDescription,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
}
