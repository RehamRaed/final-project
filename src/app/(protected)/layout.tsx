export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-800 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="container">
          <h1 className="text-xl font-bold">Main Dashboard</h1>
        </div>
      </header>

      <main className="p-6">{children}</main>
    </div>
  );
}

