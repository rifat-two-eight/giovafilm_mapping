"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Check,
  CircleDollarSign,
  Edit2,
  Grid2x2,
  Heart,
  Loader2,
  Map,
  Menu,
  Search,
  Share2,
  Star,
  Trophy,
  User,
  X,
} from "lucide-react";

import { getImageUrl } from "@/lib/utils";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { logout } from "@/redux/features/auth/authSlice";
import { broadcastLogout } from "@/components/shared/cross-tab-logout-listener";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import { useGetPlacesQuery } from "@/redux/features/place/placeApi";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { persistor } from "@/redux/store";
import { baseApi } from "@/redux/api/baseApi";
import Image from "next/image";
import logo from "@/public/logo.png";
import Link from "next/link";
import { AuthLink } from "@/components/shared/auth-link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { NoImage } from "@/lib/others/others";
import { Progress } from "@/components/ui/progress";
import ProfileUpdateModal from "@/components/Common/profile/profile-update-modal";
import { shareProfile } from "@/lib/share-profile";

const navLinks = [
  { name: "Maps", href: "/maps" },
  { name: "Places", href: "/places" },
  { name: "Offer", href: "/offer" },
  { name: "Catalog", href: "/catalog" },
  { name: "For Business", href: "/for-business" },
];

export const menuItems = [
  // {
  //   label: "Profile",
  //   href: "/profile",
  //   icon: Grid2x2,
  // },
  {
    label: "My Business",
    href: "/profile/my-business",
    icon: Grid2x2,
  },
  {
    label: "Favorites",
    href: "/profile/favorite-places",
    icon: Heart,
  },
  {
    label: "Purchased Maps",
    href: "/profile/purchased-maps",
    icon: Map,
  },
  {
    label: "Contributions & Reviews",
    href: "/profile/contributions-reviews",
    icon: Star,
  },
  {
    label: "Subscription",
    href: "/profile/subscription",
    icon: CircleDollarSign,
  },
  {
    label: "Awards",
    href: "/profile/awards",
    icon: Trophy,
  },
];

export default function Header() {
  const pathname = usePathname();
  const hideHeaderSearch = pathname === "/places" || pathname === "/offer";
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [enterSearching, setEnterSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: placesRes, isFetching } = useGetPlacesQuery(
    { searchTerm: debouncedSearch, limit: 5 },
    { skip: debouncedSearch.trim().length === 0 },
  );
  const places = placesRes?.data || [];
  const isSearchPending =
    enterSearching ||
    (searchTerm.trim().length > 0 &&
      (searchTerm !== debouncedSearch || isFetching));
  const isAuthenticated = useAppSelector((state) => state.auth.accessToken);

  const submitHeaderSearch = () => {
    const next = searchTerm.trim();
    if (!next) return;
    setEnterSearching(true);
    setDebouncedSearch(next);
  };

  useEffect(() => {
    if (!enterSearching) return;
    if (isFetching) return;
    const timer = setTimeout(() => setEnterSearching(false), 500);
    return () => clearTimeout(timer);
  }, [enterSearching, isFetching]);

  const { data: user } = useGetProfileQuery({});
  const isAdminOrEditor = ["super_admin", "admin", "map_editor"].includes(user?.role || "");
  const visibleMenuItems = isAdminOrEditor
    ? menuItems.filter((item) =>
        ["Favorites", "Contributions & Reviews", "Awards"].includes(item.label)
      )
    : menuItems;
  const [logoutApi] = useLogoutMutation();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSharingProfile, setIsSharingProfile] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleEditProfile = () => {
    setIsProfileMenuOpen(false);
    // Let dropdown close before opening dialog (avoids focus trap conflicts)
    setTimeout(() => setIsUpdateModalOpen(true), 50);
  };

  const handleShareProfile = async () => {
    setIsSharingProfile(true);
    const result = await shareProfile({
      userId: user?._id,
      name: user?.name,
    });
    setIsSharingProfile(false);
    if (result === "copied" || result === "shared") {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const USER_LEVELS = [
    { level: 0, name: "Explorador", points: 0 },
    { level: 1, name: "Aventurero", points: 100 },
    { level: 2, name: "Tlacuilo", points: 200 },
    { level: 3, name: "Expedicionario", points: 400 },
    { level: 4, name: "Viajero", points: 700 },
    { level: 5, name: "Chasqui", points: 1300 },
    { level: 6, name: "Cronista", points: 2300 },
    { level: 7, name: "Pochteca", points: 4000 },
    { level: 8, name: "Navegante", points: 6500 },
    { level: 9, name: "Cartógrafo", points: 10000 },
    { level: 10, name: "Gran Explorador", points: 15000 },
    { level: 11, name: "Conquistador", points: 22500 },
    { level: 12, name: "Gran Conquistador", points: 33000 },
    { level: 13, name: "Amauta", points: 48000 },
    { level: 14, name: "Leyenda", points: 67500 }
  ];
  const currentLevelIndex = user?.level || 0;
  const nextLevelIndex = currentLevelIndex < 14 ? currentLevelIndex + 1 : 14;
  const maxPoints = USER_LEVELS[nextLevelIndex]?.points || 1000;
  const progress = maxPoints > 0 ? ((user?.points || 0) / maxPoints) * 100 : 100;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Must await API to clear httpOnly refreshToken cookie before clearing local state.
      // Otherwise, concurrent API calls on redirect will get 401 and refresh the token automatically!
      await logoutApi({}).unwrap();
    } catch {
      // Ignore errors
    } finally {
      broadcastLogout(); // signal all other tabs
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());
      persistor.purge();
      localStorage.clear();
      closeMenus();
      router.push("/");
      setIsLoggingOut(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setIsMenuOpen(false);
    }
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  return (
    <div>
      <header className="border-b border-gray-100 relative">
        <nav className="flex items-center justify-between px-1 md:px-6 py-4 max-w-360 mx-auto gap-4">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/">
              <Image
                src={logo}
                alt="Dashboard Logo"
                height={200}
                width={200}
                className="w-48 h-auto"
              />
            </Link>
          </div>

          {/* Search Bar - Desktop — hidden on Places/Offers (page has its own) */}
          {!hideHeaderSearch && (
          <div className="hidden md:block flex-1 max-w-2xl mx-4">
            <div className="relative group">
              <button
                type="button"
                onClick={submitHeaderSearch}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
                aria-label="Search"
              >
                <Search className="size-5" />
              </button>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submitHeaderSearch();
                  }
                }}
                placeholder="Search digital maps, cities, landmarks..."
                className="w-full bg-[#F5F5F5] border-none rounded-full py-3.5 pl-12 pr-6 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              />

              {/* Search Results Dropdown */}
              {searchTerm && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  {isSearchPending ? (
                    <div className="p-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                      Searching...
                    </div>
                  ) : places.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto">
                      {places.map((place: any) => (
                        <Link
                          key={place._id}
                          href={`/places/${place._id}`}
                          onClick={() => setSearchTerm("")}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                        >
                          <div className="size-10 rounded-lg overflow-hidden shrink-0">
                            {place.media?.[0] ? (
                              <img
                                src={getImageUrl(place.media[0])}
                                alt={place.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Map className="size-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                              {place.name}
                            </h4>
                            <p className="text-xs text-gray-500 truncate">
                              {place.address}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No places found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          )}

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 whitespace-nowrap">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href;

              return (
                <AuthLink
                  key={index}
                  href={link.href}
                  className={`font-semibold text-black font-inter transition-colors py-1 rounded-lg ${isActive ? "bg-primary px-3 " : ""
                    }`}
                >
                  {link.name}
                </AuthLink>
              );
            })}

            <div className="h-8 w-px bg-gray-200 mx-2"></div>

            {/* Auth Section - Desktop */}
            {isAuthenticated ? (
              <DropdownMenu
                open={isProfileMenuOpen}
                onOpenChange={setIsProfileMenuOpen}
              >
                <DropdownMenuTrigger asChild>
                  <button className="outline-none">
                    <Avatar className="h-10 w-10 cursor-pointer border">
                      {user?.profile ? (
                        <AvatarImage
                          src={getImageUrl(user.profile)}
                          width={500}
                          height={500}
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback>
                          <User className="size-5" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-72 2overflow-hidden rounded-xl shadow-lg "
                >
                  <div className="border p-3 rounded-md text-center">
                    {/* Avatar with Achievement Badge */}
                    <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-lg border">
                      {user?.profile ? (
                        <Image
                          src={getImageUrl(user?.profile)}
                          alt={"Logo"}
                          width={500}
                          height={500}
                          unoptimized
                          className="object-cover h-full"
                        />
                      ) : (
                        <NoImage />
                      )}

                      <div className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white">
                        ⭐
                      </div>
                    </div>

                    {/* User Name */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {user?.name}
                    </h2>

                    <div className="space-y-1 mb-4">
                      <p>
                        Level <span className="font-bold">{user?.level}</span>
                      </p>

                      <Progress value={progress} className="h-2" />

                      <p className="text-sm text-gray-500">
                        {user?.points || 0} / {maxPoints} points
                      </p>
                    </div>

                    {/* Level Badge */}
                    {/* <div className="inline-block bg-yellow-50 px-3 py-0.5 rounded-full mb-2">
                      <span className="text-primary font-semibold capitalize">
                        {user?.role}
                      </span>
                    </div> */}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        type="button"
                        onClick={handleEditProfile}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded flex items-center justify-center gap-2"
                      >
                        <Edit2 size={18} />
                        Edit Profile
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleShareProfile}
                        disabled={isSharingProfile || !user?._id}
                        className="w-full rounded flex items-center justify-center gap-2 border-gray-200 hover:bg-yellow-50"
                      >
                        {isSharingProfile ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : shareCopied ? (
                          <Check size={18} className="text-green-600" />
                        ) : (
                          <Share2 size={18} />
                        )}
                        {shareCopied ? "Link Copied!" : "Share Profile"}
                      </Button>
                    </div>
                  </div>
                  <div className="py-2">
                    {isAdminOrEditor && (
                      <Link href={"/dashboard"}>
                        <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                          <Grid2x2 className="mr-3 size-5" />
                          Dashoard
                        </DropdownMenuItem>
                      </Link>
                    )}
                    <div>
                      {visibleMenuItems.map((item, index) => {
                        const Icon = item.icon;

                        return (
                          <Link key={index} href={item.href}>
                            <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                              <Icon className="mr-3 size-5" />
                              {item.label}
                            </DropdownMenuItem>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  {/* ✅ Logout button wired up */}
                  <Button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full bg-[#FFC107] hover:bg-[#FFB300] py-3 font-semibold text-center"
                  >
                    {isLoggingOut ? "Logging out..." : "Log Out"}
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold font-public-sans rounded-xl px-8 py-6 text-base shadow-none">
                  Log In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile & Tablet Icons */}
          <div className="flex lg:hidden items-center gap-3">
            {!hideHeaderSearch && (
            <button
              onClick={toggleSearch}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Toggle search"
            >
              <Search className="size-5 md:hidden" />
            </button>
            )}

            {/* Profile Icon - Mobile */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none ">
                    <Avatar className="h-8 w-8 cursor-pointer">
                      {user?.profile ? (
                        <AvatarImage src={getImageUrl(user.profile)} />
                      ) : (
                        <User className="size-4" />
                      )}
                      <AvatarFallback>
                        <User className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-64 p-0 overflow-hidden rounded-xl shadow-lg"
                >
                  {isAdminOrEditor && (
                    <Link href={"/dashboard"}>
                      <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                        <Grid2x2 className="mr-3 size-5" />
                        Dashoard
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <div className="py-2">
                    {visibleMenuItems.map((item, index) => {
                      const Icon = item.icon;

                      return (
                        <Link key={index} href={item.href}>
                          <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                            <Icon className="mr-3 size-5" />
                            {item.label}
                          </DropdownMenuItem>
                        </Link>
                      );
                    })}
                  </div>

                  <DropdownMenuSeparator />

                  {/* ✅ Logout button wired up - Mobile dropdown */}
                  <Button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full bg-[#FFC107] hover:bg-[#FFB300] py-3 font-semibold text-center"
                  >
                    {isLoggingOut ? "Logging out..." : "Log Out"}
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold font-public-sans rounded-xl px-4 py-2 text-sm shadow-none">
                  Log In
                </Button>
              </Link>
            )}

            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile & Tablet Search Slide-in */}
        <div
          className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${isSearchOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Search</h2>
              <button
                onClick={closeMenus}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={submitHeaderSearch}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                aria-label="Search"
              >
                <Search className="size-5" />
              </button>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submitHeaderSearch();
                  }
                }}
                placeholder="Search digital maps, cities, landmarks..."
                className="w-full bg-[#F5F5F5] border-none rounded-full py-3.5 pl-12 pr-6 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                autoFocus
              />

              {/* Search Results Dropdown Mobile */}
              {searchTerm && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  {isSearchPending ? (
                    <div className="p-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                      Searching...
                    </div>
                  ) : places.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto">
                      {places.map((place: any) => (
                        <Link
                          key={place._id}
                          href={`/places/${place._id}`}
                          onClick={() => {
                            setSearchTerm("");
                            closeMenus();
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                        >
                          <div className="size-10 rounded-lg overflow-hidden shrink-0">
                            {place.media?.[0] ? (
                              <img
                                src={getImageUrl(place.media[0])}
                                alt={place.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Map className="size-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                              {place.name}
                            </h4>
                            <p className="text-xs text-gray-500 truncate">
                              {place.address}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No places found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Menu Slide-in */}
        <div
          className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-0">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={closeMenus}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;

                return (
                  <AuthLink
                    key={index}
                    href={link.href}
                    onClick={closeMenus}
                    className={`block px-4 py-2 font-semibold text-black font-inter transition-colors rounded-lg ${isActive ? "bg-primary" : "hover:bg-gray-100"
                      }`}
                  >
                    {link.name}
                  </AuthLink>
                );
              })}
            </div>

            {/* User Menu Items in Hamburger (Mobile) */}
            {isAuthenticated && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-3 px-4">
                  Account
                </h3>

                <div className="space-y-1">
                  {isAdminOrEditor && (
                    <Link
                      href={"/dashboard"}
                      onClick={closeMenus}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors font-semibold"
                    >
                      <Grid2x2 className="size-5" />
                      Dashoard
                    </Link>
                  )}
                  <div className="space-y-1">
                    {visibleMenuItems.map((item, index) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={index}
                          href={item.href}
                          onClick={closeMenus}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Icon className="size-5" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* ✅ Logout in hamburger menu */}
                  <button
                    onClick={() => handleLogout()}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors text-left mt-4"
                  >
                    <Map className="size-5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Overlay */}
        {(isMenuOpen || isSearchOpen) && (
          <div
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 lg:hidden"
            onClick={closeMenus}
          />
        )}
      </header>

      <ProfileUpdateModal
        data={user}
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
      />
    </div>
  );
}
