"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChefHat, Search, PlusCircle, BookOpen, Smile, LibraryBig, ClipboardList, ReceiptText, Users2, Sparkles, MonitorSmartphone, UserPlus, Edit3, FileText } from 'lucide-react';
import { getAllUsersFromFirestore } from '@/lib/firestoreService';
import { useEffect, useState } from 'react';
import type { User } from '@/types';

function getCurrentMonthYear() {
  const now = new Date();
  return { month: now.getMonth(), year: now.getFullYear() };
}

function isDonationThisMonth(dateStr: string | null | undefined) {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const { month, year } = getCurrentMonthYear();
  return date.getMonth() === month && date.getFullYear() === year;
}

function BestDonorCallout() {
  const [bestDonor, setBestDonor] = useState<User | null>(null);

  useEffect(() => {
    async function fetchBestDonor() {
      const users = await getAllUsersFromFirestore();
      const monthlyDonors = users.filter(u => u.lastDonationAmount && isDonationThisMonth(u.lastDonationDate));
      if (monthlyDonors.length === 0) return;
      const topDonor = monthlyDonors.reduce((prev, curr) =>
        (curr.lastDonationAmount! > (prev.lastDonationAmount || 0) ? curr : prev)
      );
      setBestDonor(topDonor);
    }
    fetchBestDonor();
  }, []);

  if (!bestDonor) return null;
  return (
    <div className="bg-gradient-to-r from-yellow-100 to-yellow-300 border border-yellow-400 rounded-lg p-4 mb-8 text-center animate-fade-in">
      <h2 className="text-2xl font-bold text-yellow-800 mb-2">🌟 Best Donor of the Month 🌟</h2>
      <p className="text-lg text-yellow-900 font-semibold">Thank you, {bestDonor.brandName || bestDonor.name || bestDonor.email}!</p>
      <p className="text-yellow-800">Your generosity keeps BakeBook running for everyone. We appreciate you!</p>
    </div>
  );
}

export default function HomePage() {
  const features = [
    {
      icon: LibraryBig,
      title: "Digital Recipe Storage",
      description: "Store all your baking recipes in one place, organized and easily accessible.",
      dataAiHint: "digital recipe book"
    },
    {
      icon: ClipboardList,
      title: "Ingredient Tracking",
      description: "Check off ingredients as you use them to stay organized during baking.",
      dataAiHint: "baking checklist"
    },
    {
      icon: Users2,
      title: "Baker Community",
      description: "Follow your favorite bakers, share tips, and discover new recipes.",
      dataAiHint: "baking community"
    },
    {
      icon: ReceiptText,
      title: "Sell Your Recipes (Coming Soon!)",
      description: "Monetize your unique baking creations by selling them to other bakers.",
      dataAiHint: "sell recipes"
    },
    {
      icon: Sparkles,
      title: "AI Baking Assistant",
      description: "Get smart suggestions for baking times, temperatures, and ingredient substitutions.",
      dataAiHint: "ai cooking"
    },
    {
      icon: MonitorSmartphone,
      title: "Cross-Device Access",
      description: "Access your recipes from any device, anytime, anywhere.",
      dataAiHint: "multi device"
    }
  ];

  const howItWorksSteps = [
    {
      number: 1,
      icon: UserPlus,
      title: "Sign Up",
      description: "Create your baker account in seconds and set up your brand."
    },
    {
      number: 2,
      icon: Edit3,
      title: "Add Recipes",
      description: "Input your cherished baking recipes with ingredients, measurements, and instructions."
    },
    {
      number: 3,
      icon: FileText,
      title: "Organize & Bake",
      description: "Use BakeBook to keep your recipes tidy and guide your baking sessions."
    },
    {
      number: 4,
      icon: Users2, 
      title: "Connect & Share",
      description: "Follow other bakers, share tips, and build your baking network."
    }
  ];

  const testimonials = [
    {
      quote: "BakeBook has completely transformed how I manage my baking recipes. It's so easy to use!",
      author: "Sarah, Home Baker",
      dataAiHint: "positive review"
    },
    {
      quote: "Finally, a dedicated app for us bakers! The digital storage is a lifesaver.",
      author: "John, Professional Pastry Chef",
      dataAiHint: "baker testimonial"
    }
  ];

  return (
    <>
      <BestDonorCallout />
      <div 
        className="w-full relative min-h-[calc(100vh-var(--header-height,10vh)-var(--footer-height,10vh))] flex flex-col items-center justify-center text-center p-4 overflow-hidden -mt-8 -mb-8"
      >
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-background/85 z-10"></div>

        {/* Content */}
        <div className="relative z-20 animate-fade-in space-y-12 py-12 w-full"> 
          <div className="flex justify-center">
            <ChefHat size={128} className="text-primary animate-scale-in" style={{ animationDelay: '0.2s' }} />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-headline font-bold tracking-tight text-foreground animate-scale-in" style={{ animationDelay: '0.4s' }}>
            Welcome to <span className="bg-gradient-to-r from-primary to-[hsl(var(--blue))] bg-clip-text text-transparent hover:from-[hsl(var(--blue))] hover:to-primary transition-all duration-300 ease-in-out">Bakebook</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground w-full max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
            BakeBook is the ultimate app for bakers who want to organize, store, and manage their recipes digitally. Say goodbye to messy paper notes and hello to a seamless baking experience. With BakeBook, you can easily store your recipes, track ingredients, generate receipts, and access your favorite recipes anytime, anywhere. Whether you&apos;re a home baker or a professional, BakeBook is designed to make your baking journey easier and more enjoyable.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Link href="/recipes">
              <Button size="lg" className="text-lg px-8 py-6">
                <Search className="mr-2 h-5 w-5" /> Explore Baking Recipes
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary/10">
                <UserPlus className="mr-2 h-5 w-5" /> Join the Bakers!
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="p-6 bg-card/80 rounded-lg shadow-lg flex flex-col items-center">
              <BookOpen size={48} className="text-primary mb-3"/>
              <h3 className="text-2xl font-headline text-primary mb-2">Your Digital Recipe Hub</h3>
              <p className="text-muted-foreground">Easily organize, store, and manage all your baking recipes in one place. Access them anytime, anywhere.</p>
            </div>
            <div className="p-6 bg-card/80 rounded-lg shadow-lg flex flex-col items-center">
              <Users2 size={48} className="text-primary mb-3"/>
              <h3 className="text-2xl font-headline text-primary mb-2">Connect with Bakers</h3>
              <p className="text-muted-foreground">Share your baking tips, follow your favorite bakers, and become part of a vibrant community.</p>
            </div>
            <div className="p-6 bg-card/80 rounded-lg shadow-lg flex flex-col items-center">
              <Smile size={48} className="text-primary mb-3"/>
              <h3 className="text-2xl font-headline text-primary mb-2">Bake with Joy</h3>
              <p className="text-muted-foreground">Focus on the joy of baking, not the hassle. BakeBook makes your baking journey smoother and more enjoyable.</p>
            </div>
          </div>

          {/* Why Choose BakeBook Section */}
          <section className="w-full py-12 md:py-16 animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <h2 className="text-4xl md:text-5xl font-headline text-center mb-12 bg-gradient-to-r from-primary to-[hsl(var(--blue))] bg-clip-text text-transparent hover:from-[hsl(var(--blue))] hover:to-primary transition-all duration-300 ease-in-out">
              Why Choose BakeBook?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="p-6 bg-card rounded-xl shadow-xl flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  data-ai-hint={feature.dataAiHint}
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-[hsl(var(--blue))]/20 rounded-full mb-5">
                    <feature.icon size={32} className="text-[hsl(var(--blue))]" />
                  </div>
                  <h3 className="text-2xl font-headline text-card-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How BakeBook Works Section */}
          <section className="w-full py-12 md:py-16 animate-fade-in" style={{ animationDelay: '1.4s' }}>
            <h2 className="text-4xl md:text-5xl font-headline text-center mb-16 bg-gradient-to-r from-primary to-[hsl(var(--blue))] bg-clip-text text-transparent hover:from-[hsl(var(--blue))] hover:to-primary transition-all duration-300 ease-in-out">
              How BakeBook Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 w-full max-w-6xl mx-auto">
              {howItWorksSteps.map((step, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-[hsl(var(--blue))] rounded-full mb-6 text-blue-foreground text-2xl font-bold shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-headline text-card-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed px-2">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What Our Users Say Section */}
          <section className="w-full py-12 md:py-16 animate-fade-in" style={{ animationDelay: '1.6s' }}>
            <h2 className="text-4xl md:text-5xl font-headline text-center mb-12 bg-gradient-to-r from-primary to-[hsl(var(--blue))] bg-clip-text text-transparent hover:from-[hsl(var(--blue))] hover:to-primary transition-all duration-300 ease-in-out">
              What Our Bakers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="p-8 bg-card rounded-xl shadow-xl flex flex-col text-left transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  data-ai-hint={testimonial.dataAiHint}
                >
                  <p className="text-lg text-card-foreground mb-6 leading-relaxed italic">&quot;{testimonial.quote}&quot;</p>
                  <p className="text-muted-foreground text-sm font-medium self-end">&mdash; {testimonial.author}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
