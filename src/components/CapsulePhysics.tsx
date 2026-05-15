"use client";
import { useEffect, useRef } from "react";
import { Capsule } from "@/src/types/capsule";

type Props = {
    capsules: Capsule[];
};

export default function CapsulePhysics({ capsules }: Props) {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<any>(null);
    const bodiesRef = useRef<any[]>([]);

    useEffect(() => {
        if (!sceneRef.current) return;

        async function init() {
            const Matter = await import("matter-js");
            const { Engine, Render, Runner, Bodies, World, Body } = Matter;

            const width = sceneRef.current!.clientWidth;
            const height = sceneRef.current!.clientHeight;

            const engine = Engine.create({
                gravity: { x: 0, y: 0.15 }
            });
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
            const ceiling = Bodies.rectangle(width / 2, -25, width, 50, { 
                isStatic: true, 
                restitution: 0.8,
                render: { fillStyle: "transparent" } 
            });

            const capsuleBodies = capsules.map((c) => {
                const x = Math.random() * (width - 60) + 30;
                const y = Math.random() * (height - 60) + 30;
                return Bodies.circle(x, y, 28, {
                    restitution: 0.8,
                    friction: 0.1,
                    render: {
                        sprite: {
                            texture: c.capsuleImage || "/capsules/1.png",
                            xScale: 1,
                            yScale: 1,
                        },
                    },
                });
            });

            bodiesRef.current = capsuleBodies;
            World.add(engine.world, [floor, wallL, wallR, ceiling, ...capsuleBodies]);
            Render.run(render);
            const runner = Runner.create();
            Runner.run(runner, engine);

            function applyForce(e: MouseEvent | TouchEvent) {
                const rect = sceneRef.current!.getBoundingClientRect();
                const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
                const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
                const tapX = clientX - rect.left;
                const tapY = clientY - rect.top;

                bodiesRef.current.forEach((body) => {
                    const dx = body.position.x - tapX;
                    const dy = body.position.y - tapY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = 120;

                    if (dist < maxDist) {
                        const strength = (1 - dist / maxDist) * 0.1;
                        Body.applyForce(body, body.position, {
                            x: (dx / dist) * strength,
                            y: (dy / dist) * strength,
                        });
                    }
                });
            }

            sceneRef.current!.addEventListener("mousedown", applyForce);
            sceneRef.current!.addEventListener("touchstart", applyForce);

            return () => {
                Render.stop(render);
                Runner.stop(runner);
                Engine.clear(engine);
                render.canvas.remove();
                sceneRef.current?.removeEventListener("mousedown", applyForce);
                sceneRef.current?.removeEventListener("touchstart", applyForce);
            };
        }

        const cleanup = init();
        return () => { cleanup.then(fn => fn?.()); };
    }, [capsules]);

    return (
        <div
            ref={sceneRef}
            style={{ width: "min(320px, 85vw)", height: "min(320px, 85vw)" }}
            className="mt-13 overflow-hidden rounded-3xl"
        />
    );
}