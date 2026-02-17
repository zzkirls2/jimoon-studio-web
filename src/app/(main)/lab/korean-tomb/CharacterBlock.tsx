import { forwardRef } from "react";

interface CharacterBlockProps {
  char: string;
  size: number;
  color: string;
}

const CharacterBlock = forwardRef<HTMLDivElement, CharacterBlockProps>(
  function CharacterBlock({ char, size, color }, ref) {
    return (
      <div
        ref={ref}
        style={{
          position: "absolute",
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.82,
          fontWeight: 800,
          color,
          willChange: "transform",
          pointerEvents: "none",
          userSelect: "none",
          lineHeight: 1,
        }}
      >
        {char}
      </div>
    );
  },
);

export default CharacterBlock;
