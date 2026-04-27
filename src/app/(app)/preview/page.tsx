"use client";

import { useEffect, useState } from "react";
import type { Machine } from "@/src/types/machine";
import { useRouter } from "next/navigation";
import { Capsule } from "@/src/types/capsule";

export default function PreviewPage() {
    const [machine, setMachine] = useState<Machine | null>(null);
    const router = useRouter();

    const [remaining, setRemaining] = useState<Capsule[]>([]);
    const [current, setCurrent] = useState<Capsule | null>(null);

    
    useEffect(() => {
    const data = localStorage.getItem("machine");
    if (data) {
        setMachine(JSON.parse(data));
    }
    }, []);

    useEffect(() => {
    if (machine) {
        setRemaining(machine.capsules);
    }
    }, [machine]);

    if (!machine) return <p>Loading...</p>;

    function pullCapsule() {
        if (!machine) return;

        if (remaining.length === 0) {
            setRemaining(machine.capsules);
            return;
        }

        const randomIndex = Math.floor(Math.random() * remaining.length);
        const chosen = remaining[randomIndex];

        setCurrent(chosen);

        setRemaining(prev =>
            prev.filter((_, i) => i !== randomIndex)
        );
    }

    return (
    <div>
        <h1>Preview Mode</h1>

        <button onClick={() => router.push("/edit")}>
        Back to Edit
        </button>

        
        <button onClick={pullCapsule}>
            Pull Capsule
        </button>

        {current && (
            <img src={current.trinket} />
        )}
    </div>
    );
}