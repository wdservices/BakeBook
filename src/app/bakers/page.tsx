
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockUsers } from '@/data/mockUsers';
import type { User } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bakers.map((baker) => (
            <Card key={baker.id} className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.02] group animate-scale-in bg-card flex flex-col">
              <CardHeader className="items-center text-center p-6">
                <Avatar className="h-24 w-24 mb-4 border-2 border-primary group-hover:border-[hsl(var(--blue))] transition-colors duration-300">
                  <AvatarImage 
                    src={(baker.brandName || baker.name) ? `https://ui-avatars.com/api/?name=${encodeURIComponent(baker.brandName || baker.name || '')}&background=random&color=fff&size=128` : undefined} 
                    alt={baker.brandName || baker.name || 'Baker'} 
                  />
                  <AvatarFallback className="text-3xl bg-muted">
                    {baker.brandName ? baker.brandName.substring(0, 2).toUpperCase() : baker.name ? baker.name.substring(0, 2).toUpperCase() : baker.email.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">{baker.brandName || baker.name || 'Anonymous Baker'}</CardTitle>
                <CardDescription className="text-muted-foreground">{baker.email}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-center">
                <p className="text-sm text-muted-foreground h-10 line-clamp-2"> {/* Added height and line-clamp for consistency */}
                  A passionate member of the Bakebook community. Ready to share tips and recipes!
                </p>
              </CardContent>
              <CardFooter className="p-4 mt-auto">
                <Button asChild variant="outline" className="w-full group-hover:bg-primary/10 group-hover:border-primary group-hover:text-primary transition-colors">
                  <Link href={`mailto:${baker.email}?subject=Message%20from%20Bakebook%20User&body=Hi%20${encodeURIComponent(baker.brandName || baker.name || 'Baker')},%0D%0A%0D%0A`}>
                    <Mail size={18} className="mr-2" /> Message {baker.brandName || baker.name || 'Baker'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
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
