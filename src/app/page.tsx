export default function Home() {
  return (
    <>
    <div className="flex flex-col items-center justify-start h-full">
      <h1 className="text-center my-40 text-[40px] tracking-[30%]">marumemo</h1>
      <button className="w-46.25 h-20 justify-center
        bg-(--secondary) active:bg-(--primary) 
      text-white text-[25px] 
        border-2 border-solid border-(--primary) rounded-[10px] ">
          create
      </button>
    </div>
      
    </>
  );
}
