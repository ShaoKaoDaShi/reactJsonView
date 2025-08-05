import styled from "styled-components";

import React, {
  useState,
  useRef,
  useEffect,
  Children,
  CSSProperties,
} from "react";
const Wrapper = styled.div`
  box-sizing: border-box;
  overflow: hidden;
`;

interface OverflowContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  ellipsis?:
    | React.ReactNode
    | ((hiddenIndex: number, total: number) => React.ReactNode);
  debounceTime?: number;
}

const OverflowContainer: React.FC<OverflowContainerProps> = ({
  children,
  className,
  style,
  ellipsis = "...",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ellipsisRef = useRef<HTMLSpanElement>(null);
  const [hiddenIndex, setHiddenIndex] = useState<number>(-1);

  const resizeObserverRef = useRef<ResizeObserver>();
  const requestRef = useRef<number>();

  const getEllipsisWidth = () => {
    if (!ellipsisRef.current) return 0;
    return (
      ellipsisRef.current.offsetWidth +
      parseFloat(getComputedStyle(ellipsisRef.current).marginRight)
    );
  };

  const calculateLayout = (containerWidth: number) => {
    if (!containerRef.current) return;

    const childrenNodes = Array.from(containerRef.current.children).filter(
      (node) => !node.classList.contains("overflow-ellipsis")
    );
    const ellipsisWidth = getEllipsisWidth();

    const prevEllipsisDisplay = ellipsisRef.current?.style.display;
    if (ellipsisRef.current) {
      ellipsisRef.current.style.display = "none";
    }

    childrenNodes.forEach((node) => {
      (node as HTMLElement).style.opacity = "1";
      (node as HTMLElement).style.display = "inline-block";
      (node as HTMLElement).style.position = "relative";
    });

    let totalWidth = 0;
    let cutoffIndex = -1;
    const availableWidth = containerWidth - ellipsisWidth;

    for (let i = 0; i < childrenNodes.length; i++) {
      const child = childrenNodes[i] as HTMLElement;
      const childWidth =
        child.offsetWidth + parseFloat(getComputedStyle(child).marginRight);

      if (totalWidth + childWidth > availableWidth) {
        cutoffIndex = i;
        break;
      }
      totalWidth += childWidth;
    }

    if (ellipsisRef.current) {
      ellipsisRef.current.style.display = prevEllipsisDisplay || "inline-block";
    }

    const hiddenIndex = cutoffIndex === -1 ? childrenNodes.length : cutoffIndex;
    childrenNodes.forEach((node, index) => {
      (node as HTMLElement).style.display =
        index < hiddenIndex ? "inline-block" : "none";
    });

    setHiddenIndex(cutoffIndex === -1 ? childrenNodes.length : cutoffIndex);
  };

  useEffect(() => {
    if (!containerRef.current || !children) return;

    const handleResize: ResizeObserverCallback = (entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        if (cr.width === 0) return;

        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
        requestRef.current = requestAnimationFrame(() => {
          calculateLayout(cr.width);
        });
      }
    };

    resizeObserverRef.current = new ResizeObserver(handleResize);
    resizeObserverRef.current.observe(containerRef.current);

    return () => {
      resizeObserverRef.current?.disconnect();
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [containerRef.current]);

  useEffect(() => {
    if (containerRef.current && children) {
      const containerWidth = containerRef.current.clientWidth;
      calculateLayout(containerWidth);
    }
  }, [children]);

  return (
    <Wrapper
      ref={containerRef}
      className={`overflow-container ${className || ""}`}
      style={{
        ...style,
        whiteSpace: "nowrap",
        overflow: "hidden",
        position: "relative",
        lineHeight: 1,
      }}
    >
      {/* {renderChildren()} */}
      {children}
      {hiddenIndex < Children.count(children) && (
        <span
          ref={ellipsisRef}
          className="overflow-ellipsis"
          style={{
            display: "inline-block",
            lineHeight: 1,
          }}
        >
          {typeof ellipsis === "function"
            ? ellipsis(hiddenIndex, Children.count(children))
            : ellipsis}
        </span>
      )}
    </Wrapper>
  );
};

export default OverflowContainer;
