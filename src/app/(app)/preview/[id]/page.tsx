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

    const [motionPermission, setMotionPermission] = useState(false);


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

        <div className="-mt-7">
            <CapsulePhysics capsules={machine.capsules} />
        </div>
  
        <button onClick={async () => {
            pullCapsule();
        }}>
            <img className="mt-7" src="/assets/handle.png"/>
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
                <div className="flex flex-col items-center justify-center gap-[2vw]">
                    <div className="flex flex-row items-center justify-center">
                        <Button variant="word" onClick={() => router.push(`/edit/${id}`)}>Edit</Button>
                        <Button variant="primary" onClick={finalizeMachine}>Finish & Share</Button>
                    </div>

                    <div style={{ marginTop: "-min(28px, 7vw)" }}>
                        <CapsulePhysics capsules={machine.capsules} />
                    </div>

                    <button onClick={pullCapsule}>
                        <img style={{ width: "min(120px, 30vw)" }} src="/assets/handle.png" />
                    </button>
                </div>
            </div>)}
    </div>
    );
}