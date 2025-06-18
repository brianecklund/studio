
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <Button asChild variant="outline">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-2xl">Documents</CardTitle>
          </div>
          <CardDescription>
            Review project contracts, billing information, and other important documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-16 w-16 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">
              Document management features will be available here soon.
            </p>
            <p className="text-sm text-muted-foreground">
              This section will provide access to important files like contracts and billing statements.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
