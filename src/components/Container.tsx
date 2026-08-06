import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
};

export function Container({
  children,
  className = "",
  as: Element = "div",
}: ContainerProps) {
  return (
    <Element
      className={`flex mx-auto w-full max-w-full flex-col px-0 ${className}`.trim()}
    >
      {children}
    </Element>
  );
}
