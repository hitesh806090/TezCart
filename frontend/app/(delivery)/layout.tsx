import "../globals.css";

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* Main Content Area */}
      <main className="flex-1 w-full pl-0">
        <div className="w-full p-0">
          {children}
        </div>
      </main>
    </div>
  );
}