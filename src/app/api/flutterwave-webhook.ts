import { NextRequest, NextResponse } from 'next/server';
import { updateUserProfileFields } from '@/lib/firestoreService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      status,
      amount,
      currency,
      customer,
      transaction_id,
      flw_ref,
    } = body;

    // Verify webhook signature (optional: add your secret hash logic here)
    // const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
    // const signature = req.headers.get('verif-hash');
    // if (secretHash && signature !== secretHash) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    if (status !== 'successful') {
      return NextResponse.json({ message: 'Payment not successful' }, { status: 200 });
    }

    // Find user by email (assuming email is unique and stored in Firestore)
    const userEmail = customer?.email;
    if (!userEmail) {
      return NextResponse.json({ error: 'No customer email provided' }, { status: 400 });
    }

    // TODO: Lookup user by email to get userId (implement this in your Firestore service)
    // For now, just log the event
    console.log(`Received donation webhook for ${userEmail}: ${amount} ${currency}`);

    // Optionally, update the user's donation status in Firestore
    // await updateUserProfileFields(userId, {
    //   lastDonationAmount: amount,
    //   lastDonationDate: new Date().toISOString(),
    // });

    return NextResponse.json({ message: 'Webhook processed successfully', transaction_id });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
} 