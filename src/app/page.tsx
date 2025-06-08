
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChefHat, Search, PlusCircle, BookOpen, PackageCheck, Smile } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-var(--header-height,10vh)-var(--footer-height,10vh))] flex flex-col items-center justify-center text-center p-4 overflow-hidden -mt-8 -mb-8">
      {/* Background Image */}
      <Image
        src="https://placehold.co/1920x1080.png?text=Artisan+Bread"
        alt="Artisan Bread Background"
        layout="fill"
        objectFit="cover"
        quality={80}
        className="z-0 opacity-20"
        data-ai-hint="artisan bread baking"
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
          BakeBook is the ultimate app for bakers who want to organize, store, and manage their recipes digitally. Say goodbye to messy paper notes and hello to a seamless baking experience. With BakeBook, you can easily store your recipes, track ingredients, generate receipts, and access your favorite recipes anytime, anywhere. Whether you&apos;re a home baker or a professional, BakeBook is designed to make your baking journey easier and more enjoyable.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <Link href="/recipes">
            <Button size="lg" className="text-lg px-8 py-6">
              <Search className="mr-2 h-5 w-5" /> Explore Your Recipes
            </Button>
          </Link>
          <Link href="/recipes/new">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary/10">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Recipe
            </Button>
          </Link>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="p-6 bg-card/80 rounded-lg shadow-lg flex flex-col items-center">
            <BookOpen size={48} className="text-primary mb-3"/>
            <h3 className="text-2xl font-headline text-primary mb-2">Your Digital Recipe Hub</h3>
            <p className="text-muted-foreground">Easily organize, store, and manage all your baking recipes in one place. Access them anytime, anywhere.</p>
          </div>
          <div className="p-6 bg-card/80 rounded-lg shadow-lg flex flex-col items-center">
            <PackageCheck size={48} className="text-primary mb-3"/>
            <h3 className="text-2xl font-headline text-primary mb-2">Streamlined Baking Tools</h3>
            <p className="text-muted-foreground">Track ingredients effortlessly, manage your baking projects, and even generate receipts for your sales or records.</p>
          </div>
          <div className="p-6 bg-card/80 rounded-lg shadow-lg flex flex-col items-center">
            <Smile size={48} className="text-primary mb-3"/>
            <h3 className="text-2xl font-headline text-primary mb-2">Bake with Joy</h3>
            <p className="text-muted-foreground">Focus on the joy of baking, not the hassle. BakeBook makes your baking journey smoother and more enjoyable.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
