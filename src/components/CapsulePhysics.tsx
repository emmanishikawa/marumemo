"use client";
import { useEffect, useRef } from "react";
import { Capsule } from "@/src/types/capsule";

type Props = {
    capsules: Capsule[];
};

export default function CapsulePhysics({ capsules }: Props) {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<any>(null);

    useEffect(() => {
        if (!sceneRef.current) return;

        async function init() {
            const Matter = await import("matter-js");
            const { Engine, Render, Runner, Bodies, Body, World, Events } = Matter;

            const width = sceneRef.current!.clientWidth;
            const height = sceneRef.current!.clientHeight;

            const engine = Engine.create();
            engineRef.current = engine;

            const render = Render.create({
                element: sceneRef.current!,
                engine,
                options: {
                    width,
                    height,
                    background: "transparent",
                    wireframes: false,
                },
            });

            // walls
            const floor = Bodies.rectangle(width / 2, height + 25, width, 50, { isStatic: true, render: { fillStyle: "transparent" } });
            const wallL = Bodies.rectangle(-25, height / 2, 50, height, { isStatic: true, render: { fillStyle: "transparent" } });
            const wallR = Bodies.rectangle(width + 25, height / 2, 50, height, { isStatic: true, render: { fillStyle: "transparent" } });

            // capsule bodies with images
            const capsuleBodies = capsules.map((c) => {
                const x = Math.random() * (width - 60) + 30;
                const y = Math.random() * -200 - 40;
                const body = Bodies.circle(x, y, 28, {
                    restitution: 0.4,
                    friction: 0.5,
                    render: {
                        sprite: {
                            texture: c.capsuleImage || "/capsules/1.png",
                            xScale: 0.8,
                            yScale: 0.8,
                        },
                    },
                });
                return body;
            });

            World.add(engine.world, [floor, wallL, wallR, ...capsuleBodies]);

            Render.run(render);
            const runner = Runner.create();
            Runner.run(runner, engine);

            // device tilt
            function handleTilt(e: DeviceMotionEvent) {
                const x = e.accelerationIncludingGravity?.x ?? 0;
                const y = e.accelerationIncludingGravity?.y ?? 0;
                engine.gravity.x = -x * 0.1;
                engine.gravity.y = y * 0.1;
            }

            // mouse/trackpad gravity shift on desktop
            function handleMouseMove(e: MouseEvent) {
                const rect = sceneRef.current!.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                engine.gravity.x = ((e.clientX - cx) / rect.width) * 0.8;
                engine.gravity.y = ((e.clientY - cy) / rect.height) * 0.8 + 0.8;
            }

            window.addEventListener("devicemotion", handleTilt);
            window.addEventListener("mousemove", handleMouseMove);

            return () => {
                Render.stop(render);
                Runner.stop(runner);
                Engine.clear(engine);
                render.canvas.remove();
                window.removeEventListener("devicemotion", handleTilt);
                window.removeEventListener("mousemove", handleMouseMove);
            };
        }

        const cleanup = init();
        return () => { cleanup.then(fn => fn?.()); };
    }, [capsules]);

    return (
        <div
            ref={sceneRef}
            className="w-80 h-80 mt-13 overflow-visible"
        />
    );
}