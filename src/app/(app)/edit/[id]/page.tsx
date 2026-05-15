"use client"

import { Capsule } from "@/src/types/capsule";
import CapsuleModal from "@/src/components/CapsuleModal";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";
import { Machine } from "@/src/types/machine";
import { useParams } from "next/navigation";
import Button from "@/src/components/Button";

const CAPSULE_IMAGES = [
  "/assets/capsules/cap-1.png",
  "/assets/capsules/cap-2.png",
  "/assets/capsules/cap-3.png",
  "/assets/capsules/cap-4.png",
  "/assets/capsules/cap-5.png",
  "/assets/capsules/cap-6.png",
  "/assets/capsules/cap-7.png",
  "/assets/capsules/cap-8.png",
  "/assets/capsules/cap-9.png",
  "/assets/capsules/cap-10.png",
];

export default function EditPage() {


  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [saving, setSaving] = useState(false);

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

    const randomImage = CAPSULE_IMAGES[Math.floor(Math.random() * CAPSULE_IMAGES.length)];


    const newCapsule: Capsule = {
      id: crypto.randomUUID(),
      trinket: "",
      images: [],
      capsuleImage: randomImage,
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
      setSaving(true);  // immediate feedback

      const updated = { ...machine, isFinalized: false };

      const { error } = await supabase.from("machines").upsert({
          id: updated.id,
          data: updated,
          is_finalized: false,
      });

      if (error) {
          console.error("SAVE FAILED:", error);
          setSaving(false);
          return;
      }

      router.push(`/preview/${updated.id}`);
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-11">
        <div className="w-full flex flex-row items-center justify-center">
          <Button
              variant="primary"
              onClick={finalizeMachine}
              disabled={saving}
          >
              {saving ? "loading..." : "preview"}
          </Button>
          <Button variant="border"
            onClick={addCapsule} >
            + add capsule
          </Button>
        </div>
        <div className="w-80 h-80 mt-2
          border-3 border-dashed border-(--primary) 
          rounded-3xl">
            <div className="grid grid-cols-3 ">
              {machine.capsules.map(capsule => (
                <div key={capsule.id} className="border p-1">
                  <button className="w-5 h-5 rounded-sm cursor-pointer bg-(--primary) text-white"
                    onClick={() => deleteCapsule(capsule.id)}>
                    x
                  </button>
                  <div
                    key={capsule.id}
                    className="cursor-pointer border"
                    onClick={() => setActiveCapsule(capsule)}
                  >
                    <img src={capsule.capsuleImage} 
                      className="w-full h-full object-fill" />
                  </div>
                </div>
              ))}
          </div>
        </div>
        <img className="mt-3" src="/assets/handle.png"/>
        
      </div>

      {activeCapsule && (
        <CapsuleModal
          capsule={activeCapsule}
          onClose={(hasImages) => {
            if (!hasImages) {
              const saved = machine?.capsules.find(c => c.id === activeCapsule?.id);
              if (!saved || saved.images.length === 0) {
                deleteCapsule(activeCapsule!.id);
              }
            }
            setActiveCapsule(null);
          }}
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