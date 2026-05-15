//TODO FIX LAYOUT
"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function createMachine() {
    if (loading) return;
    setLoading(true);

    const id = crypto.randomUUID();

    const newMachine = {
      id,
      data: {
        id,
        capsules: [],
        isFinalized: false,
      },
      is_finalized: false,
    };

    await supabase.from("machines").insert(newMachine);

    router.push(`/edit/${id}`);
  }
  return (
    <>
    <main className="flex flex-col items-center justify-start h-full">

      <div className="h-full w-80 mt-6">
        <img className="object-contain" src="/assets/logo.png"/>
      </div>

      {/* create button */}
      <button
        onClick={createMachine}
        disabled={loading}
        className="w-46.25 h-20
          bg-(--primary) active:bg-(--secondary) active:scale-95
          text-white text-[25px]
          rounded-[10px]
          transition-all duration-100 touch-manipulation
          disabled:opacity-50 cursor-pointer"
      >
        {loading ? "creating..." : "create"}
      </button>
    </main>
      
    </>
  );
}
