'use client'

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UseFormReturn } from 'react-hook-form'
import { Lock } from 'lucide-react'

interface BusinessFormStep5Props {
  form: UseFormReturn<any>
}

export function BusinessFormStep5({ form }: BusinessFormStep5Props) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Lock className="w-12 h-12 text-yellow-400 mx-auto" />
        <h2 className="text-3xl font-bold text-gray-900">PRIVATE INFORMATION</h2>
        <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Only visible to administrators</p>
        <p className="text-gray-600">
          We use this information only to contact you about verification, corrections, or billing. It will not appear
          publicly on the map.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Owner's Direct Phone */}
        <FormField
          control={form.control}
          name="ownerPhone"
          rules={{ 
            required: "Owner's Direct Phone is required",
            pattern: {
              value: /^[+]?[0-9\s-]{7,15}$/,
              message: "Please enter a valid phone number (7 to 15 digits, optionally starting with +)",
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 font-semibold">Owner's Direct Phone <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input
                  placeholder="+880 1XXXXXXXXX"
                  {...field}
                  className="bg-gray-50 border-gray-200"
                  type="tel"
                />
              </FormControl>
              <p className="text-xs text-gray-500 mt-1">Used only if we need to verify or fix listing details.</p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contact Email for Invoicing */}
        <FormField
          control={form.control}
          name="invoicingEmail"
          rules={{ 
            required: "Contact email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 font-semibold">Contact Email for Invoicing <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input
                  placeholder="billing@yourbusiness.com"
                  {...field}
                  className="bg-gray-50 border-gray-200"
                  type="email"
                />
              </FormControl>
              <p className="text-xs text-gray-500 mt-1">
                Receives invoices, subscription receipts, and payment updates.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
