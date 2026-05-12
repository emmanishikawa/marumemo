"use client";
import { useEffect, useRef } from "react";
import { Capsule } from "@/src/types/capsule";

type Props = {
    capsules: Capsule[];
    motionPermission: boolean;
};

export default function CapsulePhysics({ capsules, motionPermission }: Props) {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<any>(null);

    useEffect(() => {
        if (!sceneRef.current) return;

        async function init() {
            const Matter = await import("matter-js");
            const { Engine, Render, Runner, Bodies, World } = Matter;

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

            const floor = Bodies.rectangle(width / 2, height + 25, width, 50, { isStatic: true, render: { fillStyle: "transparent" } });
            const wallL = Bodies.rectangle(-25, height / 2, 50, height, { isStatic: true, render: { fillStyle: "transparent" } });
            const wallR = Bodies.rectangle(width + 25, height / 2, 50, height, { isStatic: true, render: { fillStyle: "transparent" } });

            const capsuleBodies = capsules.map((c) => {
                const x = Math.random() * (width - 60) + 30;
                const y = Math.random() * -200 - 40;
                return Bodies.circle(x, y, 28, {
                    restitution: 0.4,
                    friction: 0.5,
                    render: {
                        sprite: {
                            texture: c.capsuleImage || "/capsules/1.png",
                            xScale: 1,
                            yScale: 1,
                        },
                    },
                });
            });

            World.add(engine.world, [floor, wallL, wallR, ...capsuleBodies]);
            Render.run(render);
            const runner = Runner.create();
            Runner.run(runner, engine);

            function handleMouseMove(e: MouseEvent) {
                const rect = sceneRef.current!.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                engine.gravity.x = ((e.clientX - cx) / rect.width) * 0.8;
                engine.gravity.y = ((e.clientY - cy) / rect.height) * 0.8 + 0.8;
            }

            window.addEventListener("mousemove", handleMouseMove);

            return () => {
                Render.stop(render);
                Runner.stop(runner);
                Engine.clear(engine);
                render.canvas.remove();
                window.removeEventListener("mousemove", handleMouseMove);
            };
        }

        const cleanup = init();
        return () => { cleanup.then(fn => fn?.()); };
    }, [capsules]);

    useEffect(() => {
        if (!motionPermission) return;

        function handleTilt(e: DeviceMotionEvent) {
            if (!engineRef.current) return;
            const x = e.accelerationIncludingGravity?.x ?? 0;
            const y = e.accelerationIncludingGravity?.y ?? 0;
            engineRef.current.gravity.x = -x * 0.1;
            engineRef.current.gravity.y = y * 0.1;
        }

        window.addEventListener("devicemotion", handleTilt);
        return () => window.removeEventListener("devicemotion", handleTilt);
    }, [motionPermission]);

    return (
        <div
            ref={sceneRef}
            className="w-80 h-80 mt-13 overflow-visible"
        />
    );
}