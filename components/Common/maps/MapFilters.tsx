"use client";

import { CategoryIcon } from "@/components/shared/categories/category-icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface MapFiltersProps {
  isMobile: boolean;
  fetchedCategories: any[];
  enabledCategories: Record<string, boolean>;
  fetchedPlaces: any[];
  handleToggle: (id: string, value: boolean) => void;
  setSelectedLocation: (loc: any) => void;
  selectedLocation: any;
  selectedCountry: string;
  setSelectedCountry: (val: string) => void;
  setIsManualSelection: (val: boolean) => void;
  availableCountries: string[];
  isLoggedIn?: boolean;
  isLoading?: boolean;
}

export function MapFilters({
  isMobile,
  fetchedCategories,
  enabledCategories,
  fetchedPlaces,
  handleToggle,
  setSelectedLocation,
  selectedLocation,
  selectedCountry,
  setSelectedCountry,
  setIsManualSelection,
  availableCountries,
  isLoggedIn = true,
  isLoading = false,
}: MapFiltersProps) {
  const hasCategories = fetchedCategories.length > 0;
  const mapLabel = selectedCountry || "this map";

  return (
    <div className="flex flex-col md:flex-row items-start gap-2">
      {/* Category Filter */}
      <div
        className="bg-white rounded-lg shadow-lg border border-gray-200"
        style={{ width: "350px" }}
      >
        <Accordion
          type="single"
          collapsible
          defaultValue="categories-main"
          className="w-full"
        >
          <AccordionItem value="categories-main" className="border-none">
            <AccordionTrigger className="px-4 py-3 hover:no-underline bg-gray-50/50 flex justify-between items-center w-full">
              <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">
                Map Categories
              </span>
            </AccordionTrigger>
            <AccordionContent
              className="pb-0 border-t border-gray-100"
              style={{
                overflowY: "auto",
                height: hasCategories && !isLoading ? "80vh" : "auto",
              }}
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 px-5 py-10">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                  <p className="text-sm font-medium text-gray-600">
                    Loading categories...
                  </p>
                </div>
              ) : hasCategories ? (
                <div className="">
                  <Accordion type="single" collapsible className="w-full">
                    {fetchedCategories.map((cat: any) => {
                      const enabled = enabledCategories[String(cat._id)] ?? true;
                      const placesInCat = fetchedPlaces.filter((p: any) => {
                        const pCatId =
                          typeof p.category === "object" && p.category !== null
                            ? p.category._id || p.category.id
                            : p.category;
                        return String(pCatId) === String(cat._id);
                      });

                      return (
                        <AccordionItem
                          key={cat._id}
                          value={cat._id}
                          className=""
                        >
                          <div className="flex items-center justify-between group border-b border-gray-100 last:border-b-0">
                            <AccordionTrigger className="flex-1 py-2 px-4 transition-colors">
                              <div className="flex items-center gap-3 w-full">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                                  <CategoryIcon
                                    icon={cat.icon}
                                    size={18}
                                    color="#fff"
                                  />
                                </div>
                                <span className="text-left text-sm font-semibold text-gray-700 capitalize">
                                  {cat.name.length > 25
                                    ? `${cat.name.slice(0, 25)}...`
                                    : cat.name}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <div className="pr-4 py-3 bg-transparent group-hover:bg-gray-50 transition-colors">
                              <Switch
                                checked={enabled}
                                onCheckedChange={(val) =>
                                  handleToggle(String(cat._id), val)
                                }
                                className={`${enabled ? "bg-primary" : "bg-gray-300"} data-[state=checked]:bg-amber-400 data-[state=unchecked]:bg-gray-300 scale-75`}
                              />
                            </div>
                          </div>
                          <AccordionContent className="bg-gray-50/30 px-0 pb-0">
                            <div className="py-1">
                              {placesInCat.length > 0 ? (
                                placesInCat.map((place: any) => (
                                  <button
                                    key={place._id}
                                    onClick={() =>
                                      setSelectedLocation({
                                        id: place._id,
                                        type: place.type,
                                      })
                                    }
                                    className={`w-full flex items-center gap-3 px-6 py-2 text-left transition-all ${
                                      selectedLocation?.id === place._id
                                        ? "bg-blue-600 text-white font-bold shadow-md"
                                        : "text-gray-600 hover:bg-white hover:text-blue-600"
                                    }`}
                                  >
                                    <div
                                      className={`w-1.5 h-1.5 rounded-full ${selectedLocation?.id === place._id ? "bg-white" : "bg-blue-400"}`}
                                    />
                                    <div className="flex flex-col min-w-0">
                                      <span className="truncate">
                                        {place.name}
                                      </span>
                                    </div>
                                  </button>
                                ))
                              ) : (
                                <div className="px-10 py-3 text-gray-400 italic">
                                  No places in this category yet.
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              ) : (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm font-semibold text-gray-800">
                    No locations available
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                    {isLoggedIn
                      ? `There are no published locations for ${mapLabel} yet. Try another map or check back later.`
                      : `No business locations are available for ${mapLabel} right now. Sign in to explore more maps, or try another map.`}
                  </p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Country Filter */}
      <div className="w-40 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <Select
          onValueChange={(val) => {
            setSelectedCountry(val);
            setIsManualSelection(true);
          }}
          value={selectedCountry}
        >
          <SelectTrigger className="w-full py-6 border-none focus:ring-0 font-semibold text-gray-800 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-gray-100 shadow-xl capitalize">
            {availableCountries.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-gray-500">
                No maps available.
              </div>
            ) : (
              availableCountries.map((country: string) => (
                <SelectItem
                  key={country}
                  value={country}
                  className="capitalize font-medium"
                >
                  {country}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
