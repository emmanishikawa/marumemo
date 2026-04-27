"use client"

import { Capsule } from "@/src/types/capsule";
import CapsuleModal from "@/src/components/CapsuleModal";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";
import { Machine } from "@/src/types/machine";
import { useParams } from "next/navigation";

export default function EditPage() {


  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [activeCapsule, setActiveCapsule] = useState<Capsule | null>(null);
  const [machine, setMachine] = useState<Machine | null>(null);

  useEffect(() => {
    async function load() {
      if (!id) {
        setMachine({
          id: crypto.randomUUID(),
          capsules: [],
          isFinalized: false,
        });
        return;
      }

      const { data } = await supabase
        .from("machines")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setMachine(data.data);
      } else {
        setMachine({
          id: id as string,
          capsules: [],
          isFinalized: false,
        });
      }
    }

    load();
  }, [id]);

  
  if (!machine) return <p>Loading...</p>;

  function addCapsule() {
    if (!machine || machine.capsules.length >= 9) return;

    const newCapsule: Capsule = {
      id: crypto.randomUUID(),
      trinket: "",
      images: [],
    };

    setMachine(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        capsules: [...prev.capsules, newCapsule],
      };
    });

    setActiveCapsule(newCapsule);
  }

  function deleteCapsule(id: string) {
    setMachine(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        capsules: prev.capsules.filter(c => c.id !== id),
      };
    });
  }

  async function finalizeMachine() {
  if (!machine) return;

  const updated = {
    ...machine,
    isFinalized: true,
  };

  console.log("1. Saving machine:", updated);

  const { data, error } = await supabase.from("machines").upsert({
    id: updated.id,
    data: updated,
    is_finalized: true,
  });

  console.log("2. Supabase upsert result:", { data, error });

  if (error) {
    console.error("SAVE FAILED:", error);
    return; // don't redirect if save failed
  }

  router.push(`/preview/${updated.id}`);
}

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-11">
        <div className="w-78 h-78 mt-33.5
          border-3 border-dashed border-(--primary) 
          rounded-3xl">
            <div className="grid grid-cols-3 ">
              {machine.capsules.map(capsule => (
                <div key={capsule.id} className="border p-2">
                      <div
                        key={capsule.id}
                        className="border p-4 cursor-pointer"
                        onClick={() => setActiveCapsule(capsule)}
                      >
                        <p>Capsule</p>
                      </div>

                  <button className="cursor-pointer"
                    onClick={() => deleteCapsule(capsule.id)}>
                    x
                  </button>
                </div>
              ))}
      </div>
        </div>
        <button className="w-39 h-39 bg-(--primary)
          rounded-[100%] text-white text-[50px] cursor-pointer"
          onClick={addCapsule} >
          +
        </button>
        <button
          className="mt-4 px-4 py-2 bg-black text-white rounded"
          onClick={finalizeMachine}
        >
          Finalize Machine
      </button>
      </div>

      {activeCapsule && (
        <CapsuleModal
          capsule={activeCapsule}
          onClose={() => setActiveCapsule(null)}
          onSave={(updated) => {
            setMachine(prev => {
              if (!prev) return prev;

              return {
                ...prev,
                capsules: prev.capsules.map(c =>
                  c.id === updated.id ? updated : c
                ),
              };
            });
          }}
        />
      )}
    </>
  );
}