"use client";
import { useState } from "react";
import type { Capsule } from "@/src/types/capsule";

type Props = {
    capsule: Capsule;
    onClose: () => void;
    onSave: (updated: Capsule) => void;
};

export default function CapsuleModal({ capsule, onClose, onSave }: Props) {

    const [step, setStep] = useState<1 | 2>(1);

    const [trinket, setTrinket] = useState(capsule.trinket);
    const [images, setImages] = useState(capsule.images);

    function handleSave() {
        onSave({
            ...capsule,
            trinket,
            images,
        });

        onClose();
    }

    return (
        <div className="fixed inset-0 bg-(--primary)/50 flex items-center justify-center">
        <div className="bg-white p-6 w-100 rounded-xl">

            <h2 className="text-xl mb-4">Edit Capsule</h2>

            <p>Capsule ID: {capsule.id}</p>

            {step === 1 && (
            <div>
                <p>Step 1: Draw Trinket</p>

                <button onClick={() => setStep(2)}>
                Next
                </button>
            </div>
            )}

            {step === 2 && (
                <div>
                    <p>Step 2: Add Images</p>

                    <button onClick={() => setStep(1)}>
                    Back
                    </button>
                </div>
            )}

            <button onClick={onClose} 
                className="mt-4 cursor-pointer">
                x
            </button>

            <button onClick={handleSave}>
                v
            </button>

        </div>
        </div>
        
    );
}

function onSave(arg0: { drawing: string; images: { id: string; url: string; caption?: string; }[]; id: string; trinket: string; }) {
    throw new Error("Function not implemented.");
}
