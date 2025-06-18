import AppHeader from '@/components/layout/app-header';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container py-8">
        {children}
      </main>
    </div>
  );
}
