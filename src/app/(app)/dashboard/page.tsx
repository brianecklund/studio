
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, FileText as FileTextIcon, FolderKanban, BookOpen, ArrowRight } from 'lucide-react'; // Renamed FileText to FileTextIcon to avoid conflict

interface DashboardItem {
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
  linkText: string;
}

const dashboardItems: DashboardItem[] = [
  {
    title: 'Brand Kit',
    description: 'Access logos, icons, artwork, photography, and brand documentation.',
    icon: Package,
    link: '/dashboard/brand-kit',
    linkText: 'View Brand Kit',
  },
  {
    title: 'Templates',
    description: 'Find guides, documentation, template design files, and Canva references.',
    icon: FileTextIcon, // Using renamed import
    link: '/dashboard/templates',
    linkText: 'Access Templates',
  },
  {
    title: 'Projects',
    description: 'Track current projects, view planned work, and reference completed projects.',
    icon: FolderKanban,
    link: '/dashboard/projects',
    linkText: 'Manage Projects',
  },
  {
    title: 'Documents',
    description: 'Review project contracts, billing information, and other important documents.',
    icon: BookOpen,
    link: '/dashboard/documents',
    linkText: 'View Documents',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">Client Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome! Access your brand assets, templates, projects, and documents.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {dashboardItems.map((item) => (
          <Card key={item.title} className="flex flex-col hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
              <item.icon className="h-10 w-10 text-primary mt-1" />
              <div className="flex-1">
                <CardTitle className="font-headline text-xl">{item.title}</CardTitle>
                <CardDescription className="mt-1">{item.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Additional content for the card can go here if needed */}
            </CardContent>
            <CardFooter className="pt-4">
              <Button asChild className="w-full">
                <Link href={item.link}>
                  {item.linkText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
