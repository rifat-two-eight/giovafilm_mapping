"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { Clock, Earth, Mail, MapPin } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface BusinessFormStep1Props {
  form: UseFormReturn<any>;
}

export function BusinessFormStep1({ form }: BusinessFormStep1Props) {
  const { data: categoriesRes, isLoading: isLoadingCats } = useGetCategoriesQuery({ limit: 100 });
  const categories = categoriesRes?.data || [];

  return (
    <div className="space-y-6">
      {/* Public Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Earth className="size-4" />

          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            PUBLIC INFORMATION
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 font-semibold">
                  Business Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Sunset Peak Lodge"
                    {...field}
                    type="text"
                    className="bg-gray-50 border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 font-semibold ">
                  Category
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoadingCats}
                >
                  <FormControl className="w-full">
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder={isLoadingCats ? "Loading categories..." : "Select a category"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="businessDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 font-semibold">
                Business Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell travelers what makes your spot special..."
                  {...field}
                  className="bg-gray-50 border-gray-200 min-h-32"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Contact & Links Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-yellow-400" />
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            CONTACT & LINKS
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 font-semibold">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="+1 (555) 000-0000"
                    {...field}
                    type="tel"
                    className="bg-gray-50 border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 font-semibold">
                  Website URL
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://yourwebsite.com"
                    {...field}
                    type="url"
                    className="bg-gray-50 border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="instagram"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 font-semibold">
                Instagram Username
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="@username"
                  {...field}
                  className="bg-gray-50 border-gray-200"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Location Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-yellow-400" />
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            LOCATION
          </h3>
        </div>

        <FormField
          control={form.control}
          name="streetAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 font-semibold">
                Street Address
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="123 Adventure Lane"
                  {...field}
                  className="bg-gray-50 border-gray-200"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 font-semibold">
                  City
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="City"
                    {...field}
                    className="bg-gray-50 border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 font-semibold">
                  Country
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Country"
                    {...field}
                    className="bg-gray-50 border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Hours Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              HOURS
            </h3>
          </div>
          <button className="text-xs font-semibold text-yellow-600 hover:text-yellow-700">
            Custom Hours
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 items-end">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Mon - Fri
              </label>
            </div>
            <FormField
              control={form.control}
              name="hoursMonFriStart"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      className="bg-gray-50 border-gray-200"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hoursMonFriEnd"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      className="bg-gray-50 border-gray-200"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 items-end">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Sat - Sun
              </label>
            </div>
            <FormField
              control={form.control}
              name="hoursSatSunStart"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      className="bg-gray-50 border-gray-200"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hoursSatSunEnd"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      className="bg-gray-50 border-gray-200"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
