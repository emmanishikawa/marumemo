"use client";
import { useEffect, useState } from "react";
import type { Machine } from "@/src/types/machine";
import { useRouter } from "next/navigation";
import { Capsule } from "@/src/types/capsule";
import { useParams } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import SlideshowModal from "@/src/components/SlideshowModal";
import CapsulePhysics from "@/src/components/CapsulePhysics";

export default function PreviewPage() {
    const [machine, setMachine] = useState<Machine | null>(null);
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

    

    return (
    <div className="flex flex-col items-center justify-center gap-3 mt-15">

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

    </div>
    );
}