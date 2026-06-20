import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary" // burgundy — main website conversion
  | "dark" // charcoal — phone/support
  | "outline" // informational secondary
  | "whatsapp" // WhatsApp green only
  | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold " +
  "transition-colors duration-200 focus-visible:outline-none disabled:opacity-60 " +
  "disabled:pointer-events-none whitespace-nowrap select-none";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-burgundy-700 text-white hover:bg-burgundy-800 active:bg-burgundy-900",
  dark: "bg-charcoal-950 text-white hover:bg-charcoal-800",
  outline:
    "bg-white text-ink border border-line-strong hover:bg-cream-100",
  whatsapp: "bg-whatsapp text-white hover:bg-whatsapp-hover",
  ghost: "bg-transparent text-ink hover:bg-cream-100",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-[15px]",
  lg: "h-[52px] px-6 text-[15px]",
};

export interface ButtonClassOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

/** Class string for buttons — use on <button> or <Link>/<a>. */
export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: ButtonClassOptions = {}): string {
  return cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  Omit<ButtonClassOptions, "className">;

export function Button({
  variant,
  size,
  fullWidth,
  className,
  ...props
}: ButtonProps & { className?: string }) {
  return (
    <button
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    />
  );
}
