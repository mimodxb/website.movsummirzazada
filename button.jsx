import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[4px] text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0A995] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1612] disabled:pointer-events-none disabled:opacity-50 uppercase tracking-[0.05em]",
  {
    variants: {
      variant: {
        default: "border border-[#E0A995] text-[#EBE8E3] bg-transparent hover:bg-[#E0A995] hover:text-[#0A1612]",
        destructive: "bg-red-500 text-white hover:bg-red-600 border border-red-500",
        outline: "border border-[#E0A995]/50 text-[#EBE8E3] bg-[#13251E] hover:bg-[#E0A995] hover:text-[#0A1612] hover:border-[#E0A995]",
        secondary: "bg-[#E0A995]/10 text-[#E0A995] hover:bg-[#E0A995] hover:text-[#0A1612]",
        ghost: "hover:bg-[#E0A995]/10 hover:text-[#E0A995] border border-transparent",
        link: "text-[#E0A995] underline-offset-4 hover:underline border-none bg-transparent",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-14 px-8 py-4 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }