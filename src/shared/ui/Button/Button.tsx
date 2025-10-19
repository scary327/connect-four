import React from "react";
import { Link } from "react-router-dom";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary";
type Size = "small" | "normal" | "large" | "extraLarge";

interface BaseProps {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  ariaLabel?: string;
  onClick?: (e: React.MouseEvent) => void;
}

type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
    to?: undefined;
    as?: "button";
  };

type ButtonAsAnchor = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    as?: "a";
  };

type ButtonAsLink = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    to: string;
    href?: undefined;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor | ButtonAsLink;

const sizeClass = (size: Size | undefined) => {
  switch (size) {
    case "small":
      return styles.small;
    case "large":
      return styles.large;
    case "extraLarge":
      return styles.extraLarge;
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

  // Render as react-router Link when `to` provided
  const maybeLink = rest as Partial<ButtonAsLink>;
  if (typeof maybeLink.to === "string") {
    const { to, ...linkRest } = rest as ButtonAsLink;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        to={to}
        className={classes}
        aria-label={ariaLabel}
        onClick={disabled ? (e) => e.preventDefault() : onClick}
        {...(linkRest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

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
