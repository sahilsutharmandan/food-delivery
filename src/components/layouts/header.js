"use client";

import Image from "next/image";
import React from "react";
import Logo from "@/images/logo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
function Header() {
  return (
    <header className="sticky top-0 left-0 z-50 py-3 bg-white/20 backdrop-blur">
      <div className="container flex items-center justify-between mx-auto">
        <div className="flex items-center gap-2 w-72 brand">
          <div className="size-12">
            <Image src={Logo} />
          </div>
          <span className="text-4xl font-bold text-pink logo-text">Food.</span>
        </div>
        <NavMenus />
        <SearchBar />
      </div>
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
      {navs.map((nav) => (
        <li
          className={
            pathname === nav.src ? "text-pink active" : "text-dark opacity-80"
          }
          key={nav.label}
        >
          <Link href={nav.src}>{nav.label}</Link>
        </li>
      ))}
    </ul>
  );
}
export function SearchBar() {
  return (
    <div className="flex items-center gap-3 px-3 w-72 rounded-xl bg-[#F0EBE3] border">
      <input
        className="w-[90%] py-2 bg-transparent focus:outline-none"
        type="text"
        name="search"
        id="search"
        placeholder="Search..."
      />
      <SearchIcon />
    </div>
  );
}
export default Header;
