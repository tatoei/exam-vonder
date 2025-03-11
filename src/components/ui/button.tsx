import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";


const buttonVariants = cva(
  "inline-flex items-center gap-2 justify-center capitalize tracking-wide whitespace-nowrap rounded-xl font-extrabold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black border-slate-200 border-2 border-b-4 active:border-b-2 hover:bg-slate-100 text-slate-500",
        primary:
          "bg-[#C14600] text-white hover:bg-[#C14600]/90 border-[#BB5A00] border-b-4 active:border-b-0",
        "primary-outline":
          "bg-white border-[#C14600] border-2 active:border-b-2 border-b-4 text-[#C14600] hover:bg-[#C14600]/10",
        secondary:
          "bg-[#FF9D23]  text-white hover:bg-[#FF9D23]/90 border-yellow-600 border-b-4 active:border-b-0",
        "secondary-outline":
          "bg-white text-[#FF9D23] border-[#FF9D23] border-2 active:border-b-2 border-b-4 hover:border-yellow-600",
        danger:
          "bg-red-500 text-white hover:bg-red-500/90 border-red-600 border-b-4 active:border-b-0",
        "danger-outline":
          "bg-white text-red-500 border-2 border-red-500 active:border-b-2 border-b-4 hover:bg-red-100",
        warning:
          "bg-yellow-400 text-white hover:bg-yellow-400/90 border-yellow-600 border-b-4 active:border-b-0",
        "warning-outline":
          "bg-white text-yellow-400 border-yellow-500 border-2 active:border-b-2 border-b-4 hover:bg-yellow-100",
        success:
          "bg-green-500 text-white hover:bg-green-500/90 border-green-600 border-b-4 active:border-b-0",
        "success-outline":
          "bg-white text-green-500 border-green-500  border-2 active:border-b-2 border-b-4 hover:bg-green-100",
        ghost:
          "bg-transparent text-slate-500 border-transparent border-0 hover:bg-slate-100",
        line: "bg-green-500 text-white hover:bg-green-500/90 border-green-600 border-b-4 active:border-b-0",
        facebook:
          "bg-[#1877F2] text-white hover:bg-[#1877F2]/90 border-[#0B5fCC] border-b-4 active:border-b-0",
        black:
          "bg-[#262d3e] text-white hover:bg-[#262d3e]/90 border-[#262d3e] border-b-4 active:border-b-0",
      },
      size: {
        default: "h-10 px-3 text-sm",
        compact: "size-fit px-3",
        sm: "h-10 px-3",
        lg: "h-20 px-8",
        icon: "h-10 w-10",
        mega: "h-40 w-40",
        rounded: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: ReactNode;
  rightSection?: ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {props.icon}
        {props.children}
        {props.rightSection}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
