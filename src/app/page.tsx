//TODO FIX LAYOUT
"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <>
    <main className="flex flex-col items-center justify-start h-full">
      {/* title group */}
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-center text-[40px] tracking-[30%]">marumemo</h1>
        <h2　className="text-center text-[20px] tracking-[250%]">マルメモ</h2>
      </div>

      {/* create button */}
      <button className="w-46.25 h-20 gjustify-center
        bg-(--secondary) active:bg-(--primary) 
      text-white text-[25px] 
        border-2 border-solid border-(--primary) rounded-[10px]"
        onClick={() => router.push("/edit")}>
          create
      </button>
    </main>
      
    </>
  );
}
