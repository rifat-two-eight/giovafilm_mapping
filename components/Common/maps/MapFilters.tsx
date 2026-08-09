"use client";

import { useState } from "react";
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
import { ChevronDown, SlidersHorizontal } from "lucide-react";

/** Avoid mounting hundreds of sidebar rows per category on purchased maps */
const SIDEBAR_PLACES_CAP = 40;

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
  const hasCategories = !isLoading && fetchedCategories.length > 0;
  const showEmpty = !isLoading && fetchedCategories.length === 0;
  const mapLabel = selectedCountry || "this map";
  const [mobileOpen, setMobileOpen] = useState(false);

  const panelWidth = isMobile ? "min(100%, 100vw - 1.5rem)" : "350px";
  const listHeight = isMobile
    ? hasCategories
      ? "42vh"
      : "auto"
    : hasCategories
      ? "80vh"
      : "auto";

  return (
    <div className="flex flex-col md:flex-row items-start gap-2 w-full md:w-auto">
      {isMobile && (
        <div className="flex items-center gap-2 w-full">
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex-1 flex items-center justify-between gap-1 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2.5 text-sm font-bold text-gray-900"
          >
            <span>Categories</span>
            <ChevronDown
              className={`w-4 h-4 shrink-0 transition-transform ${mobileOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div className="flex-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <Select
              onValueChange={(val) => {
                setSelectedCountry(val);
                setIsManualSelection(true);
              }}
              value={selectedCountry}
            >
              <SelectTrigger className="w-full h-full border-0 py-2.5 px-3 focus:ring-0 font-bold text-gray-800 bg-white shadow-none text-sm text-left truncate">
                <SelectValue placeholder="Select Map" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="bottom"
                align="end"
                className="rounded-xl border border-gray-100 shadow-xl max-w-[min(90vw,320px)]"
              >
                {availableCountries.length === 0 ? (
                  <div className="px-3 py-6 text-center text-sm text-gray-500">
                    No maps available.
                  </div>
                ) : (
                  availableCountries.map((country: string) => (
                    <SelectItem
                      key={country}
                      value={country}
                      className="font-medium whitespace-normal break-words py-2.5"
                    >
                      {country}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div
        className={`bg-white rounded-lg shadow-lg border border-gray-200 ${
          isMobile && !mobileOpen ? "hidden" : ""
        }`}
        style={{ width: panelWidth, maxWidth: "100%" }}
      >
        <Accordion
          type="single"
          collapsible
          defaultValue={isMobile ? undefined : "categories-main"}
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
                height: listHeight,
              }}
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 px-5 py-12 min-h-[180px]">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                  <p className="text-sm font-medium text-gray-600">
                    Loading locations...
                  </p>
                  <p className="text-xs text-gray-400">
                    Please wait while we load map data
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
                                <>
                                  {placesInCat
                                    .slice(0, SIDEBAR_PLACES_CAP)
                                    .map((place: any) => (
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
                                            {place.isLocked ? "🔒 Premium Location" : place.name}
                                          </span>
                                        </div>
                                      </button>
                                    ))}
                                  {placesInCat.length > SIDEBAR_PLACES_CAP && (
                                    <p className="px-6 py-2 text-xs text-gray-400">
                                      +{placesInCat.length - SIDEBAR_PLACES_CAP}{" "}
                                      more on map — zoom or pan to explore
                                    </p>
                                  )}
                                </>
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
              ) : showEmpty ? (
                <div className="px-5 py-8 text-center min-h-[140px] flex flex-col items-center justify-center">
                  <p className="text-sm font-semibold text-gray-800">
                    No locations available
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                    {isLoggedIn
                      ? `There are no published locations for ${mapLabel} yet. Try another map or check back later.`
                      : `No business locations are available for ${mapLabel} right now. Sign in to explore more maps, or try another map.`}
                  </p>
                </div>
              ) : null}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Selected Map Filter — Desktop */}
      <div className={`min-w-[200px] max-w-[280px] w-full md:w-max bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden flex-col gap-0 ${isMobile ? "hidden" : "flex"}`}>
        <div className="px-4 py-2.5 bg-gray-50/50">
          <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">
            Selected Map
          </span>
        </div>
        <Select
          onValueChange={(val) => {
            setSelectedCountry(val);
            setIsManualSelection(true);
          }}
          value={selectedCountry}
        >
          <SelectTrigger className="w-full !h-auto !min-h-0 rounded-none border-0 border-t border-gray-100 shadow-none py-2.5 px-3 focus:ring-0 font-semibold text-gray-800 bg-white whitespace-normal *:data-[slot=select-value]:line-clamp-none *:data-[slot=select-value]:whitespace-normal *:data-[slot=select-value]:text-left">
            <SelectValue placeholder="Select map" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            side="bottom"
            align="start"
            sideOffset={4}
            avoidCollisions={false}
            className="rounded-xl border border-gray-100 shadow-xl min-w-[var(--radix-select-trigger-width)] max-w-[min(90vw,320px)]"
          >
            {availableCountries.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-gray-500">
                No maps available.
              </div>
            ) : (
              availableCountries.map((country: string) => (
                <SelectItem
                  key={country}
                  value={country}
                  className="font-medium whitespace-normal break-words py-2.5"
                  title={country}
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
