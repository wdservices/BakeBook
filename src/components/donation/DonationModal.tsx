'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, X } from 'lucide-react';
import Script from 'next/script';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDonation: (amount?: number) => void;
}

const FLUTTERWAVE_NAIRA_URL = "https://flutterwave.com/donate/hxecwnwbqqxv";
const FLUTTERWAVE_USD_URL = "https://flutterwave.com/donate/jwfef4kasotf";
const LEMONSQUEEZY_USD_URL = "https://bakebook.lemonsqueezy.com/buy/6248a0c1-b36b-40b2-9a49-22a4fc54f4a4?embed=1";

const DONATION_MESSAGE =
  "If you can donate just ₦1500 or $1 a month, you'll help keep BakeBook running for you and the whole community. Every little bit truly makes a difference!";

const DonationModal = ({ open, onOpenChange, onConfirmDonation }: DonationModalProps) => {
  const [amount, setAmount] = useState<number | undefined>(5);
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [iframeOpen, setIframeOpen] = useState<null | 'lemonsqueezy'>(null);

  const handleConfirm = () => {
    onConfirmDonation(amount);
  };

  const handleDonate = (provider: 'flutterwave' | 'lemonsqueezy') => {
    if (provider === 'flutterwave') {
      const url = currency === 'NGN' ? FLUTTERWAVE_NAIRA_URL : FLUTTERWAVE_USD_URL;
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    setIframeOpen(provider);
  };

  const donationUrl = iframeOpen === 'lemonsqueezy' ? LEMONSQUEEZY_USD_URL : '';

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
              <span className="block mb-2 text-base font-semibold text-primary">{DONATION_MESSAGE}</span>
              Bakebook is a free platform. Your donation helps us keep the ovens on and develop new features. Thank you for your support!
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center gap-4 mb-4">
            <Button
              variant={currency === 'NGN' ? 'default' : 'outline'}
              onClick={() => setCurrency('NGN')}
            >
              Donate in Naira (₦)
            </Button>
            <Button
              variant={currency === 'USD' ? 'default' : 'outline'}
              onClick={() => setCurrency('USD')}
            >
              Donate in USD ($)
            </Button>
          </div>

          <div className="text-center mb-4">
            {currency === 'NGN' && (
              <>
                <Button onClick={() => handleDonate('flutterwave')} className="w-full mb-2">
                  Donate with Flutterwave (₦)
                </Button>
                <p className="text-xs text-muted-foreground mt-1">For your security, Flutterwave donations open in a new tab.</p>
              </>
            )}
            {currency === 'USD' && (
              <>
                <Button onClick={() => handleDonate('flutterwave')} className="w-full mb-2">
                  Donate with Flutterwave ($)
                </Button>
                <p className="text-xs text-muted-foreground mt-1 mb-2">For your security, Flutterwave donations open in a new tab.</p>
                <Button onClick={() => handleDonate('lemonsqueezy')} className="w-full">
                  Donate with Lemon Squeezy ($)
                </Button>
              </>
            )}
          </div>

          <Label htmlFor="donation-amount" className="text-sm text-center block">Or, if you've already donated, confirm the amount ({currency})</Label>
          <Input
            id="donation-amount"
            type="number"
            placeholder={currency === 'NGN' ? 'e.g., 5000' : 'e.g., 10'}
            value={amount === undefined ? '' : amount}
            onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : undefined)}
            className="max-w-xs mx-auto"
          />

          <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
            <Button type="button" onClick={handleConfirm}>
              Confirm My Donation
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Maybe Later
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {iframeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative w-full max-w-2xl h-[80vh] bg-white rounded-lg shadow-lg flex flex-col">
            <button
              className="absolute top-2 right-2 z-10 p-2 rounded-full hover:bg-gray-200"
              onClick={() => setIframeOpen(null)}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <iframe
              src={donationUrl}
              title="Donation Payment"
              className="flex-1 w-full rounded-b-lg border-0"
              style={{ minHeight: '70vh' }}
              allow="payment"
            />
          </div>
        </div>
      )}
      <Script src="https://assets.lemonsqueezy.com/lemon.js" strategy="lazyOnload" />
    </>
  );
};

export default DonationModal;
