"use client"

import { Toaster as ToasterPrimitive, type ToasterProps } from "sonner"
import { useTheme } from "@/components/theme-provider"

const Toast = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  return (
    <ToasterPrimitive
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      toastOptions={{
        className:
          "*:data-icon:self-start font-sans has-data-description:*:data-icon:mt-1 *:data-icon:mt-0.5 backdrop-blur-2xl",
      }}
      style={
        {
          "--normal-bg": "var(--color-overlay)",
          "--normal-text": "var(--color-overlay-fg)",
          "--normal-border": "var(--color-border)",

          "--success-bg": "var(--color-success-subtle)",
          "--success-border": "color-mix(in oklab, var(--success-subtle-fg) 20%, transparent)",
          "--success-text": "var(--color-success-subtle-fg)",

          "--error-bg": "var(--color-danger-subtle)",
          "--error-border": "color-mix(in oklab, var(--danger-subtle-fg) 20%, transparent)",
          "--error-text": "var(--color-danger-subtle-fg)",

          "--warning-bg": "var(--color-warning-subtle)",
          "--warning-border": "color-mix(in oklab, var(--warning-subtle-fg) 20%, transparent)",
          "--warning-text": "var(--color-warning-subtle-fg)",

          "--info-bg": "var(--color-info-subtle)",
          "--info-border": "color-mix(in oklab, var(--info-subtle-fg) 20%, transparent)",
          "--info-text": "var(--color-info-subtle-fg)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export type { ToasterProps }
export { Toast }
