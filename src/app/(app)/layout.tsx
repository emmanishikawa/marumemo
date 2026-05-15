export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center min-h-screen">
      <div
        className="w-full max-w-sm min-h-screen bg-contain bg-no-repeat bg-top"
        style={{ backgroundImage: "url('/background/machine_bg.png')" }}
      >
        {children}
      </div>
    </div>
  );
}