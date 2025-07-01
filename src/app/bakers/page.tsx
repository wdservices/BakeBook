
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockUsers } from '@/data/mockUsers';
import type { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users2, Mail } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';

export default function BakersPage() {
  const [bakers, setBakers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate fetching data
    setTimeout(() => {
      setBakers(mockUsers); // For now, all users are considered potential bakers to list
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Spinner size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <Users2 size={40} className="text-primary" />
        <h1 className="text-4xl font-headline bg-gradient-to-r from-primary to-[hsl(var(--blue))] bg-clip-text text-transparent hover:from-[hsl(var(--blue))] hover:to-primary transition-all duration-300 ease-in-out">
          Meet Our Talented Bakers
        </h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Discover and connect with the amazing bakers on Bakebook.
      </p>

      {bakers.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {bakers.map((baker) => (
            <div 
              key={baker.id} 
              className="flex flex-col sm:flex-row items-start sm:items-center p-4 border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card space-y-3 sm:space-y-0 sm:space-x-4 animate-scale-in group"
            >
              <Avatar className="h-20 w-20 border-2 border-primary group-hover:border-[hsl(var(--blue))] transition-colors duration-300">
                <AvatarImage 
                  src={(baker.brandName || baker.name) ? `https://ui-avatars.com/api/?name=${encodeURIComponent(baker.brandName || baker.name || '')}&color=fff&size=128` : undefined} 
                  alt={baker.brandName || baker.name || 'Baker'} 
                />
                <AvatarFallback className="text-2xl bg-muted">
                  {baker.brandName ? baker.brandName.substring(0, 2).toUpperCase() : baker.name ? baker.name.substring(0, 2).toUpperCase() : baker.email.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <h3 className="text-xl font-headline text-primary group-hover:text-[hsl(var(--blue))] transition-colors">{baker.brandName || 'No Brand Name'}</h3>
                {baker.name && <p className="text-md text-muted-foreground">{baker.name}</p>}
                <p className="text-sm text-muted-foreground mt-1">{baker.email}</p>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  A passionate member of the Bakebook community. Ready to share tips and recipes!
                </p>
              </div>
              <Button asChild variant="outline" className="sm:self-center mt-3 sm:mt-0 w-full sm:w-auto group-hover:bg-primary/10 group-hover:border-primary group-hover:text-primary transition-colors">
                <Link href={`mailto:${baker.email}?subject=Message%20from%20Bakebook%20User&body=Hi%20${encodeURIComponent(baker.brandName || baker.name || 'Baker')},%0D%0A%0D%0A`}>
                  <Mail size={18} className="mr-2" /> Message {baker.brandName || baker.name || 'Baker'}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <Users2 size={64} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">No bakers found yet.</p>
          <p className="text-sm text-muted-foreground">Check back later to see who has joined our community!</p>
        </div>
      )}
    </div>
  );
}
