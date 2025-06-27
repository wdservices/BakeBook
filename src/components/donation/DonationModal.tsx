
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart } from 'lucide-react';
import Script from 'next/script';

interface DonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDonation: () => void;
}

const DonationModal = ({ open, onOpenChange, onConfirmDonation }: DonationModalProps) => {
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-headline">
              <Heart className="text-primary" />
              Support Bakebook
            </DialogTitle>
            <DialogDescription>
              Bakebook is a free platform. Your monthly donation helps us keep the ovens on and develop new features. Thank you for your support!
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="usd" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="usd">USD ($)</TabsTrigger>
              <TabsTrigger value="ngn">Naira (₦)</TabsTrigger>
            </TabsList>
            <TabsContent value="usd" className="py-4 text-center">
              <p className="text-sm text-muted-foreground mb-4">Click the button below to proceed with your donation in USD.</p>
              <a href="https://bakebook.lemonsqueezy.com/buy/6248a0c1-b36b-40b2-9a49-22a4fc54f4a4?embed=1" className="lemonsqueezy-button inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
                Donate with Lemon Squeezy
              </a>
            </TabsContent>
            <TabsContent value="ngn" className="py-4 text-center">
              <p className="text-sm text-muted-foreground">Naira donations are coming soon! Thank you for your patience.</p>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
             <Button type="button" onClick={onConfirmDonation}>
              I've already donated, thanks!
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Maybe Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Script src="https://assets.lemonsqueezy.com/lemon.js" strategy="lazyOnload" />
    </>
  );
};

export default DonationModal;
