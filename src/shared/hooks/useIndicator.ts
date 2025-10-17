import { useState, useCallback, useRef } from "react";

interface IndicatorState {
  column: number;
  x: number;
  y: number;
}

export const useIndicator = (columns: number) => {
  const [indicatorState, setIndicatorState] = useState<IndicatorState | null>(
    null
  );
  const boardRef = useRef<HTMLDivElement>(null);

  const updateIndicator = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!boardRef.current) return;

      const rect = boardRef.current.getBoundingClientRect();

      const style = getComputedStyle(boardRef.current);
      const paddingLeft = parseFloat(style.paddingLeft || "0");
      const paddingRight = parseFloat(style.paddingRight || "0");
      const gap = parseFloat(style.gap || "0");
      const contentWidth = rect.width - paddingLeft - paddingRight;
      const totalGapWidth = Math.max(0, columns - 1) * gap;
      const columnsWidth = Math.max(0, contentWidth - totalGapWidth);
      const columnWidth = columnsWidth / columns;
      const x = event.clientX - rect.left - paddingLeft;

      let column = Math.floor(x / (columnWidth + gap));
      if (column < 0) column = 0;
      if (column >= columns) column = columns - 1;

      const centerXViewport =
        rect.left +
        paddingLeft +
        column * (columnWidth + gap) +
        columnWidth / 2;

      setIndicatorState({
        column,
        x: centerXViewport,
        y: rect.top,
      });
    },
    [columns]
  );

  const hideIndicator = useCallback(() => {
    setIndicatorState(null);
  }, []);

  return {
    boardRef,
    indicatorState,
    updateIndicator,
    hideIndicator,
  };
};
