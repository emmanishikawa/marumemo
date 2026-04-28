"use client";

import { useRef, useEffect, useState } from "react";
import Button from "./Button";

type Props = {
  width?: number;
  height?: number;
  initialData?: string;
  onSave?: (dataUrl: string) => void;
};

export default function Canvas({
  width = 300,
  height = 250,
  initialData,
  onSave,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  const [hue, setHue] = useState(0);
  const color = `hsl(${hue}, 75%, 75%)`;

  const history = useRef<ImageData[]>([]);
  const didPushHistory = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
  }, []);
  

  function getPos(e: any) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    return { x, y };
  }

  function start(e: any) {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);

    isDrawing.current = true;
  }

  function draw(e: any) {
    if (!isDrawing.current) return;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = color;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function end() {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    history.current.push(
      ctx.getImageData(0, 0, canvas.width, canvas.height)
    );
  }

  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  useEffect(() => {
    if (!initialData) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = initialData;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }, [initialData]);

function undo() {
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  if (history.current.length === 0) return;

  history.current.pop();

  const last = history.current[history.current.length - 1];

  if (!last) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  ctx.putImageData(last, 0, 0);
}

function save() {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const dataUrl = canvas.toDataURL("image/png");
  onSave?.(dataUrl);
}

  return (
    <div>
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="border rounded touch-none"
            onMouseDown={start}
            onMouseMove={draw}
            onMouseUp={end}
            onMouseLeave={end}
            onTouchStart={start}
            onTouchMove={draw}
            onTouchEnd={end}
        />

        <input
            type="range"
            min="0"
            max="360"
            value={hue}
            onChange={(e) => setHue(Number(e.target.value))}
            className="w-full mt-2 hue-slider"
        />

        <div className="flex gap-2 mt-2">
            <Button variant="word" onClick={clear}>clear</Button>
            <Button variant="symbol" onClick={undo}>⟲</Button>
            <Button variant="symbol" onClick={save}>➝</Button>
        </div>

        
    </div>
  );
}
