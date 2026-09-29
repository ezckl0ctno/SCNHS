import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 min-h-11 px-4",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-fg hover:bg-primary-dark",
        ink: "bg-ink text-paper hover:bg-ink/90",
        ghost: "bg-transparent text-ink hover:bg-leaf/40",
        outline: "bg-paper text-ink shadow-border hover:shadow-border-hover",
        gold: "bg-gold text-ink hover:bg-gold-dark hover:text-paper",
        danger: "bg-rose-soft text-rose hover:bg-rose-soft/80",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>
>(({ className, variant, type = "button", ...props }, ref) => (
  <button ref={ref} type={type} className={cn(buttonVariants({ variant }), className)} {...props} />
));
Button.displayName = "Button";
