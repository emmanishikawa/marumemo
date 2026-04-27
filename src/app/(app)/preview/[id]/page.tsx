"use client";
import { useEffect, useState } from "react";
import type { Machine } from "@/src/types/machine";
import { useRouter } from "next/navigation";
import { Capsule } from "@/src/types/capsule";
import { useParams } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

export default function PreviewPage() {
    const [machine, setMachine] = useState<Machine | null>(null);
    const router = useRouter();

    const [remaining, setRemaining] = useState<Capsule[]>([]);
    const [current, setCurrent] = useState<Capsule | null>(null);

    const [showShare, setShowShare] = useState(false);
    
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    useEffect(() => {
        async function load() {
        if (!id) return;

        const { data, error } = await supabase
            .from("machines")
            .select("*")
            .eq("id", id)
            .single();

            if (error) {
                console.error("LOAD ERROR:", error);
                return;
            }

            if (data?.data) {
                setMachine(data.data);
            }
        }
        load();
    }, [id]);

    useEffect(() => {
    if (machine) {
        setRemaining(machine.capsules);
    }
    }, [machine]);

    if (!machine) return <p>loading</p>;

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

    async function finalizeMachine() {
        if (!machine) return;

        const updated = { ...machine, isFinalized: true };

        const { error } = await supabase.from("machines").upsert({
            id: updated.id,
            data: updated,
            is_finalized: true,
        });

        if (error) {
            console.error("Failed to finalize:", error);
            return;
        }

        setMachine(updated);
        setShowShare(true);
        navigator.clipboard.writeText(`${window.location.origin}/share/${id}`);
    }

    return (
    <div className="flex flex-col items-center justify-center">
        <h1>Preview</h1>
        
        <div className="flex flex-row items-center justify-center">
            <button onClick={() => router.push(`/edit/${id}`)}>
                Edit
            </button>
            
            <button onClick={finalizeMachine}>
                Finish & Share
            </button>
        </div>

        <button onClick={pullCapsule}>
            Pull Capsule
        </button>

        {current && (
            <img src={current.trinket} />
        )}

        {showShare && 
            (<div className="fixed inset-0 flex items-center justify-center
            bg-(--primary)/50 p-4">
                <div className="bg-white p-6 w-100 rounded-xl">
                    <p className="text-sm text-center text-(--primary)">share this link</p>
                    <input
                        readOnly
                        value={`${window.location.origin}/share/${id}`}
                        className="border rounded-lg p-2 text-sm w-full"
                    />
                    <button
                        onClick={() => navigator.clipboard
                                .writeText(`${window.location.origin}/share/${id}`)}
                        className="bg-(--primary) text-white rounded-lg 
                            py-2 touch-manipulation active:scale-95 transition-all"
                    >
                        copy link
                    </button>
                    <button
                        onClick={() => setShowShare(false)}
                        className="text-sm text-gray-400"
                    >
                        close
                    </button>
                </div>
            </div>)}
    </div>
    );
}