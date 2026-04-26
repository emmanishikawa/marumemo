"use client";

import { useState } from "react";
import { Capsule } from "@/src/types/capsule";

export default function EditPage() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);

  return <div>Edit Machine</div>;
}