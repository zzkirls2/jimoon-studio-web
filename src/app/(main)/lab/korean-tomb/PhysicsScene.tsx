"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Matter from "matter-js";
import CharacterBlock from "./CharacterBlock";
import {
  DEAD_LETTERS,
  TEXT_COLORS,
  CHAR_NAMES,
  RUIN_ROWS,
  STRUCTURE_COLS,
  PHYSICS,
} from "./constants";

const {
  Engine,
  Runner,
  World,
  Bodies,
  Body,
  Mouse,
  MouseConstraint,
  Events,
  Query,
  Composite,
} = Matter;

interface BlockData {
  id: number;
  char: string;
  size: number;
  color: string;
}

interface Toast {
  id: number;
  text: string;
  x: number;
  y: number;
}

export default function PhysicsScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const bodiesMapRef = useRef<Map<number, Matter.Body>>(new Map());
  const domMapRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const sizeMapRef = useRef<Map<number, number>>(new Map());
  const charMapRef = useRef<Map<number, string>>(new Map());
  const toastIdRef = useRef(0);

  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const syncLoop = useCallback(() => {
    bodiesMapRef.current.forEach((body, id) => {
      const el = domMapRef.current.get(id);
      const size = sizeMapRef.current.get(id);
      if (!el || !size) return;
      const { x, y } = body.position;
      el.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px) rotate(${body.angle}rad)`;
    });
    rafRef.current = requestAnimationFrame(syncLoop);
  }, []);

  useEffect(() => {
    const container = sceneRef.current;
    if (!container) return;

    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const t = PHYSICS.wallThickness;

    const cellSize = Math.min(
      Math.floor((cw * 0.7) / STRUCTURE_COLS),
      Math.floor((ch * 0.8) / RUIN_ROWS.length),
      28,
    );
    const originX = (cw - STRUCTURE_COLS * cellSize) / 2;

    const engine = Engine.create({ enableSleeping: true });
    engine.gravity.y = PHYSICS.gravity;

    const runner = Runner.create();
    Runner.run(runner, engine);

    const floor = Bodies.rectangle(cw / 2, ch + t / 2, cw + t * 2, t, {
      isStatic: true,
    });
    const leftWall = Bodies.rectangle(-t / 2, ch / 2, t, ch * 2, {
      isStatic: true,
    });
    const rightWall = Bodies.rectangle(cw + t / 2, ch / 2, t, ch * 2, {
      isStatic: true,
    });
    World.add(engine.world, [floor, leftWall, rightWall]);

    const mouse = Mouse.create(container);
    mouse.pixelRatio = 1;
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    World.add(engine.world, mouseConstraint);

    // Wake all sleeping bodies when any block is dragged
    // so gravity applies to the whole structure
    const wakeAll = () => {
      Composite.allBodies(engine.world).forEach((b) => {
        if (!b.isStatic && b.isSleeping) Body.set(b, "isSleeping", false);
      });
    };

    Events.on(mouseConstraint, "startdrag", (e) => {
      const body = (e as unknown as { body: Matter.Body }).body;
      if (body) wakeAll();
      container.style.cursor = "grabbing";
    });
    Events.on(mouseConstraint, "enddrag", () => {
      container.style.cursor = "grab";
    });

    // --- Hover to show name (mouse) ---
    let lastHoveredId = -1;
    const showToast = (blockId: number, cx: number, cy: number) => {
      const char = charMapRef.current.get(blockId);
      const name = char ? CHAR_NAMES[char] : undefined;
      if (!name) return;
      const tid = toastIdRef.current++;
      setToasts((prev) => [
        ...prev,
        { id: tid, text: `${char} ${name}`, x: cx, y: cy },
      ]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((tt) => tt.id !== tid));
      }, 10200);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const hits = Query.point(Composite.allBodies(engine.world), {
        x: cx,
        y: cy,
      });
      const hit = hits.find((b) => !b.isStatic);
      if (hit) {
        const blockId = Number(hit.label);
        if (blockId !== lastHoveredId) {
          lastHoveredId = blockId;
          showToast(blockId, cx, cy);
        }
      } else {
        lastHoveredId = -1;
      }
    };

    // Touch: show on tap
    const handleTouchStart = (e: TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const cx = e.touches[0].clientX - rect.left;
      const cy = e.touches[0].clientY - rect.top;
      const hits = Query.point(Composite.allBodies(engine.world), {
        x: cx,
        y: cy,
      });
      const hit = hits.find((b) => !b.isStatic);
      if (hit) showToast(Number(hit.label), cx, cy);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });

    // Build structure
    const newBlocks: BlockData[] = [];
    let nextId = 0;
    const structureH = RUIN_ROWS.length * cellSize;
    const bottomMargin = (ch - structureH) / 2;

    RUIN_ROWS.forEach((rowCols, rowIdx) => {
      rowCols.forEach((col) => {
        const id = nextId++;
        const jx = (Math.random() - 0.5) * cellSize * 0.35;
        const jy = (Math.random() - 0.5) * cellSize * 0.25;
        const angle = (Math.random() - 0.5) * 0.4;

        const x = originX + col * cellSize + cellSize / 2 + jx;
        const y = ch - bottomMargin - cellSize / 2 - rowIdx * cellSize + jy;
        const char = DEAD_LETTERS[id % DEAD_LETTERS.length];

        const body = Bodies.rectangle(x, y, cellSize * 0.92, cellSize * 0.92, {
          restitution: PHYSICS.restitution,
          friction: PHYSICS.friction,
          frictionStatic: PHYSICS.frictionStatic,
          angle,
          label: String(id),
          isSleeping: true,
        });

        bodiesMapRef.current.set(id, body);
        charMapRef.current.set(id, char);
        World.add(engine.world, body);
        newBlocks.push({
          id,
          char,
          size: cellSize,
          color: TEXT_COLORS[id % TEXT_COLORS.length],
        });
      });
    });

    setBlocks(newBlocks);
    rafRef.current = requestAnimationFrame(syncLoop);

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = entry.contentRect.width;
      const h = entry.contentRect.height;
      Body.setPosition(floor, { x: w / 2, y: h + t / 2 });
      Body.setVertices(
        floor,
        Bodies.rectangle(w / 2, h + t / 2, w + t * 2, t).vertices,
      );
      Body.setPosition(leftWall, { x: -t / 2, y: h / 2 });
      Body.setPosition(rightWall, { x: w + t / 2, y: h / 2 });
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(rafRef.current);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchstart", handleTouchStart);
      ro.disconnect();
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
      bodiesMapRef.current.clear();
      domMapRef.current.clear();
      sizeMapRef.current.clear();
      charMapRef.current.clear();
    };
  }, [syncLoop]);

  const registerRef = useCallback(
    (id: number, size: number) => (el: HTMLDivElement | null) => {
      if (el) {
        domMapRef.current.set(id, el);
        sizeMapRef.current.set(id, size);
      } else {
        domMapRef.current.delete(id);
        sizeMapRef.current.delete(id);
      }
    },
    [],
  );

  return (
    <div
      ref={sceneRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        touchAction: "none",
        cursor: "grab",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes incenseSmoke {
              0% {
                opacity: 0.85;
                transform: translate(-50%, 0);
                filter: blur(0);
              }
              15% {
                opacity: 0.7;
                transform: translate(-47%, -30px);
                filter: blur(0.3px);
              }
              35% {
                opacity: 0.55;
                transform: translate(-54%, -80px);
                filter: blur(0.8px);
              }
              55% {
                opacity: 0.35;
                transform: translate(-48%, -150px);
                filter: blur(1.5px);
              }
              75% {
                opacity: 0.18;
                transform: translate(-53%, -230px);
                filter: blur(3px);
              }
              100% {
                opacity: 0;
                transform: translate(-50%, -320px);
                filter: blur(5px);
              }
            }
          `,
        }}
      />

      {blocks.map((b) => (
        <CharacterBlock
          key={b.id}
          ref={registerRef(b.id, b.size)}
          char={b.char}
          size={b.size}
          color={b.color}
        />
      ))}

      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            position: "absolute",
            left: t.x,
            top: t.y - 8,
            fontSize: 11,
            fontWeight: 500,
            color: "rgba(100,80,60,0.85)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            animation: "incenseSmoke 10s ease-out forwards",
          }}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
