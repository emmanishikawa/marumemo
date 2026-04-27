"use client";
import { useState, useRef, useEffect } from "react";
import type { Capsule } from "@/src/types/capsule";
import Canvas from "./Canvas";

type Props = {
    capsule: Capsule;
    onClose: () => void;
    onSave: (updated: Capsule) => void;
};

export default function CapsuleModal({ capsule, onClose, onSave }: Props) {

    const [step, setStep] = useState<1 | 2>(1);

    const [trinket, setTrinket] = useState(capsule.trinket);
    const [images, setImages] = useState(capsule.images);

    const canvasRef = useRef<any>(null);
    
    function save() {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dataUrl = canvas.toDataURL("image/png");

        console.log("saved:", dataUrl);

        setTrinket(dataUrl);
    }

    function handleSave() {
        onSave({
            ...capsule,
            trinket,
            images,
        });

        onClose();
    }

    function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (images.length >= 10) return;

        const url = URL.createObjectURL(file);

        setImages(prev => [
            ...prev,
            {
            id: crypto.randomUUID(),
            url,
            caption: "",
            },
        ]);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center
            bg-(--primary)/50 p-4">
            <div className="bg-white p-6 w-100 rounded-xl">

                <h2 className="text-xl mb-4">Edit Capsule</h2>

                <p>Capsule ID: {capsule.id}</p>

                {step === 1 && (
                <div>
                    <p>Step 1: Draw Trinket</p>

                    <Canvas
                        initialData={trinket}
                        onSave={(dataUrl) => {
                            setTrinket(dataUrl);
                            setStep(2);
                        }}
                    />
                </div>
                )}

                {step === 2 && (
                    <div>
                        <p>Step 2: Add Images</p>
                        <button
                            onClick={() => document.getElementById("imageUpload")?.click()}
                            className="border px-3 py-2 rounded"
                            >
                            + Add Image
                        </button>

                        <div className="max-h-[40vh] overflow-y-auto">
                            <input
                                id="imageUpload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleUpload}
                            />
                            {images.map(img => (
                                <div key={img.id}>
                                    <img src={img.url} />

                                    <input
                                    value={img.caption || ""}
                                    onChange={(e) =>
                                        setImages(prev =>
                                        prev.map(i =>
                                            i.id === img.id
                                            ? { ...i, caption: e.target.value }
                                            : i
                                        )
                                        )
                                    }
                                    />

                                    <button
                                    onClick={() =>
                                        setImages(prev =>
                                        prev.filter(i => i.id !== img.id)
                                        )
                                    }
                                    >
                                    delete
                                    </button>
                                </div>
                                
                                ))}
                        </div>
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
