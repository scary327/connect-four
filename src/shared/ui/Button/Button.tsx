import React from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary";
type Size = "small" | "normal" | "large";

interface BaseProps {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  ariaLabel?: string;
  onClick?: (e: React.MouseEvent) => void;
}

// Props for rendering as a native button
type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
    to?: undefined;
    as?: "button";
  };

// Props for rendering as an anchor
type ButtonAsAnchor = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    as?: "a";
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const sizeClass = (size: Size | undefined) => {
  switch (size) {
    case "small":
      return styles.small;
    case "large":
      return styles.large;
    default:
      return "";
  }
};

const Button = React.forwardRef<HTMLElement, ButtonProps>((props, ref) => {
  const {
    children,
    className = "",
    variant = "primary",
    size = "normal",
    disabled = false,
    ariaLabel,
    onClick,
    ...rest
  } = props as ButtonProps & { as?: string };

  const classes = [
    styles.button,
    variant === "primary" ? styles.primary : styles.secondary,
    sizeClass(size),
    disabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Render as anchor when href provided (type guard)
  const maybeAnchor = rest as Partial<ButtonAsAnchor>;
  if (typeof maybeAnchor.href === "string") {
    const { href, target, rel, ...anchorRest } = rest as ButtonAsAnchor;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        onClick={disabled ? (e) => e.preventDefault() : onClick}
        {...anchorRest}
      >
        {children}
      </a>
    );
  }

  // Default: native button
  const buttonRest = rest as ButtonAsButton;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={disabled ? undefined : onClick}
      type={buttonRest.type || "button"}
      {...buttonRest}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
