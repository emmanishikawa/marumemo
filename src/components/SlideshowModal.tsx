"use client";
import { useState, useRef } from "react";
import type { Capsule } from "@/src/types/capsule";

type Props = {
    capsule: Capsule;
    onClose: () => void;
};

export default function SlideshowModal({ capsule, onClose }: Props) {
    const slides = [
        { url: capsule.trinket, caption: "" },
        ...capsule.images.map(img => ({ url: img.url, caption: img.caption || "" })),
    ];

    const [index, setIndex] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const [dragging, setDragging] = useState(false);
    const startX = useRef(0);
    const containerWidth = 256; // w-64

    function getClientX(e: React.MouseEvent | React.TouchEvent) {
        if ("touches" in e) return e.touches[0].clientX;
        return e.clientX;
    }

    function onDragStart(e: React.MouseEvent | React.TouchEvent) {
        startX.current = getClientX(e);
        setDragging(true);
    }

    function onDragMove(e: React.MouseEvent | React.TouchEvent) {
        if (!dragging) return;
        const diff = getClientX(e) - startX.current;
        // clamp so you can't drag past first or last
        if (index === 0 && diff > 0) return;
        if (index === slides.length - 1 && diff < 0) return;
        setDragOffset(diff);
    }

    function onDragEnd() {
        if (!dragging) return;
        setDragging(false);

        const threshold = containerWidth * 0.3;
        if (dragOffset < -threshold && index < slides.length - 1) {
            setIndex(i => i + 1);
        } else if (dragOffset > threshold && index > 0) {
            setIndex(i => i - 1);
        }
        setDragOffset(0);
    }

    const lastWheelTime = useRef(0);

    function handleWheel(e: React.WheelEvent) {
        e.preventDefault();
        const now = Date.now();
        if (now - lastWheelTime.current < 600) return;

        if (e.deltaX > 20) {
            setIndex(i => Math.min(i + 1, slides.length - 1));
            lastWheelTime.current = now;
        } else if (e.deltaX < -20) {
            setIndex(i => Math.max(i - 1, 0));
            lastWheelTime.current = now;
        }
    }

    const slide = slides[index];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-(--primary)/50 p-4">
            <div className="flex flex-col items-center bg-white p-6 w-80 rounded-xl gap-4">
                <button onClick={onClose} className="self-end">x</button>

                {/* slide viewport */}
                <div className="w-64 h-64 overflow-hidden relative"
                    onWheel={handleWheel}
                    
                    onTouchStart={onDragStart}
                    onTouchMove={onDragMove}
                    onTouchEnd={onDragEnd}
                >
                    {slides.map((s, i) => (
                        <img
                            key={i}
                            src={s.url}
                            draggable={false}
                            className="absolute top-0 w-64 h-64 object-contain select-none"
                            style={{
                                left: `${(i - index) * containerWidth + dragOffset}px`,
                                transition: dragging ? "none" : "left 0.3s ease",
                            }}
                        />
                    ))}
                </div>

                {slide.caption && (
                    <p className="text-sm text-center text-gray-500">{slide.caption}</p>
                )}

                {/* dots */}
                <div className="flex items-center gap-2">
                    {slides.map((_, i) => (
                        i === 0 ? (
                            <span
                                key={i}
                                onClick={() => setIndex(i)}
                                className={`text-lg cursor-pointer transition-all ${
                                    index === 0 ? "text-(--primary)" : "text-gray-300"
                                }`}
                            >★</span>
                        ) : (
                            <span
                                key={i}
                                onClick={() => setIndex(i)}
                                className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                                    index === i ? "bg-(--primary)" : "bg-gray-300"
                                }`}
                            />
                        )
                    ))}
                </div>
            </div>
        </div>
    );
}