
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChefHat, Search, PlusCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-var(--header-height,10vh)-var(--footer-height,10vh))] flex flex-col items-center justify-center text-center p-4 overflow-hidden -mt-8 -mb-8">
      {/* Background Image */}
      <Image
        src="https://placehold.co/1920x1080.png?text=Delicious+Cake"
        alt="Delicious Cake Background"
        layout="fill"
        objectFit="cover"
        quality={80}
        className="z-0 opacity-20"
        data-ai-hint="cake bakery"
      />
      
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-background/70 z-10"></div>

      {/* Content */}
      <div className="relative z-20 animate-fade-in space-y-8">
        <div className="flex justify-center">
          <ChefHat size={128} className="text-primary animate-scale-in" style={{ animationDelay: '0.2s' }} />
        </div>
        
        <h1 className="text-6xl md:text-7xl font-headline font-bold tracking-tight text-foreground animate-scale-in" style={{ animationDelay: '0.4s' }}>
          Welcome to <span className="bg-gradient-to-r from-primary to-[hsl(var(--blue))] bg-clip-text text-transparent">Bakebook</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
          Your ultimate culinary companion. Discover thousands of recipes, create your own, and share your masterpieces with a vibrant community of food lovers.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <Link href="/recipes">
            <Button size="lg" className="text-lg px-8 py-6">
              <Search className="mr-2 h-5 w-5" /> Explore Recipes
            </Button>
          </Link>
          <Link href="/recipes/new">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary/10">
              <PlusCircle className="mr-2 h-5 w-5" /> Add Your Recipe
            </Button>
          </Link>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="p-6 bg-card/80 rounded-lg shadow-lg">
            <h3 className="text-2xl font-headline text-primary mb-2">Endless Inspiration</h3>
            <p className="text-muted-foreground">From quick weeknight dinners to elaborate holiday feasts, find recipes for every occasion.</p>
          </div>
          <div className="p-6 bg-card/80 rounded-lg shadow-lg">
            <h3 className="text-2xl font-headline text-primary mb-2">Personalized Collection</h3>
            <p className="text-muted-foreground">Save your favorite recipes, organize them into collections, and track your cooking progress.</p>
          </div>
          <div className="p-6 bg-card/80 rounded-lg shadow-lg">
            <h3 className="text-2xl font-headline text-primary mb-2">Share Your Passion</h3>
            <p className="text-muted-foreground">Contribute your own culinary creations and connect with fellow food enthusiasts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
