import React, { memo } from "react";
import { createPortal } from "react-dom";
import styles from "./Indicator.module.css";
import IndicatorSVG from "@assets/indicator.svg";

interface IndicatorProps {
  x: number;
  y: number;
}

const Indicator: React.FC<IndicatorProps> = memo(({ x, y }) => {
  return createPortal(
    <div className={styles.indicator} style={{ left: `${x}px`, top: `${y}px` }}>
      <img src={IndicatorSVG} alt="indicator" className={styles.svg} />
    </div>,
    document.body
  );
});

Indicator.displayName = "Indicator";

export default Indicator;
