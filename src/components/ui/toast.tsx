import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

// SVG Filter for Liquid Glass Effect
const LiquidGlassFilter = () => (
  <svg className="hidden">
    <defs>
      <filter
        id="liquid-glass-blur"
        x="0"
        y="0"
        width="100%"
        height="100%"
        filterUnits="objectBoundingBox"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.003 0.007"
          numOctaves="1"
          result="turbulence"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="turbulence"
          scale="8"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  </svg>
)

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-4 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-4 sm:right-4 sm:left-auto sm:w-auto sm:max-w-sm md:max-w-md space-y-2 sm:space-y-3",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-3 overflow-hidden rounded-2xl backdrop-blur-xl bg-black/70 dark:bg-black/80 border border-white/10 p-4 pr-12 shadow-2xl transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full max-w-sm sm:max-w-md",
  {
    variants: {
      variant: {
        default: "bg-black/70 dark:bg-black/80 text-white border-white/10",
        destructive: "bg-red-900/80 dark:bg-red-950/90 border-red-500/20 text-red-50",
        success: "bg-green-900/80 dark:bg-green-950/90 border-green-500/20 text-green-50",
        info: "bg-blue-900/80 dark:bg-blue-950/90 border-blue-500/20 text-blue-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <>
      <LiquidGlassFilter />
      <ToastPrimitives.Root
        ref={ref}
        className={cn("relative", className)}
        {...props}
      >
        {/* Bend Layer - Backdrop blur with distortion */}
        <div 
          className="absolute inset-0 backdrop-blur-xl rounded-2xl z-0" 
          style={{ 
            filter: 'url(#liquid-glass-blur)',
            background: variant === 'destructive' 
              ? 'rgba(127, 29, 29, 0.8)' 
              : variant === 'success'
              ? 'rgba(20, 83, 45, 0.8)'
              : variant === 'info'
              ? 'rgba(30, 58, 138, 0.8)'
              : 'rgba(0, 0, 0, 0.7)'
          }} 
        />
        
        {/* Face Layer - Main glow effect */}
        <div 
          className="absolute inset-0 rounded-2xl z-10"
          style={{
            boxShadow: variant === 'destructive'
              ? '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 24px rgba(239, 68, 68, 0.15)'
              : variant === 'success'
              ? '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 24px rgba(34, 197, 94, 0.15)'
              : variant === 'info'
              ? '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 24px rgba(59, 130, 246, 0.15)'
              : '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 24px rgba(255, 255, 255, 0.1)'
          }}
        />
        
        {/* Edge Layer - Inner highlights */}
        <div 
          className="absolute inset-0 rounded-2xl z-20"
          style={{
            boxShadow: variant === 'destructive'
              ? 'inset 2px 2px 2px 0 rgba(255, 255, 255, 0.2), inset -2px -2px 2px 0 rgba(255, 255, 255, 0.2)'
              : variant === 'success'
              ? 'inset 2px 2px 2px 0 rgba(255, 255, 255, 0.2), inset -2px -2px 2px 0 rgba(255, 255, 255, 0.2)'
              : variant === 'info'
              ? 'inset 2px 2px 2px 0 rgba(255, 255, 255, 0.2), inset -2px -2px 2px 0 rgba(255, 255, 255, 0.2)'
              : 'inset 3px 3px 3px 0 rgba(255, 255, 255, 0.35), inset -3px -3px 3px 0 rgba(255, 255, 255, 0.35)',
            border: variant === 'destructive'
              ? '1px solid rgba(239, 68, 68, 0.2)'
              : variant === 'success'
              ? '1px solid rgba(34, 197, 94, 0.2)'
              : variant === 'info'
              ? '1px solid rgba(59, 130, 246, 0.2)'
              : '1px solid rgba(255, 255, 255, 0.1)'
          }}
        />
        
        {/* Content */}
        <div className={cn(
          toastVariants({ variant }), 
          "relative z-30 bg-transparent border-transparent shadow-none"
        )}>
          {props.children}
        </div>
      </ToastPrimitives.Root>
    </>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-3 top-3 rounded-full p-1 text-white/60 opacity-0 transition-all hover:text-white hover:bg-white/10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/20 group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-3 w-3" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold text-white", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-xs text-white/80", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
