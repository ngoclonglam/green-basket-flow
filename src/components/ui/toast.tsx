import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

// Enhanced SVG Filter for Liquid Glass Effect
const LiquidGlassFilter = () => (
  <svg className="hidden">
    <defs>
      <filter
        id="liquid-glass-blur"
        x="-20%"
        y="-20%"
        width="140%"
        height="140%"
        filterUnits="objectBoundingBox"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.004 0.009"
          numOctaves="2"
          result="turbulence"
          seed="5"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="turbulence"
          scale="12"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displacement"
        />
        <feGaussianBlur
          in="displacement"
          stdDeviation="0.8"
        />
      </filter>
      <filter
        id="glass-glow"
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
      >
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
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
      "fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col p-4 md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-2xl p-6 pr-8 transition-all data-[swipe=cancel]:translate-y-0 data-[swipe=end]:translate-y-[var(--radix-toast-swipe-end-y)] data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "text-white",
        destructive: "text-white", 
        success: "text-white",
        info: "text-white",
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
        {/* Bend Layer - Liquid distortion backdrop */}
        <div 
          className="absolute inset-0 rounded-2xl backdrop-blur-xl z-0"
          style={{ 
            filter: 'url(#liquid-glass-blur)',
            background: variant === 'destructive' 
              ? `linear-gradient(135deg, 
                  hsla(var(--destructive), 0.85) 0%, 
                  hsla(var(--destructive), 0.7) 50%, 
                  hsla(var(--destructive), 0.9) 100%)`
              : variant === 'success'
              ? `linear-gradient(135deg, 
                  hsl(142 76% 36% / 0.85) 0%, 
                  hsl(142 65% 45% / 0.7) 50%, 
                  hsl(142 76% 36% / 0.9) 100%)`
              : variant === 'info'
              ? `linear-gradient(135deg, 
                  hsl(217 91% 60% / 0.85) 0%, 
                  hsl(217 81% 70% / 0.7) 50%, 
                  hsl(217 91% 60% / 0.9) 100%)`
              : `linear-gradient(135deg, 
                  hsla(var(--muted-foreground), 0.85) 0%, 
                  hsla(var(--muted-foreground), 0.7) 50%, 
                  hsla(var(--muted-foreground), 0.9) 100%)`
          }}
        />
        
        {/* Face Layer - Enhanced glow and depth */}
        <div 
          className="absolute inset-0 rounded-2xl z-10"
          style={{
            filter: 'url(#glass-glow)',
            background: variant === 'destructive'
              ? `radial-gradient(circle at 30% 20%, 
                  hsla(var(--destructive), 0.3) 0%, 
                  transparent 60%)`
              : variant === 'success'
              ? `radial-gradient(circle at 30% 20%, 
                  hsl(142 76% 50% / 0.3) 0%, 
                  transparent 60%)`
              : variant === 'info'
              ? `radial-gradient(circle at 30% 20%, 
                  hsl(217 91% 70% / 0.3) 0%, 
                  transparent 60%)`
              : `radial-gradient(circle at 30% 20%, 
                  hsla(var(--foreground), 0.2) 0%, 
                  transparent 60%)`,
            boxShadow: variant === 'destructive'
              ? `0 8px 32px -8px hsla(var(--destructive), 0.4),
                 0 0 0 1px hsla(var(--destructive), 0.15),
                 inset 0 1px 0 hsla(var(--destructive-foreground), 0.1)`
              : variant === 'success'
              ? `0 8px 32px -8px hsl(142 76% 36% / 0.4),
                 0 0 0 1px hsl(142 76% 36% / 0.15),
                 inset 0 1px 0 hsl(0 0% 100% / 0.1)`
              : variant === 'info'
              ? `0 8px 32px -8px hsl(217 91% 60% / 0.4),
                 0 0 0 1px hsl(217 91% 60% / 0.15),
                 inset 0 1px 0 hsl(0 0% 100% / 0.1)`
              : `0 8px 32px -8px hsla(var(--muted-foreground), 0.3),
                 0 0 0 1px hsla(var(--border), 0.5),
                 inset 0 1px 0 hsla(var(--foreground), 0.05)`
          }}
        />
        
        {/* Edge Layer - Refined glass highlights */}
        <div 
          className="absolute inset-0 rounded-2xl z-20 pointer-events-none"
          style={{
            background: `linear-gradient(145deg, 
              hsla(var(--background), 0.15) 0%, 
              transparent 25%, 
              transparent 75%, 
              hsla(var(--background), 0.1) 100%)`,
            boxShadow: `inset 0 1px 1px hsla(var(--background), 0.25),
                        inset 0 -1px 1px hsla(var(--background), 0.1)`,
            border: variant === 'destructive'
              ? `1px solid hsla(var(--destructive), 0.3)`
              : variant === 'success'
              ? `1px solid hsl(142 76% 36% / 0.3)`
              : variant === 'info'
              ? `1px solid hsl(217 91% 60% / 0.3)`
              : `1px solid hsla(var(--border), 0.4)`
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
