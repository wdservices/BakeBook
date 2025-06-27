
export type Ingredient = {
  id: string;
  name: string;
  quantity: string; // e.g., "2 cups", "100g", "1 tsp"
};

export type RecipeStep = {
  id: string;
  description: string;
  // Optional: imageUrl for visual aid in step
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  prepTime: string; // e.g., "30 mins"
  cookTime: string; // e.g., "1 hour"
  ingredients: Ingredient[];
  steps: RecipeStep[];
  authorId: string; // ID of the user who created it (Firebase UID)
  authorName?: string; // Display name of the author
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isPublic?: boolean; // True if public, false/undefined if private
};

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export type User = {
  id: string; // Firebase UID
  email: string | null;
  name?: string | null; // Firebase displayName
  brandName?: string | null;
  phoneNumber?: string | null;
  address?: string | null; // New: User's address for invoices
  role: UserRole;
  photoURL?: string | null; // Firebase photoURL
  lastDonationDate?: string | null;
  lastPromptedDate?: string | null;
};

// New Types for Invoices

export type InvoiceLineItem = {
  id: string; // Unique ID for the line item
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number; // quantity * unitPrice
};

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'NGN';

export const CURRENCIES: Record<CurrencyCode, { symbol: string; name: string }> = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  NGN: { symbol: '₦', name: 'Nigerian Naira' },
};

export type Invoice = {
  id: string; // Firestore document ID
  authorId: string; // UID of the user who created the invoice
  invoiceNumber: string; // e.g., "INV-2023-001"
  invoiceDate: string; // ISO date string
  dueDate?: string | null; // ISO date string, optional
  currency: CurrencyCode; // Added currency

  // User's details (snapshot at time of creation)
  userBrandName?: string | null;
  userPhoneNumber?: string | null;
  userAddress?: string | null;
  userEmail?: string | null;

  // Recipient's details
  recipientName: string;
  recipientCompany?: string | null;
  recipientAddress?: string | null;
  recipientEmail?: string | null;
  recipientPhone?: string | null;

  lineItems: InvoiceLineItem[];

  subtotal: number; // Sum of all lineItem.totalPrice
  taxRate?: number | null; // Percentage, e.g., 0.05 for 5%
  taxAmount?: number | null; // Calculated tax
  discountAmount?: number | null; // Fixed amount
  grandTotal: number; // Final amount due

  notes?: string | null; // Any additional notes or terms
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};
