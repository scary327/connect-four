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
      const board = boardRef.current;
      if (!board) return;

      //рассчитываем позицию индикатора
      const boardRect = board.getBoundingClientRect();
      const styles = getComputedStyle(board);
      const padding = parseFloat(styles.paddingLeft || "0");
      const gap = parseFloat(styles.gap || "0");
      const mouseX = event.clientX - boardRect.left - padding;
      const contentWidth = boardRect.width - padding * 2;
      const columnWidthWithGap = contentWidth / columns;
      const calculatedColumn = Math.floor(mouseX / columnWidthWithGap);
      const columnIndex = Math.max(0, Math.min(calculatedColumn, columns - 1));

      const columnWidth = (contentWidth - gap * (columns - 1)) / columns;
      const centerX =
        boardRect.left +
        padding +
        columnIndex * (columnWidth + gap) +
        columnWidth / 2;

      setIndicatorState({
        column: columnIndex,
        x: centerX,
        y: boardRect.top,
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
