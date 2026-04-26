export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <div
      className="min-h-screen flex justify-center bg-center bg-contain bg-no-repeat"
      style={{ backgroundImage: "url('/background/machine_bg.png')" }}
    >
      <div className="w-full max-w-sm min-h-screen">
        {children}
      </div>
    </div>
  );
}