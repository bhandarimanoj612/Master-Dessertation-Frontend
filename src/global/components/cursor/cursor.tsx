import { useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";

const CURSOR_SPEED = 0.08;

let mouseX = 0;
let mouseY = 0;
let outlineX = 0;
let outlineY = 0;

export const Cursor = () => {
  const cursorOutline = useRef<HTMLDivElement | null>(null);
  const [hoverButton, setHoverButton] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [hideCursor, setHideCursor] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cursorAnimationEnabled");

    if (saved === null) {
      localStorage.setItem("cursorAnimationEnabled", "true");
      setEnabled(true);
    } else {
      setEnabled(saved === "true");
    }

    const handleStorageChange = () => {
      const latest = localStorage.getItem("cursorAnimationEnabled");
      setEnabled(latest === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "cursor-setting-changed",
      handleStorageChange as EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "cursor-setting-changed",
        handleStorageChange as EventListener
      );
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let animationFrameId = 0;

    const animate = () => {
      const distX = mouseX - outlineX;
      const distY = mouseY - outlineY;

      outlineX = outlineX + distX * CURSOR_SPEED;
      outlineY = outlineY + distY * CURSOR_SPEED;

      if (cursorOutline.current) {
        cursorOutline.current.style.left = `${outlineX}px`;
        cursorOutline.current.style.top = `${outlineY}px`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.pageX;
      mouseY = event.pageY;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();
      const parentTag = target.parentElement?.tagName.toLowerCase();

      const isTextField =
        tag === "input" ||
        tag === "textarea" ||
        target.isContentEditable ||
        parentTag === "input" ||
        parentTag === "textarea";

      if (isTextField) {
        setHideCursor(true);
        setHoverButton(false);
        return;
      } else {
        setHideCursor(false);
      }

      if (
        tag === "button" ||
        tag === "div" ||
        parentTag === "button" ||
        target.dataset.cursor === "true"
      ) {
        setHoverButton(true);
      } else {
        setHoverButton(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  if (!enabled || hideCursor) return null;

  return (
    <div
      ref={cursorOutline}
      className={`fixed z-50 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full pointer-events-none transition-all duration-200 ease-in-out ${
        hoverButton
          ? "h-8 w-8 bg-blue-900"
          : "h-3 w-3 bg-blue-900 dark:bg-white"
      }`}
    >
      {hoverButton && <Zap size={14} color="white" />}
    </div>
  );
};