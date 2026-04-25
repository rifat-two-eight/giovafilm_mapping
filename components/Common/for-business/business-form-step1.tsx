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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { Clock, Earth, Mail, Plus } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface BusinessFormStep1Props {
  form: UseFormReturn<any>;
}

export function BusinessFormStep1({ form }: BusinessFormStep1Props) {
  const { data: categoriesRes, isLoading: isLoadingCats } =
    useGetCategoriesQuery({ limit: 100 });
  const categories = categoriesRes?.data || [];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
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
    if (!selectedDay) return;

    const dailyHours = form.getValues("dailyHours");
    const updatedHours = dailyHours.map((h: any) => {
      if (h.day === selectedDay) {
        return { ...h, isOpen: true, openTime: startTime, closeTime: endTime };
      }
      return h;
    });

    form.setValue("dailyHours", updatedHours);
    setIsDialogOpen(false);
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
          <h3 className="text-base font-semibold text-gray-500 uppercase tracking-wide">
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
      {/* <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-yellow-400" />
          <h3 className="text-base font-semibold text-gray-500 uppercase tracking-wide">
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
      </div> */}

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
              <button className="text-base font-semibold text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
                <Plus size={14} />
                Add Custom Hours
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Business Hours</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">
                    Select Day
                  </Label>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700">
                      Start Time
                    </Label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700">
                      End Time
                    </Label>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <Button
                    variant="outline"
                    className="flex-1 font-bold text-gray-500 hover:text-gray-700 rounded-xl h-11"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
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
        <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="grid grid-cols-2 bg-gray-100/50 px-4 py-2 border-b border-gray-100">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Day
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Status / Hours
            </span>
          </div>
          <div className="p-2 space-y-1">
            {form.watch("dailyHours").map((dayHour: any) => (
              <div
                key={dayHour.day}
                className="grid grid-cols-2 px-3 py-2 rounded-lg hover:bg-white transition-colors group"
              >
                <span className="text-sm font-bold text-gray-600">
                  {dayHour.day}
                </span>
                <span
                  className={`text-sm font-black tracking-tight ${
                    dayHour.isOpen ? "text-gray-900" : "text-red-400 opacity-60"
                  }`}
                >
                  {dayHour.isOpen
                    ? `${formatTime(dayHour.openTime)} – ${formatTime(dayHour.closeTime)}`
                    : "CLOSED"}
                </span>
              </div>
            ))}
          </div>
        </div>
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
