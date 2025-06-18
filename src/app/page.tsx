
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Palette, FolderKanban, Lightbulb } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// AppHeader is removed as it's now in RootLayout

export default function HomePage() {
  const features = [
    {
      icon: <Palette className="h-8 w-8 mb-4 text-accent" />,
      title: 'Centralized Brand Assets',
      description: 'Access all your brand files, logos, and guidelines in one organized place.',
    },
    {
      icon: <FolderKanban className="h-8 w-8 mb-4 text-accent" />,
      title: 'Project Tracking',
      description: 'Stay updated on project progress with clear status indicators and timelines.',
    },
    {
      icon: <CheckCircle className="h-8 w-8 mb-4 text-accent" />,
      title: 'Seamless Feedback',
      description: 'Request updates and provide feedback directly on assets and projects.',
    },
    {
      icon: <Lightbulb className="h-8 w-8 mb-4 text-accent" />,
      title: 'AI-Powered Suggestions',
      description: 'Get smart recommendations for new assets to enhance your brand kit.',
    },
  ];

  return (
    // Removed outer div flex flex-col min-h-screen, handled by RootLayout
    <>
      {/* AppHeader removed from here */}
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary via-purple-700 to-accent text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl md:text-6xl font-bold mb-6">
            Welcome to Brand Hub
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Your all-in-one platform for managing brand assets, tracking projects, and collaborating seamlessly.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild className="bg-background text-primary hover:bg-background/90">
              <Link href="/login">Access Your Hub</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Why Choose Brand Hub?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-center">{feature.icon}</div>
                  <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Placeholder Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2">
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Visualize Your Brand's Potential
              </h2>
              <p className="text-lg mb-6 text-muted-foreground">
                Brand Hub provides a clear and intuitive interface to manage your assets effectively. See everything at a glance, from file previews to project statuses.
              </p>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Explore Features
              </Button>
            </div>
            <div className="lg:w-1/2 mt-8 lg:mt-0">
              <Image
                src="https://placehold.co/600x400.png"
                alt="Brand Hub Interface Preview"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
                data-ai-hint="dashboard interface"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Footer removed from here, it's now in RootLayout */}
    </>
  );
}
