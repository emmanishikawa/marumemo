"use client";
import { useState, useRef } from "react";
import type { Capsule } from "@/src/types/capsule";
import Canvas from "./Canvas";
import Button from "./Button";

type Props = {
    capsule: Capsule;
    onClose: (hasImages: boolean) => void;
    onSave: (updated: Capsule) => void;
};


export default function CapsuleModal({ capsule, onClose, onSave }: Props) {

    const [step, setStep] = useState<1 | 2>(1);

    const [trinket, setTrinket] = useState(capsule.trinket);
    const [images, setImages] = useState(capsule.images);

    const canvasRef = useRef<any>(null);

    function handleSave() {
        onSave({
            ...capsule,
            trinket,
            images,
        });

        onClose(true);
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
            <div className="flex flex-col items-center justify-center bg-white p-6 w-100 rounded-xl">

                <h2 className="text-xl mb-4">Edit Capsule</h2>

                {step === 1 && (
                <div>
                    <p>step 1: draw trinket</p>

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
                    <div className="w-full">
                        <p>step 2: add images</p>
                        <p className="text-[12px]">minimum 1 image</p>
                        <Button variant="border"
                            onClick={() => document.getElementById("imageUpload")?.click()}
                            >
                            + add memory
                        </Button>

                        <div className="flex flex-row overflow-x-auto gap-2 pb-2">
                            <input
                                id="imageUpload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleUpload}
                            />
                            {images.map(img => (
                                <div key={img.id} className="shrink-0">
                                    <div className="flex flex-row">
                                        <div className="w-54 m-2 p-2 rounded border border-(--primary)">
                                            <img src={img.url} className="w-50" />
                                            <input
                                                value={img.caption || ""}
                                                placeholder="add description"
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
                                        </div>
                                        <Button variant="symbol"
                                            onClick={() =>
                                            setImages(prev => prev.filter(i => i.id !== img.id))
                                            }
                                        >
                                            x
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            </div>
                    </div>
                    
                )}


                <div className="flex flex-row align-right items-center self-end">
                    <Button variant="symbol" 
                        onClick={() => onClose(false)}>x</Button>

                    <Button variant="symbol" onClick={handleSave}
                        disabled={images.length === 0}>v</Button>
                </div>

            </div>
        </div>
        
    );
}
