import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from "@/components/ui/tooltip";
import AppHeader from '@/components/layout/app-header'; // Added AppHeader import

export const metadata: Metadata = {
  title: 'Side Brain',
  description: 'Your central place for brand assets and project management by Side Brain Studios.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <TooltipProvider>
          <AppHeader /> {/* Added AppHeader component */}
          <main className="flex-grow flex flex-col"> {/* Ensure main content can grow */}
            {children}
          </main>
          {/* Footer moved from homepage to be global */}
          <footer className="py-8 border-t bg-background">
            <div className="container mx-auto px-4 text-center text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} Side Brain. All rights reserved.</p>
            </div>
          </footer>
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
