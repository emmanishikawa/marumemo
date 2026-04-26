"use client"

import { Capsule } from "@/src/types/capsule";
import CapsuleModal from "@/src/components/CapsuleModal";
import { useState } from "react";

export default function EditPage() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [activeCapsule, setActiveCapsule] = useState<Capsule | null>(null);

  function addCapsule(){
    if (capsules.length >= 9) return;

    const newCapsule: Capsule = {
      id: crypto.randomUUID(),
      trinket: "",
      images: [],
    };

    setCapsules(prev => [...prev, newCapsule]);
    setActiveCapsule(newCapsule);
  }

  function deleteCapsule(id: string) {
    setCapsules(prev => prev.filter(c => c.id !== id));
  }

  
  

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-11">
        <div className="w-78 h-78 mt-33.5
          border-3 border-dashed border-(--primary) 
          rounded-3xl">
            <div className="grid grid-cols-3 ">
              {capsules.map(capsule => (
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
      </div>

      {activeCapsule && (
        <CapsuleModal
          capsule={activeCapsule}
          onClose={() => setActiveCapsule(null)}
          onSave={(updated) => {
            setCapsules(prev =>
              prev.map(c => (c.id === updated.id ? updated : c))
            );
      }}
  />
)}
    </>
  );
}