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
  Edit2,
  Grid2x2,
  Heart,
  Map,
  Menu,
  Search,
  Share2,
  Star,
  Trophy,
  User,
  X,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { name: "Maps", href: "/maps" },
  { name: "Places", href: "/places" },
  { name: "Offer", href: "/offer" },
  { name: "Catalog", href: "/catalog" },
  { name: "For Business", href: "/for-business" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Example user data
  const user = {
    name: "John Doe",
    image: "", // if image exists it will show
  };

  const isLoggedIn = true; // change this according to auth logic

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
            <Link href="/maps">
              <Image
                src={require("@/public/logo.png")}
                alt="Dashboard Logo"
                height={200}
                width={200}
                className="w-48 h-auto"
              />
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-2xl mx-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search digital maps, cities, landmarks..."
                className="w-full bg-[#F5F5F5] border-none rounded-full py-3.5 pl-12 pr-6 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              />
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 whitespace-nowrap">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={index}
                  href={link.href}
                  className={`font-semibold text-black font-inter transition-colors py-1 rounded-lg ${
                    isActive ? "bg-primary px-3 " : ""
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="h-8 w-px bg-gray-200 mx-2"></div>

            {/* Auth Section - Desktop */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none">
                    <Avatar className="h-10 w-10 cursor-pointer">
                      <AvatarImage src={user.image} />
                      <AvatarFallback>
                        <User className="size-5" />
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-72 2overflow-hidden rounded-xl shadow-lg "
                >
                  <div className="border p-3 rounded-md text-center">
                    {/* Avatar with Achievement Badge */}
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <Image
                        src={
                          "https://images.unsplash.com/photo-1774028156721-706b219614b2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        }
                        alt={"Logo"}
                        fill
                        className="rounded-lg object-cover"
                      />
                      <div className="absolute bottom-0 right-0 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white">
                        ⭐
                      </div>
                    </div>

                    {/* User Name */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      User
                    </h2>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button className="w-full bg-yellow-400 hover:bg-primary hover:text-white text-black font-semibold rounded flex items-center justify-center gap-2">
                        <Edit2 size={18} />
                        Edit Profile
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full rounded flex items-center justify-center gap-2 border-gray-200 hover:bg-primary hover:text-white"
                      >
                        <Share2 size={18} />
                        Share Profile
                      </Button>
                    </div>
                  </div>
                  <div className="py-2">
                    <Link href={"/profile"}>
                      <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                        <Grid2x2 className="mr-3 size-5" />
                        Profile
                      </DropdownMenuItem>
                    </Link>

                    <Link href={"/dashboard"}>
                      <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                        <Grid2x2 className="mr-3 size-5" />
                        Dashoard
                      </DropdownMenuItem>
                    </Link>
                    <Link href={"/profile/favorite-places"}>
                      <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                        <Heart className="mr-3 size-5" />
                        Favorites
                      </DropdownMenuItem>
                    </Link>

                    <Link href={"/profile/purchased-maps"}>
                      <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                        <Map className="mr-3 size-5" />
                        Purchased Maps
                      </DropdownMenuItem>
                    </Link>

                    <Link href={"/profile/contributions-reviews"}>
                      <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                        <Star className="mr-3 size-5" />
                        Contributions & Reviews
                      </DropdownMenuItem>
                    </Link>

                    <Link href={"/profile/awards"}>
                      <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                        <Trophy className="mr-3 size-5" />
                        Awards
                      </DropdownMenuItem>
                    </Link>
                  </div>

                  <DropdownMenuSeparator />

                  <button className="w-full bg-[#FFC107] hover:bg-[#FFB300] py-3 font-semibold text-center">
                    Log Out
                  </button>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/dashboard">
                <Button className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold font-public-sans rounded-xl px-8 py-6 text-base shadow-none">
                  Log In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile & Tablet Icons */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Search Toggle Button */}
            <button
              onClick={toggleSearch}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Toggle search"
            >
              <Search className="size-5 md:hidden" />
            </button>

            {/* Profile Icon */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none ">
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage src={user.image} />
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
                  <div className="py-2">
                    <Link href={"/profile"}>
                      <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                        <Grid2x2 className="mr-3 size-5" />
                        Profile
                      </DropdownMenuItem>
                    </Link>

                    <Link href={"/dashboard"}>
                      <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                        <Grid2x2 className="mr-3 size-5" />
                        Dashoard
                      </DropdownMenuItem>
                    </Link>
                    <Link href={"/profile/favorite-places"}>
                      <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                        <Heart className="mr-3 size-5" />
                        Favorites
                      </DropdownMenuItem>
                    </Link>

                    <Link href={"/profile/purchased-maps"}>
                      <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                        <Map className="mr-3 size-5" />
                        Purchased Maps
                      </DropdownMenuItem>
                    </Link>

                    <Link href={"/profile/contributions-reviews"}>
                      <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                        <Star className="mr-3 size-5" />
                        Contributions & Reviews
                      </DropdownMenuItem>
                    </Link>

                    <Link href={"/profile/awards"}>
                      <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                        <Trophy className="mr-3 size-5" />
                        Awards
                      </DropdownMenuItem>
                    </Link>
                  </div>

                  <DropdownMenuSeparator />

                  <button className="w-full bg-[#FFC107] hover:bg-[#FFB300] py-3 font-semibold text-center">
                    Log Out
                  </button>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/dashboard">
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
          className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
            isSearchOpen ? "translate-x-0" : "translate-x-full"
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
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                type="text"
                placeholder="Search digital maps, cities, landmarks..."
                className="w-full bg-[#F5F5F5] border-none rounded-full py-3.5 pl-12 pr-6 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                autoFocus
              />
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Menu Slide-in */}
        <div
          className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={closeMenus}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="space-y-2">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={index}
                    href={link.href}
                    onClick={closeMenus}
                    className={`block px-4 py-3 font-semibold text-black font-inter transition-colors rounded-lg ${
                      isActive ? "bg-primary" : "hover:bg-gray-100"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* User Menu Items (Mobile) */}
            {isLoggedIn && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-3 px-4">
                  Account
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={closeMenus}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Heart className="size-5" />
                    <span>Favorites</span>
                  </button>

                  <button
                    onClick={closeMenus}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Map className="size-5" />
                    <span>Purchased Maps</span>
                  </button>

                  <button
                    onClick={closeMenus}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Star className="size-5" />
                    <span>Contributions & Reviews</span>
                  </button>

                  <button
                    onClick={closeMenus}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Trophy className="size-5" />
                    <span>Awards</span>
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
    </div>
  );
}
