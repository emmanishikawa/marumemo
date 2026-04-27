"use client"

import { Capsule } from "@/src/types/capsule";
import CapsuleModal from "@/src/components/CapsuleModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Machine } from "@/src/types/machine";

export default function EditPage() {

  const [activeCapsule, setActiveCapsule] = useState<Capsule | null>(null);

  const [machine, setMachine] = useState<Machine>({
    id: crypto.randomUUID(),
    capsules: [],
    isFinalized: false,
  });

  function addCapsule() {
    if (machine.capsules.length >= 9) return;

    const newCapsule: Capsule = {
      id: crypto.randomUUID(),
      trinket: "",
      images: [],
    };

    setMachine(prev => ({
      ...prev,
      capsules: [...prev.capsules, newCapsule],
    }));

    setActiveCapsule(newCapsule);
  }

  function deleteCapsule(id: string) {
    setMachine(prev => ({
      ...prev,
      capsules: prev.capsules.filter(c => c.id !== id),
    }));
  }

  const router = useRouter();

  function goToPreview() {
    localStorage.setItem("machine", JSON.stringify(machine));
    router.push("/preview");
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
          onClick={() => {
            const updatedMachine = {
              ...machine,
              isFinalized: true,
            };

            setMachine(updatedMachine);

            localStorage.setItem("machine", JSON.stringify(updatedMachine));
            router.push("/preview");
          }}
        >
          Finalize Machine
        </button>
      </div>

      {activeCapsule && (
        <CapsuleModal
          capsule={activeCapsule}
          onClose={() => setActiveCapsule(null)}
          onSave={(updated) => {
            setMachine(prev => ({
              ...prev,
              capsules: prev.capsules.map(c =>
                c.id === updated.id ? updated : c
              ),
            }));
          }}
        />
      )}
    </>
  );
}