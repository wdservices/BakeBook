
import type { Metadata } from 'next';
import { Belleza, Alegreya } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Bakebook - Your Baking Companion',
  description: 'BakeBook: Organize, store, and manage your baking recipes digitally. Track ingredients, generate receipts, and enjoy a seamless baking experience.',
};

const belleza = Belleza({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-belleza',
});

const alegreya = Alegreya({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-alegreya',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head />
      <body 
        className={cn(
          "font-body antialiased flex flex-col min-h-screen",
          belleza.variable,
          alegreya.variable
        )}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
