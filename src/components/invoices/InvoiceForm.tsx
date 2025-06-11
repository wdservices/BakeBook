
'use client';

import { useForm, type SubmitHandler, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Invoice, InvoiceLineItem, User } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import Spinner from '@/components/ui/Spinner';
// import { addInvoiceToFirestore } from '@/lib/firestoreService'; // We'll use this later
import { CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Separator } from '../ui/separator';
import { useEffect } from 'react'; // Added useEffect import

// Zod schema for a single line item
const lineItemSchema = z.object({
  id: z.string().optional(), // Optional for new items
  description: z.string().min(1, "Description is required"),
  quantity: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().min(0.01, "Quantity must be greater than 0")
  ),
  unitPrice: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().min(0.01, "Unit price must be greater than 0")
  ),
  totalPrice: z.number().optional(), // Will be calculated
});

// Zod schema for the entire invoice
export const invoiceFormSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.date({ required_error: "Invoice date is required." }),
  dueDate: z.date().optional(),

  // User details (will be pre-filled, but good to have in schema for structure)
  userBrandName: z.string().optional(),
  userPhoneNumber: z.string().optional(),
  userAddress: z.string().optional(),
  userEmail: z.string().email().optional(),

  // Recipient details
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientCompany: z.string().optional(),
  recipientAddress: z.string().optional(),
  recipientEmail: z.string().email({ message: "Invalid email format" }).optional().or(z.literal('')),
  recipientPhone: z.string().optional(),

  lineItems: z.array(lineItemSchema).min(1, "At least one line item is required"),

  // Summary fields (will be mostly calculated)
  subtotal: z.number().optional(),
  taxRate: z.preprocess(
    (val) => val === '' ? undefined : parseFloat(String(val)),
    z.number().min(0).optional()
  ),
  taxAmount: z.number().optional(),
  discountAmount: z.preprocess(
    (val) => val === '' ? undefined : parseFloat(String(val)),
    z.number().min(0).optional()
  ),
  grandTotal: z.number().optional(),

  notes: z.string().optional(),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).default('draft'),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

const InvoiceForm = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const { control, register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      invoiceDate: new Date(),
      userBrandName: user?.brandName || '',
      userPhoneNumber: user?.phoneNumber || '',
      userAddress: user?.address || '',
      userEmail: user?.email || '',
      lineItems: [{ description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
      status: 'draft',
      taxRate: 0,
      discountAmount: 0,
    },
  });

 useEffect(() => {
    if (user) {
      setValue('userBrandName', user.brandName || '');
      setValue('userPhoneNumber', user.phoneNumber || '');
      setValue('userAddress', user.address || '');
      setValue('userEmail', user.email || '');
    }
  }, [user, setValue]);


  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  // Watch line items, tax rate, and discount to recalculate totals
  const watchedLineItems = watch("lineItems");
  const watchedTaxRate = watch("taxRate");
  const watchedDiscountAmount = watch("discountAmount");

  useEffect(() => {
    let sub = 0;
    watchedLineItems.forEach((item, index) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const total = quantity * unitPrice;
      setValue(`lineItems.${index}.totalPrice`, total, { shouldValidate: false });
      sub += total;
    });
    setValue("subtotal", sub, { shouldValidate: false });

    const tax = sub * (Number(watchedTaxRate || 0) / 100);
    setValue("taxAmount", tax, { shouldValidate: false });

    const discount = Number(watchedDiscountAmount || 0);
    setValue("grandTotal", sub + tax - discount, { shouldValidate: false });

  }, [watchedLineItems, watchedTaxRate, watchedDiscountAmount, setValue]);


  const onSubmit: SubmitHandler<InvoiceFormValues> = async (data) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to create invoices.", variant: "destructive" });
      router.push('/login?redirect=/dashboard/invoices/new');
      return;
    }
    // Placeholder for saving data
    console.log("Invoice Data to Save:", data);
    toast({ title: "Invoice Submitted (Mock)", description: "Invoice data logged to console. PDF generation is next!" });
    // try {
    //   const invoiceToSave = {
    //     ...data,
    //     invoiceDate: data.invoiceDate.toISOString(),
    //     dueDate: data.dueDate ? data.dueDate.toISOString() : null,
    //     // Ensure all numbers are numbers
    //     subtotal: Number(data.subtotal) || 0,
    //     taxRate: Number(data.taxRate) || null,
    //     taxAmount: Number(data.taxAmount) || null,
    //     discountAmount: Number(data.discountAmount) || null,
    //     grandTotal: Number(data.grandTotal) || 0,
    //     lineItems: data.lineItems.map(item => ({
    //         ...item,
    //         id: item.id || crypto.randomUUID(),
    //         quantity: Number(item.quantity),
    //         unitPrice: Number(item.unitPrice),
    //         totalPrice: Number(item.totalPrice),
    //     }))
    //   };
    //   await addInvoiceToFirestore(invoiceToSave, user.id);
    //   toast({ title: "Invoice Saved!", description: `Invoice "${data.invoiceNumber}" has been successfully saved.` });
    //   router.push('/dashboard'); // Or a page listing invoices
    // } catch (error: any) {
    //   console.error("Invoice submission error:", error);
    //   toast({ title: "Error", description: error.message || "An unexpected error occurred.", variant: "destructive" });
    // }
  };

  if (authLoading && !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Spinner size={48}/> <p className="ml-4">Loading user...</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl animate-scale-in">
      <CardHeader>
        <CardTitle className="text-3xl font-headline bg-gradient-to-r from-primary to-[hsl(var(--blue))] bg-clip-text text-transparent hover:from-[hsl(var(--blue))] hover:to-primary transition-all duration-300 ease-in-out">
          Create New Invoice
        </CardTitle>
        <CardDescription>
          Fill in the details to generate a new invoice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Invoice Meta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input id="invoiceNumber" {...register('invoiceNumber')} />
              {errors.invoiceNumber && <p className="text-sm text-destructive">{errors.invoiceNumber.message}</p>}
            </div>
             <div className="space-y-2">
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Controller
                name="invoiceDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.invoiceDate && <p className="text-sm text-destructive">{errors.invoiceDate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
               <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate.message}</p>}
            </div>
          </div>

          <Separator />

          {/* User and Recipient Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Details Section */}
            <div className="space-y-4 p-4 border rounded-md bg-card/30">
              <h3 className="text-lg font-medium text-primary">Your Information</h3>
              <div className="space-y-2">
                <Label htmlFor="userBrandName">Your Brand Name</Label>
                <Input id="userBrandName" {...register('userBrandName')} readOnly className="bg-muted/50 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userAddress">Your Address</Label>
                <Textarea id="userAddress" {...register('userAddress')} readOnly className="bg-muted/50 cursor-not-allowed" rows={2}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="userPhoneNumber">Your Phone</Label>
                    <Input id="userPhoneNumber" {...register('userPhoneNumber')} readOnly className="bg-muted/50 cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="userEmail">Your Email</Label>
                    <Input id="userEmail" {...register('userEmail')} readOnly className="bg-muted/50 cursor-not-allowed" />
                </div>
              </div>
            </div>

            {/* Recipient Details Section */}
            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="text-lg font-medium text-primary">Billed To</h3>
              <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient Full Name <span className="text-destructive">*</span></Label>
                <Input id="recipientName" {...register('recipientName')} placeholder="e.g., Jane Baker" />
                {errors.recipientName && <p className="text-sm text-destructive">{errors.recipientName.message}</p>}
              </div>
               <div className="space-y-2">
                <Label htmlFor="recipientCompany">Company Name (Optional)</Label>
                <Input id="recipientCompany" {...register('recipientCompany')} placeholder="e.g., Jane's Cafe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientAddress">Recipient Address (Optional)</Label>
                <Textarea id="recipientAddress" {...register('recipientAddress')} placeholder="e.g., 456 Cake St, Sweetville" rows={2}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="recipientEmail">Recipient Email (Optional)</Label>
                    <Input id="recipientEmail" type="email" {...register('recipientEmail')} placeholder="e.g., jane@example.com" />
                    {errors.recipientEmail && <p className="text-sm text-destructive">{errors.recipientEmail.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="recipientPhone">Recipient Phone (Optional)</Label>
                    <Input id="recipientPhone" {...register('recipientPhone')} placeholder="e.g., (555) 987-6543" />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />

          {/* Line Items Section */}
          <div>
            <h3 className="text-lg font-medium text-primary mb-2">Items / Services</h3>
            {fields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 mb-3 p-3 border rounded-md items-end relative animate-fade-in">
                <div className="col-span-12 md:col-span-5 space-y-1">
                  <Label htmlFor={`lineItems.${index}.description`}>Description</Label>
                  <Input
                    id={`lineItems.${index}.description`}
                    placeholder="e.g., Custom Birthday Cake"
                    {...register(`lineItems.${index}.description`)}
                  />
                  {errors.lineItems?.[index]?.description && <p className="text-xs text-destructive">{errors.lineItems[index]?.description?.message}</p>}
                </div>
                <div className="col-span-4 md:col-span-2 space-y-1">
                  <Label htmlFor={`lineItems.${index}.quantity`}>Qty</Label>
                  <Input
                    id={`lineItems.${index}.quantity`}
                    type="number"
                    step="1"
                    min="1"
                    placeholder="1"
                    {...register(`lineItems.${index}.quantity`)}
                  />
                   {errors.lineItems?.[index]?.quantity && <p className="text-xs text-destructive">{errors.lineItems[index]?.quantity?.message}</p>}
                </div>
                <div className="col-span-4 md:col-span-2 space-y-1">
                  <Label htmlFor={`lineItems.${index}.unitPrice`}>Unit Price</Label>
                  <Input
                    id={`lineItems.${index}.unitPrice`}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...register(`lineItems.${index}.unitPrice`)}
                  />
                  {errors.lineItems?.[index]?.unitPrice && <p className="text-xs text-destructive">{errors.lineItems[index]?.unitPrice?.message}</p>}
                </div>
                 <div className="col-span-4 md:col-span-2 space-y-1">
                  <Label>Total</Label>
                  <Input value={Number(watch(`lineItems.${index}.totalPrice`) || 0).toFixed(2)} readOnly className="bg-muted/50 cursor-not-allowed" />
                </div>
                <div className="col-span-12 md:col-span-1 flex justify-end">
                  {fields.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => remove(index)}>
                      <Trash2 size={18} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="mt-2 border-dashed border-primary text-primary hover:bg-primary/10"
              onClick={() => append({ description: '', quantity: 1, unitPrice: 0, totalPrice: 0 })}
            >
              <PlusCircle size={18} className="mr-2" /> Add Item
            </Button>
            {errors.lineItems && typeof errors.lineItems === 'object' && !Array.isArray(errors.lineItems) && (
              <p className="text-sm text-destructive mt-1">{ (errors.lineItems as any).message || (errors.lineItems as any).root?.message }</p>
            )}
          </div>

          <Separator />

            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 items-start">
                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="notes">Notes / Terms (Optional)</Label>
                    <Textarea id="notes" {...register('notes')} placeholder="e.g., Payment due upon receipt. Thank you for your business!" rows={4} />
                </div>
                <div className="space-y-3 p-4 border rounded-md bg-card/30">
                    <div className="flex justify-between items-center">
                        <Label className="text-muted-foreground">Subtotal:</Label>
                        <span className="font-medium">$&nbsp;{Number(watch('subtotal') || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                        <Label htmlFor="taxRate" className="text-muted-foreground whitespace-nowrap">Tax (%):</Label>
                        <Input id="taxRate" type="number" step="0.01" placeholder="0" {...register('taxRate')} className="h-8 max-w-[80px] text-right"/>
                    </div>
                    <div className="flex justify-between items-center">
                        <Label className="text-muted-foreground">Tax Amount:</Label>
                        <span className="font-medium">$&nbsp;{Number(watch('taxAmount') || 0).toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between items-center gap-2">
                        <Label htmlFor="discountAmount" className="text-muted-foreground">Discount ($):</Label>
                        <Input id="discountAmount" type="number" step="0.01" placeholder="0.00" {...register('discountAmount')} className="h-8 max-w-[100px] text-right"/>
                    </div>
                    <Separator className="my-2"/>
                    <div className="flex justify-between items-center text-lg">
                        <Label className="font-semibold text-primary">Grand Total:</Label>
                        <span className="font-bold text-primary">$&nbsp;{Number(watch('grandTotal') || 0).toFixed(2)}</span>
                    </div>
                </div>
            </div>


          <CardFooter className="p-0 pt-8 flex justify-end">
            <Button type="button" variant="outline" onClick={() => router.back()} className="mr-4">
              Cancel
            </Button>
            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
              {isSubmitting ? <><Spinner size={18} className="mr-2"/> Processing...</> : 'Save Invoice (Draft)'}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;

    