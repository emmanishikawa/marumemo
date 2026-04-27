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

    
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    useEffect(() => {
    async function load() {
  if (!id) return;

  console.log("3. Loading machine with id:", id);

  const { data, error } = await supabase
    .from("machines")
    .select("*")
    .eq("id", id)
    .single();

  console.log("4. Raw Supabase row:", data);
  console.log("5. data.data (machine object):", data?.data);
  console.log("6. Error if any:", error);

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

        <button onClick={() => router.push("/edit/${id}")}>
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