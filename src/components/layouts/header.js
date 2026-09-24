"use client";

import Image from "next/image";
import React, { useState, useEffect, Suspense } from "react";
import Logo from "@/images/logo.png";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu whenever pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navs = [
    { label: "Home", src: "/" },
    { label: "Recipe", src: "/recipe" },
    { label: "Popular", src: "/popular" },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 py-3 bg-white/70 backdrop-blur-md border-b border-stone-200/40 w-full max-w-[100vw] box-border">
      <div className="w-full max-w-[100vw] md:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 mx-auto box-border">
        <Link href="/" className="flex items-center gap-2 brand shrink-0">
          <div className="size-10 sm:size-12 shrink-0">
            <Image src={Logo} alt="Food logo" priority />
          </div>
          <span className="text-3xl sm:text-4xl font-bold text-pink logo-text">
            Food.
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <NavMenus />
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex items-center">
          <SearchBar />
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="p-2 text-dark hover:text-pink focus:outline-none transition-colors rounded-xl hover:bg-stone-100"
          >
            {isMobileMenuOpen ? (
              <CloseIcon className="!text-2xl" />
            ) : (
              <MenuIcon className="!text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200/60 bg-white/95 backdrop-blur-md px-4 pt-4 pb-5 shadow-xl transition-all duration-200">
          <div className="mb-4">
            <SearchBar
              onSearchSubmit={() => setIsMobileMenuOpen(false)}
              fullWidth={true}
            />
          </div>
          <ul className="flex flex-col gap-1.5">
            {navs.map((nav) => {
              const isActive =
                pathname === nav.src ||
                (nav.src === "/recipe" &&
                  (pathname.startsWith("/recipe") ||
                    pathname === "/trending" ||
                    pathname === "/newest"));
              return (
                <li key={nav.label}>
                  <Link
                    href={nav.src}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                      isActive
                        ? "text-pink bg-pink/10 font-bold"
                        : "text-dark/80 hover:text-pink hover:bg-stone-100"
                    }`}
                  >
                    <span>{nav.label}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-pink"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}

export function NavMenus() {
  const navs = [
    { label: "Home", src: "/" },
    { label: "Recipe", src: "/recipe" },
    { label: "Popular", src: "/popular" },
  ];
  const pathname = usePathname();

  return (
    <ul className="nav-menu">
      {navs.map((nav) => {
        const isActive =
          pathname === nav.src ||
          (nav.src === "/recipe" &&
            (pathname.startsWith("/recipe") ||
              pathname === "/trending" ||
              pathname === "/newest"));

        return (
          <li
            className={
              isActive
                ? "text-pink active"
                : "text-dark opacity-80 hover:opacity-100 transition-opacity"
            }
            key={nav.label}
          >
            <Link href={nav.src}>{nav.label}</Link>
          </li>
        );
      })}
    </ul>
  );
}

export function SearchBar({
  onSearchSubmit,
  fullWidth = false,
  className = "",
}) {
  return (
    <Suspense
      fallback={
        <div
          className={`flex items-center gap-3 px-3 rounded-xl bg-[#F0EBE3] border h-10 ${
            fullWidth ? "w-full" : "w-72"
          } ${className}`}
        />
      }
    >
      <SearchBarInner
        onSearchSubmit={onSearchSubmit}
        fullWidth={fullWidth}
        className={className}
      />
    </Suspense>
  );
}

function SearchBarInner({
  onSearchSubmit,
  fullWidth = false,
  className = "",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const q = searchParams?.get("search") || "";
    setQuery(q);
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const domVal = e.currentTarget?.elements?.search?.value;
    const effectiveQuery = typeof domVal === "string" && domVal.trim() ? domVal : query;
    const trimmed = effectiveQuery.trim();
    if (trimmed) {
      router.push(`/recipe?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/recipe");
    }
    if (onSearchSubmit) {
      onSearchSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 px-3 rounded-xl bg-[#F0EBE3] border border-stone-300/70 focus-within:border-pink transition-colors ${
        fullWidth ? "w-full" : "w-72"
      } ${className}`}
    >
      <input
        className="w-full py-2 bg-transparent focus:outline-none text-dark placeholder:text-stone-500 text-sm"
        type="text"
        name="search"
        id="search"
        placeholder="Search recipes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        type="submit"
        aria-label="Submit search"
        className="text-stone-600 hover:text-pink transition-colors flex items-center justify-center cursor-pointer p-1 -mr-1"
      >
        <SearchIcon />
      </button>
    </form>
  );
}

export default Header;
