
'use client';

import { useForm, type SubmitHandler, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Invoice, InvoiceLineItem, User, CurrencyCode } from '@/types';
import { CURRENCIES } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import Spinner from '@/components/ui/Spinner';
import { addInvoiceToFirestore } from '@/lib/firestoreService';
import { CalendarIcon, PlusCircle, Trash2, Download } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Separator } from '../ui/separator';
import { useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


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
  currency: z.custom<CurrencyCode>((val) => Object.keys(CURRENCIES).includes(val as string), {
    message: "Invalid currency selected",
  }).default('USD'),

  // User details (will be pre-filled, but can be edited)
  userBrandName: z.string().optional(),
  userPhoneNumber: z.string().optional(),
  userAddress: z.string().optional(),
  userEmail: z.string().email({message: "Invalid email for sender"}).optional().or(z.literal('')),

  // Recipient details
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientCompany: z.string().optional(),
  recipientAddress: z.string().optional(),
  recipientEmail: z.string().email({ message: "Invalid email format for recipient" }).optional().or(z.literal('')),
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

const formatDisplayNumber = (num: number | undefined | null) => {
  if (num === null || num === undefined) return '0.00';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const InvoiceForm = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const pdfContentRef = useRef<HTMLDivElement>(null);

  const { control, register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue, getValues } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoiceNumber: '', // Set initial to empty to avoid hydration mismatch
      invoiceDate: new Date(),
      currency: 'USD',
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
    // Generate invoice number only on client-side after mount to avoid hydration mismatch
    if (!getValues('invoiceNumber')) {
        const newInvoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
        setValue('invoiceNumber', newInvoiceNumber);
    }
    // Pre-fill user data
    if (user) {
      setValue('userBrandName', user.brandName || '');
      setValue('userPhoneNumber', user.phoneNumber || '');
      setValue('userAddress', user.address || '');
      setValue('userEmail', user.email || '');
    }
  }, [user, setValue, getValues]);


  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  const watchedLineItems = watch("lineItems");
  const watchedTaxRate = watch("taxRate");
  const watchedDiscountAmount = watch("discountAmount");
  const watchedCurrency = watch("currency");

  const currentCurrencySymbol = CURRENCIES[watchedCurrency]?.symbol || '$';

  useEffect(() => {
    let sub = 0;
    watchedLineItems.forEach((item, index) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const total = quantity * unitPrice;
      setValue(`lineItems.${index}.totalPrice`, total, { shouldValidate: true });
      sub += total;
    });
    setValue("subtotal", sub, { shouldValidate: true });

    const tax = sub * (Number(watchedTaxRate || 0) / 100);
    setValue("taxAmount", tax, { shouldValidate: true });

    const discount = Number(watchedDiscountAmount || 0);
    setValue("grandTotal", sub + tax - discount, { shouldValidate: true });

  }, [watchedLineItems, watchedTaxRate, watchedDiscountAmount, setValue]);


  const onSubmit: SubmitHandler<InvoiceFormValues> = async (data) => {
    if (!user && !data.userEmail) { // If not logged in, require manual email
      toast({ title: "Sender Email Required", description: "Please enter your email address in the 'Your Information' section.", variant: "destructive" });
      return;
    }
    
    try {
      const invoiceToSave = {
        ...data,
        authorId: user?.id || 'guest', // Handle guest invoices if needed
        invoiceDate: data.invoiceDate.toISOString(),
        dueDate: data.dueDate ? data.dueDate.toISOString() : null,
        subtotal: Number(data.subtotal) || 0,
        taxRate: data.taxRate === undefined ? null : Number(data.taxRate),
        taxAmount: data.taxAmount === undefined ? null : Number(data.taxAmount),
        discountAmount: data.discountAmount === undefined ? null : Number(data.discountAmount),
        grandTotal: Number(data.grandTotal) || 0,
        lineItems: data.lineItems.map(item => ({
            ...item,
            id: item.id || crypto.randomUUID(), // Ensure ID for new items
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            totalPrice: Number(item.totalPrice),
        }))
      };
      await addInvoiceToFirestore(invoiceToSave, user.id);
      toast({ title: "Invoice Saved!", description: `Invoice "${data.invoiceNumber}" has been successfully saved.` });
      router.push('/dashboard'); // Or a page listing invoices
    } catch (error: any) {
      console.error("Invoice submission error:", error);
      toast({ title: "Error", description: error.message || "An unexpected error occurred.", variant: "destructive" });
    }
  };

  const handleDownloadPdf = async () => {
    const invoiceContent = document.getElementById('invoice-pdf-content-wrapper');
    if (!invoiceContent) {
      toast({ title: "Error", description: "PDF content area not found.", variant: "destructive" });
      return;
    }

    toast({ title: "Generating PDF...", description: "Please wait a moment." });

    try {
      const canvas = await html2canvas(invoiceContent, {
        scale: 2, // Increase scale for better quality
        useCORS: true, // If you have external images
        backgroundColor: null, // Use the element's background
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt', // points
        format: 'a4', // A4 paper size
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate the aspect ratio
      const ratio = imgWidth / imgHeight;
      let newImgWidth = pdfWidth - 40; // With some padding
      let newImgHeight = newImgWidth / ratio;

      // If the image is too tall, resize based on height instead
      if (newImgHeight > pdfHeight - 40) {
        newImgHeight = pdfHeight - 40;
        newImgWidth = newImgHeight * ratio;
      }
      
      const x = (pdfWidth - newImgWidth) / 2; // Center the image
      const y = 20; // Top padding

      pdf.addImage(imgData, 'PNG', x, y, newImgWidth, newImgHeight);
      pdf.save(`invoice-${getValues('invoiceNumber') || 'download'}.pdf`);
      toast({ title: "PDF Downloaded", description: "Invoice PDF has been generated." });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({ title: "PDF Error", description: "Could not generate PDF.", variant: "destructive" });
    }
  };


  if (authLoading && !user) {
    // Allow unauthenticated users to access the form, but they'll have to fill in their details.
  }
  
  const formData = getValues(); // Get current form values for PDF rendering

  return (
    <>
    <Card className="w-full max-w-4xl mx-auto shadow-xl animate-scale-in">
      <CardHeader>
        <CardTitle className="text-3xl font-headline bg-gradient-to-r from-primary to-[hsl(var(--blue))] bg-clip-text text-transparent hover:from-[hsl(var(--blue))] hover:to-primary transition-all duration-300 ease-in-out">
          Create New Invoice
        </CardTitle>
        <CardDescription>
          Fill in the details to generate a new invoice. Your details will be pre-filled if you are logged in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Invoice Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2 lg:col-span-2">
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
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(CURRENCIES).map(([code, { name, symbol }]) => (
                        <SelectItem key={code} value={code}>
                            {symbol} - {name} ({code})
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                )}
            />
            {errors.currency && <p className="text-sm text-destructive">{errors.currency.message}</p>}
          </div>


          <Separator />

          {/* User and Recipient Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 p-4 border rounded-md bg-card/30">
              <h3 className="text-lg font-medium text-primary">Your Information</h3>
              <div className="space-y-2">
                <Label htmlFor="userBrandName">Your Brand Name</Label>
                <Input id="userBrandName" {...register('userBrandName')} placeholder="Your Bakery LLC"/>
                {errors.userBrandName && <p className="text-sm text-destructive">{errors.userBrandName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="userAddress">Your Address</Label>
                <Textarea id="userAddress" {...register('userAddress')} placeholder="123 Your Street, Your City" rows={2}/>
                {errors.userAddress && <p className="text-sm text-destructive">{errors.userAddress.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="userPhoneNumber">Your Phone</Label>
                    <Input id="userPhoneNumber" {...register('userPhoneNumber')} placeholder="(555) 555-5555"/>
                    {errors.userPhoneNumber && <p className="text-sm text-destructive">{errors.userPhoneNumber.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="userEmail">Your Email</Label>
                    <Input id="userEmail" type="email" {...register('userEmail')} placeholder="you@example.com"/>
                    {errors.userEmail && <p className="text-sm text-destructive">{errors.userEmail.message}</p>}
                </div>
              </div>
            </div>

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
                  <Label htmlFor={`lineItems.${index}.unitPrice`}>Unit Price ({currentCurrencySymbol})</Label>
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
                  <Label>Total ({currentCurrencySymbol})</Label>
                  <Input value={formatDisplayNumber(watch(`lineItems.${index}.totalPrice`))} readOnly className="bg-muted/50 cursor-not-allowed" />
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 items-start">
                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="notes">Notes / Terms (Optional)</Label>
                    <Textarea id="notes" {...register('notes')} placeholder="e.g., Payment due upon receipt. Thank you for your business!" rows={4} />
                </div>
                <div className="space-y-3 p-4 border rounded-md bg-card/30">
                    <div className="flex justify-between items-center">
                        <Label className="text-muted-foreground">Subtotal:</Label>
                        <span className="font-medium">{currentCurrencySymbol}&nbsp;{formatDisplayNumber(watch('subtotal'))}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                        <Label htmlFor="taxRate" className="text-muted-foreground whitespace-nowrap">Tax (%):</Label>
                        <Input id="taxRate" type="number" step="0.01" placeholder="0" {...register('taxRate')} className="h-8 max-w-[80px] text-right"/>
                    </div>
                    <div className="flex justify-between items-center">
                        <Label className="text-muted-foreground">Tax Amount:</Label>
                        <span className="font-medium">{currentCurrencySymbol}&nbsp;{formatDisplayNumber(watch('taxAmount'))}</span>
                    </div>
                     <div className="flex justify-between items-center gap-2">
                        <Label htmlFor="discountAmount" className="text-muted-foreground">Discount ({currentCurrencySymbol}):</Label>
                        <Input id="discountAmount" type="number" step="0.01" placeholder="0.00" {...register('discountAmount')} className="h-8 max-w-[100px] text-right"/>
                    </div>
                    <Separator className="my-2"/>
                    <div className="flex justify-between items-center text-lg">
                        <Label className="font-semibold text-primary">Grand Total:</Label>
                        <span className="font-bold text-primary">{currentCurrencySymbol}&nbsp;{formatDisplayNumber(watch('grandTotal'))}</span>
                    </div>
                </div>
            </div>


          <CardFooter className="p-0 pt-8 flex flex-col sm:flex-row justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto order-2 sm:order-1">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto order-1 sm:order-2" disabled={isSubmitting}>
              {isSubmitting ? <><Spinner size={18} className="mr-2"/> Processing...</> : 'Save Invoice (Draft)'}
            </Button>
             <Button type="button" onClick={handleDownloadPdf} className="w-full sm:w-auto order-3" variant="secondary">
                <Download size={18} className="mr-2"/> Download PDF
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>

    {/* Hidden div for PDF generation content */}
    <div id="invoice-pdf-content-wrapper" ref={pdfContentRef} className="fixed -left-[9999px] top-0 p-10 bg-white text-black w-[800px]" aria-hidden="true">
        <style>{`
            #invoice-pdf-content-wrapper { 
                font-family: Arial, sans-serif; 
                color: #333;
                background-color: #ffffff;
                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24'%3e%3cg transform='rotate(15 12 12)'%3e%3cpath fill='none' stroke='rgba(0,0,0,0.04)' stroke-width='1.5' d='M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8 M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4 2 2.5 2 4 2 2-1 2-1 M2 21h20 M7 8v2 M12 8v2 M17 8v2 M7 4h.01 M12 4h.01 M17 4h.01'/%3e%3c/g%3e%3c/svg%3e");
            }
            .pdf-header { text-align: center; margin-bottom: 30px; }
            .pdf-header h1 { font-size: 28px; color: #d95f43; margin-bottom: 5px; } /* Primary color approx */
            .pdf-meta-table, .pdf-line-items-table, .pdf-summary-table { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
            .pdf-meta-table td, .pdf-line-items-table th, .pdf-line-items-table td, .pdf-summary-table td { padding: 8px; border: 1px solid #ddd; background-color: #fff; }
            .pdf-line-items-table th { background-color: #f2f2f2; text-align: left; }
            .pdf-user-recipient-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .pdf-user-recipient-grid div { padding: 10px; border: 1px solid #eee; background-color: #fff; border-radius: 4px; }
            .pdf-user-recipient-grid h3 { margin-top: 0; font-size: 16px; color: #d95f43; } /* Primary color approx */
            .pdf-summary-table { background-color: #fff; }
            .pdf-summary-table td:first-child { text-align: right; font-weight: bold; }
            .pdf-footer { text-align: center; margin-top: 40px; font-size: 12px; color: #777; }
            .pdf-text-right { text-align: right; }
        `}</style>
        <div className="pdf-header">
            <h1>Invoice</h1>
            <p>{formData.userBrandName || formData.userEmail || 'Your Business'}</p>
        </div>

        <table className="pdf-meta-table">
            <tbody>
                <tr><td>Invoice #:</td><td>{formData.invoiceNumber}</td></tr>
                <tr><td>Date:</td><td>{formData.invoiceDate ? format(new Date(formData.invoiceDate), 'PPP') : ''}</td></tr>
                {formData.dueDate && <tr><td>Due Date:</td><td>{format(new Date(formData.dueDate), 'PPP')}</td></tr>}
            </tbody>
        </table>
        
        <div className="pdf-user-recipient-grid">
            <div>
                <h3>From:</h3>
                <p><strong>{formData.userBrandName || (user?.name) || formData.userEmail}</strong></p>
                {formData.userAddress && <p>{formData.userAddress.split('\\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p>}
                {formData.userPhoneNumber && <p>Phone: {formData.userPhoneNumber}</p>}
                {formData.userEmail && <p>Email: {formData.userEmail}</p>}
            </div>
            <div>
                <h3>To:</h3>
                <p><strong>{formData.recipientName}</strong></p>
                {formData.recipientCompany && <p>{formData.recipientCompany}</p>}
                {formData.recipientAddress && <p>{formData.recipientAddress.split('\\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p>}
                {formData.recipientPhone && <p>Phone: {formData.recipientPhone}</p>}
                {formData.recipientEmail && <p>Email: {formData.recipientEmail}</p>}
            </div>
        </div>

        <table className="pdf-line-items-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th className="pdf-text-right">Quantity</th>
                    <th className="pdf-text-right">Unit Price ({CURRENCIES[formData.currency]?.symbol})</th>
                    <th className="pdf-text-right">Total ({CURRENCIES[formData.currency]?.symbol})</th>
                </tr>
            </thead>
            <tbody>
                {formData.lineItems?.map((item, index) => (
                    <tr key={index}>
                        <td>{item.description}</td>
                        <td className="pdf-text-right">{item.quantity}</td>
                        <td className="pdf-text-right">{Number(item.unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="pdf-text-right">{Number(item.totalPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        <table className="pdf-summary-table" style={{ width: '50%', marginLeft: 'auto' }}>
            <tbody>
                <tr><td>Subtotal:</td><td className="pdf-text-right">{CURRENCIES[formData.currency]?.symbol}{Number(formData.subtotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
                {formData.taxRate !== undefined && formData.taxRate > 0 && (
                    <>
                    <tr><td>Tax ({formData.taxRate}%):</td><td className="pdf-text-right">{CURRENCIES[formData.currency]?.symbol}{Number(formData.taxAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
                    </>
                )}
                {formData.discountAmount !== undefined && formData.discountAmount > 0 && (
                    <tr><td>Discount:</td><td className="pdf-text-right">-{CURRENCIES[formData.currency]?.symbol}{Number(formData.discountAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
                )}
                <tr><td><strong>Grand Total:</strong></td><td className="pdf-text-right"><strong>{CURRENCIES[formData.currency]?.symbol}{Number(formData.grandTotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td></tr>
            </tbody>
        </table>

        {formData.notes && (
            <div style={{ marginTop: '20px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                <h4>Notes:</h4>
                <p>{formData.notes.split('\\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p>
            </div>
        )}
        
        <div className="pdf-footer">
            <p>Thank you for your patronage.</p>
            <p>From BakeBook</p>
        </div>
    </div>
    </>
  );
};

export default InvoiceForm;
