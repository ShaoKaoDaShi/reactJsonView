import { useEffect, useRef } from "react";
import { debounce, throttle } from "lodash";
import "./index.css";

export const ResizeBox = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizableBox = ref.current;
    if (!resizableBox) return;

    let isResizing = false;
    let startX: number, startY: number, startWidth: number, startHeight: number;

    // 鼠标按下事件：初始化拖拽
    resizableBox.addEventListener("mousedown", (e) => {
      const rect = resizableBox.getBoundingClientRect();

      // 检查是否在边框范围内
      if (e.clientX >= rect.right - 10) {
        isResizing = true;
        resizableBox.classList.add("resizing");

        startX = e.clientX;
        startY = e.clientY;
        startWidth = rect.width;
        startHeight = rect.height;
        e.preventDefault();
      }
    });

    // 鼠标移动事件：调整 div 大小
    document.addEventListener(
      "mousemove",
      throttle((e) => {
        const rect = resizableBox.getBoundingClientRect();
        if (e.clientX >= rect.right - 10 && e.clientX <= rect.right) {
          resizableBox.style.cursor = "ew-resize";
          document.body.style.cursor = "ew-resize";
        }
        if (isResizing) {
          const newWidth = startWidth + (e.clientX - startX);
          resizableBox.style.width = `${newWidth}px`;
        }
        if (!isResizing && e.clientX > rect.right) {
          document.body.style.cursor = "auto";
          resizableBox.style.cursor = "auto";
        }
      }, 64)
    );

    // 鼠标松开事件：结束拖拽
    document.addEventListener("mouseup", () => {
      isResizing = false;
      resizableBox.classList.remove("resizing");
      document.body.style.cursor = "auto";
      resizableBox.style.cursor = "auto";
    });
  }, []);
  return (
    <div id="resizable-box" ref={ref} style={{ width: "300px" }}>
      {props.children}
    </div>
  );
};
