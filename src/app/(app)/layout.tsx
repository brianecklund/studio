
// AppHeader import removed as it's now in RootLayout

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Removed min-h-screen and flex flex-col, as RootLayout handles overall page structure
    // AppHeader removed from here
    <div className="flex-1 container py-8"> {/* Ensure content within (app) also grows */}
      {children}
    </div>
  );
}
