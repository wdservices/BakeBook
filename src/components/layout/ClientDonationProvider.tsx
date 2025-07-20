"use client";
import { useState } from 'react';
import Header from './Header';
import DonationModal from '../donation/DonationModal';

export default function ClientDonationProvider({ children }: { children: React.ReactNode }) {
  const [donationOpen, setDonationOpen] = useState(false);
  return (
    <>
      <Header onOpenDonationModal={() => setDonationOpen(true)} />
      <DonationModal open={donationOpen} onOpenChange={setDonationOpen} onConfirmDonation={() => setDonationOpen(false)} />
      {children}
    </>
  );
} 