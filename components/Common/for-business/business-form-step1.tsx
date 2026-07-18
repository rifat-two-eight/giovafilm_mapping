"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { Clock, Earth, Mail, Plus, X, MapPin } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface BusinessFormStep1Props {
  form: UseFormReturn<any>;
}

export function BusinessFormStep1({ form }: BusinessFormStep1Props) {
  const { data: categoriesRes, isLoading: isLoadingCats } =
    useGetCategoriesQuery({ limit: 100 });

  const allCategories: any[] = categoriesRes?.data || [];
  // Show only categories that are tagged as "business" type,
  // or whose name includes "business" (case-insensitive) as a fallback.
  const categories = allCategories.filter(
    (cat: any) =>
      cat.type === "business" || cat.name?.toLowerCase().includes("business"),
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectionType, setSelectionType] = useState<
    "everyday" | "range" | "individual" | "always-open"
  >("everyday");
  
  const [startDay, setStartDay] = useState("Monday");
  const [endDay, setEndDay] = useState("Friday");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");

  const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleAddHours = () => {
    let dayString = "";
    if (selectionType === "always-open") {
      const currentHours = form.getValues("dailyHours") || [];
      const activeHours = currentHours.filter((h: any) => h.isOpen);
      form.setValue("dailyHours", [
        ...activeHours,
        {
          day: "Always Open",
          isOpen: true,
          openTime: "",
          closeTime: "",
          id: Date.now().toString(),
          alwaysOpen: true,
        },
      ]);
      setIsDialogOpen(false);
      return;
    }
    if (selectionType === "everyday") {
      dayString = "Mon - Sun";
    } else if (selectionType === "range") {
      dayString = `${startDay.substring(0, 3)} - ${endDay.substring(0, 3)}`;
    } else {
      if (selectedDays.length === 0) return;
      if (selectedDays.length === 1) {
        dayString = selectedDays[0];
      } else {
        dayString = selectedDays.map((d) => d.substring(0, 3)).join(", ");
      }
    }

    const currentHours = form.getValues("dailyHours") || [];
    const activeHours = currentHours.filter((h: any) => h.isOpen);

    form.setValue("dailyHours", [
      ...activeHours,
      {
        day: dayString,
        isOpen: true,
        openTime: startTime,
        closeTime: endTime,
        id: Date.now().toString(),
      },
    ]);

    setIsDialogOpen(false);
    // reset selection state
    setSelectedDays([]);
    setStartDay("Monday");
    setEndDay("Friday");
  };

  const handleRemoveHour = (index: number) => {
    const currentHours = form.getValues("dailyHours") || [];
    const activeHours = currentHours.filter((h: any) => h.isOpen);
    const updated = [...activeHours];
    updated.splice(index, 1);
    form.setValue("dailyHours", updated);
  };

  return (
    <div className="space-y-6">
      {/* Public Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Earth className="size-4" />

          <h3 className="text-base font-semibold text-gray-500 uppercase tracking-wide">
            PUBLIC INFORMATION
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="businessName"
            rules={{ required: "Business name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 font-semibold">
                  Business Name <span className="text-red-500">*</span>
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
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 font-semibold ">
                  Category <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoadingCats}
                >
                  <FormControl className="w-full">
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue
                        placeholder={
                          isLoadingCats
                            ? "Loading categories..."
                            : "Select a category"
                        }
                      />
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
          rules={{ required: "Business description is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 font-semibold">
                Business Description <span className="text-red-500">*</span>
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
          <h3 className="text-base font-semibold text-gray-500 uppercase tracking-wide">
            CONTACT & LINKS
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phoneNumber"
            rules={{ 
              required: "Public phone number is required",
              pattern: {
                value: /^[+]?[0-9\s-]{7,15}$/,
                message: "Please enter a valid phone number (7 to 15 digits, optionally starting with +)",
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 font-semibold">
                  Phone Number <span className="text-red-500">*</span>
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
            rules={{
              pattern: {
                value: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\/[a-zA-Z0-9-._~:?#[\]@!$&'()*+,;=]*)?$/,
                message: "Please enter a valid website URL",
              }
            }}
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
          <h3 className="text-base font-semibold text-gray-500 uppercase tracking-wide">
            LOCATION
          </h3>
        </div>

        <FormField
          control={form.control}
          name="streetAddress"
          rules={{ required: "Street address is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 font-semibold">
                Street Address <span className="text-red-500">*</span>
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
            rules={{ required: "City is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 font-semibold">
                  City <span className="text-red-500">*</span>
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
            rules={{ required: "Country is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 font-semibold">
                  Country <span className="text-red-500">*</span>
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
            <h3 className="text-base font-semibold text-gray-500 uppercase tracking-wide">
              HOURS
            </h3>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button type="button" className="text-base font-semibold text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
                <Plus size={14} />
                Add Custom Hours
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Business Hours</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                  <button
                    type="button"
                    className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${selectionType === "everyday" ? "border-yellow-400 text-yellow-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}
                    onClick={() => setSelectionType("everyday")}
                  >
                    Everyday
                  </button>
                  <button
                    type="button"
                    className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${selectionType === "range" ? "border-yellow-400 text-yellow-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}
                    onClick={() => setSelectionType("range")}
                  >
                    Date Range
                  </button>
                  <button
                    type="button"
                    className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${selectionType === "individual" ? "border-yellow-400 text-yellow-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}
                    onClick={() => setSelectionType("individual")}
                  >
                    Individual Days
                  </button>
                  <button
                    type="button"
                    className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${selectionType === "always-open" ? "border-green-500 text-green-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}
                    onClick={() => setSelectionType("always-open")}
                  >
                    Always Open
                  </button>
                </div>

                {selectionType === "everyday" && (
                  <div className="py-2">
                    <p className="text-sm font-medium text-gray-500">
                      This schedule will apply to all 7 days of the week.
                    </p>
                  </div>
                )}

                {selectionType === "range" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-gray-700">
                        Start Day
                      </Label>
                      <Select value={startDay} onValueChange={setStartDay}>
                        <SelectTrigger className="bg-gray-50 border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-gray-700">
                        End Day
                      </Label>
                      <Select value={endDay} onValueChange={setEndDay}>
                        <SelectTrigger className="bg-gray-50 border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {selectionType === "always-open" && (
                  <div className="py-4 flex flex-col items-center gap-2 text-center">
                    <span className="text-3xl">🕐</span>
                    <p className="text-sm font-semibold text-green-700">
                      This business is open 24 hours, 7 days a week.
                    </p>
                    <p className="text-xs text-gray-400">
                      No specific opening or closing times will be set.
                    </p>
                  </div>
                )}

                {selectionType === "individual" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700">
                      Select Days
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS.map((d) => {
                        const isSelected = selectedDays.includes(d);
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => {
                              setSelectedDays((prev) =>
                                prev.includes(d)
                                  ? prev.filter((x) => x !== d)
                                  : [...prev, d],
                              );
                            }}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${isSelected ? "bg-yellow-100 border-yellow-400 text-yellow-700" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}
                          >
                            {d.substring(0, 3)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectionType !== "always-open" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-gray-700">
                        Start Time
                      </Label>
                      <div className="relative">
                        <Input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="bg-gray-50 border-gray-200 pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        />
                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-gray-700">
                        End Time
                      </Label>
                      <div className="relative">
                        <Input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="bg-gray-50 border-gray-200 pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        />
                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 font-bold text-gray-500 hover:text-gray-700 rounded-xl h-11"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white font-black rounded-xl h-11 tracking-widest shadow-lg shadow-yellow-100 transition-all"
                    onClick={handleAddHours}
                  >
                    ADD
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Schedule Summary Display */}
        {form.watch("dailyHours")?.filter((h: any) => h.isOpen)?.length > 0 && (
          <div className="pt-2 pb-4">
            <div className="flex flex-col gap-4 w-full md:w-3/4 lg:w-2/3">
              {form
                .watch("dailyHours")
                .filter((h: any) => h.isOpen)
                .map((dayHour: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4"
                  >
                    <span className="text-sm md:text-base font-bold text-gray-800 min-w-[100px]">
                      {dayHour.day}
                    </span>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      {dayHour.alwaysOpen ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-bold">
                          🕐 Always Open
                        </span>
                      ) : (
                        <>
                          <div className="relative flex-1 md:w-32">
                            <Input
                              readOnly
                              value={dayHour.openTime}
                              className="bg-gray-50/50 border-gray-200 text-gray-700 font-medium pr-10 rounded-xl focus-visible:ring-0"
                            />
                            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>

                          <div className="relative flex-1 md:w-32">
                            <Input
                              readOnly
                              value={dayHour.closeTime}
                              className="bg-gray-50/50 border-gray-200 text-gray-700 font-medium pr-10 rounded-xl focus-visible:ring-0"
                            />
                            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveHour(idx)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const formatTime = (time: string) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const h = parseInt(hour);
  const ampm = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 || 12;
  return `${formattedHour}${minute === "00" ? "" : ":" + minute}${ampm}`;
};
