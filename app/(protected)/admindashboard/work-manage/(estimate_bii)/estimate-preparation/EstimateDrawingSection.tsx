"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface EstimateDrawingSectionProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function EstimateDrawingSection({
  value,
  onChange,
  disabled = false,
}: EstimateDrawingSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !value) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const image = new Image();
    image.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = value;
  }, [value]);

  const getPos = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { x, y } = getPos(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    setDrawing(true);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || disabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { x, y } = getPos(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const finishDrawing = () => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      onChange(canvas.toDataURL("image/png"));
    }
    setDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-300 bg-white p-2">
        <canvas
          ref={canvasRef}
          width={900}
          height={280}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={finishDrawing}
          onMouseLeave={finishDrawing}
          className={`w-full h-[280px] rounded-md border border-dashed border-slate-300 ${
            disabled ? "cursor-not-allowed opacity-60" : "cursor-crosshair"
          }`}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={clearCanvas}
          disabled={disabled}
          className="border-slate-300"
        >
          Clear Drawing
        </Button>
      </div>
    </div>
  );
}

