import React, { memo } from "react";
import { createPortal } from "react-dom";
import styles from "./Indicator.module.css";

interface IndicatorProps {
  x: number;
  y: number;
}

const Indicator: React.FC<IndicatorProps> = memo(({ x, y }) => {
  return createPortal(
    <div className={styles.indicator} style={{ left: `${x}px`, top: `${y}px` }}>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d="M12 2 L22 22 L2 22 Z" fill="#7C4DFF" filter="url(#glow)" />
      </svg>
    </div>,
    document.body
  );
});

Indicator.displayName = "Indicator";

export default Indicator;
