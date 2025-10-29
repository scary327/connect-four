import React, { memo, useState, useRef, useEffect } from "react";
import styles from "./Select.module.css";

export interface SelectOption<T = string> {
  value: T;
  label: string;
}

interface SelectProps<T = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

const Select = memo(
  <T extends string = string>({
    value,
    onChange,
    options,
    label,
    placeholder = "Select an option",
    disabled = false,
  }: SelectProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);
    const selectedLabel = selectedOption?.label || placeholder;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    useEffect(() => {
      if (isOpen && highlightedIndex >= 0 && listRef.current) {
        const highlightedElement = listRef.current.children[
          highlightedIndex
        ] as HTMLElement;
        highlightedElement?.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }, [highlightedIndex, isOpen]);

    const handleToggle = () => {
      if (!disabled) {
        setIsOpen((prev) => !prev);
        if (!isOpen) {
          const currentIndex = options.findIndex((opt) => opt.value === value);
          setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
        }
      }
    };

    const handleSelect = (optionValue: T) => {
      onChange(optionValue);
      setIsOpen(false);
      setHighlightedIndex(-1);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case "Enter":
        case " ":
          event.preventDefault();
          if (isOpen && highlightedIndex >= 0) {
            handleSelect(options[highlightedIndex].value);
          } else {
            setIsOpen(true);
            const currentIndex = options.findIndex(
              (opt) => opt.value === value
            );
            setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
          }
          break;
        case "Escape":
          event.preventDefault();
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
        case "ArrowDown":
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setHighlightedIndex(0);
          } else {
            setHighlightedIndex((prev) =>
              prev < options.length - 1 ? prev + 1 : prev
            );
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (isOpen) {
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          }
          break;
        case "Home":
          event.preventDefault();
          if (isOpen) {
            setHighlightedIndex(0);
          }
          break;
        case "End":
          event.preventDefault();
          if (isOpen) {
            setHighlightedIndex(options.length - 1);
          }
          break;
        default:
          break;
      }
    };

    return (
      <div className={styles.selectWrapper} ref={containerRef}>
        {label && <span className={styles.label}>{label}</span>}
        <div className={styles.selectContainer}>
          <button
            type="button"
            className={`${styles.selectButton} ${isOpen ? styles.open : ""} ${
              disabled ? styles.disabled : ""
            }`}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls="select-listbox"
            aria-labelledby={label ? "select-label" : undefined}
            disabled={disabled}
          >
            <span
              className={`${styles.selectedValue} ${
                !selectedOption ? styles.placeholder : ""
              }`}
            >
              {selectedLabel}
            </span>
            <span
              className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`}
              aria-hidden="true"
            >
              ▼
            </span>
          </button>

          {isOpen && (
            <ul
              ref={listRef}
              id="select-listbox"
              className={styles.optionsList}
              role="listbox"
              aria-labelledby={label ? "select-label" : undefined}
            >
              {options.map((option, index) => (
                <li
                  key={option.value}
                  className={`${styles.option} ${
                    option.value === value ? styles.selected : ""
                  } ${index === highlightedIndex ? styles.highlighted : ""}`}
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option.label}
                  {option.value === value && (
                    <span className={styles.checkmark} aria-hidden="true">
                      ✓
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";

export default Select;
