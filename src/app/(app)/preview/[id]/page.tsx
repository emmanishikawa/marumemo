"use client";
import { useEffect, useState } from "react";
import type { Machine } from "@/src/types/machine";
import { useRouter } from "next/navigation";
import { Capsule } from "@/src/types/capsule";
import { useParams } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import SlideshowModal from "@/src/components/SlideshowModal";
import Button from "@/src/components/Button";
import CapsulePhysics from "@/src/components/CapsulePhysics";

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
    <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex flex-row items-center justify-center">
            <Button variant="word" onClick={() => router.push(`/edit/${id}`)}>
                Edit
            </Button>
            
            <Button variant="primary" onClick={finalizeMachine}>
                Finish & Share
            </Button>
        </div>

        <CapsulePhysics capsules={machine.capsules} />
  
        <button onClick={async () => {
            pullCapsule();
        }}> 
            <img className="mt-8 glow-pulse overflow-visible" src="/assets/handle.png"/> {/** handle */}
        </button>

        {current && (
            <SlideshowModal 
                capsule={current}
                onClose={() => setCurrent(null)}    
            />            
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
                    <Button
                        onClick={() => navigator.clipboard
                                .writeText(`${window.location.origin}/share/${id}`)}
                        variant="primary"
                    >
                        copy
                    </Button>
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