
// AppHeader import removed as it's now in RootLayout

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Removed min-h-screen and flex flex-col, as RootLayout handles overall page structure
    // AppHeader removed from here
    // Removed 'container' class to allow full width, added 'w-full' and 'px-4' for padding.
    <div className="flex-1 w-full px-4 py-8"> 
      {children}
    </div>
  );
}
