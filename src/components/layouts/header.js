"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import Logo from "@/images/logo.png";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  function closeMenu() { setOpen(false); }
  return (
    <header className="sticky top-0 left-0 z-50 py-3 bg-white/20 backdrop-blur" onKeyDown={(event) => {
      if (event.key === "Escape" && open) {
        closeMenu();
        toggle.current?.focus();
      }
    }}>
      <div className="container header-content mx-auto">
        <div className="flex items-center gap-2 w-72 brand">
          <div className="size-12"><Image src={Logo} alt="" /></div>
          <span className="text-4xl font-bold text-pink logo-text">Food.</span>
        </div>
        <button ref={toggle} type="button" className="menu-toggle" aria-expanded={open} aria-controls="header-menu" onClick={() => setOpen(!open)}>
          {open ? "Close menu" : "Menu"}
        </button>
        <div id="header-menu" className={`header-menu${open ? " is-open" : ""}`}>
          <NavMenus onNavigate={closeMenu} />
          <SearchBar onSearch={closeMenu} />
        </div>
      </div>
    </header>
  );
}

export function NavMenus({ onNavigate }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main navigation">
      <ul className="nav-menu">
        {[{ label: "Home", src: "/" }, { label: "Recipe", src: "/recipe" }, { label: "Popular", src: "/popular" }].map((nav) => (
          <li className={(pathname === nav.src || (nav.src === "/recipe" && pathname.startsWith("/recipe/"))) ? "text-pink active" : "text-dark opacity-80"} key={nav.label}>
            <Link href={nav.src} aria-current={(pathname === nav.src || (nav.src === "/recipe" && pathname.startsWith("/recipe/"))) ? "page" : undefined} onClick={onNavigate}>{nav.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SearchBar({ onSearch }) {
  const router = useRouter();
  return (
    <form role="search" className="header-search flex items-center gap-3 px-3 w-72 rounded-xl bg-[#F0EBE3] border" onSubmit={(event) => {
      event.preventDefault();
      const query = new FormData(event.currentTarget).get("q").trim();
      router.push(query ? `/recipe?q=${encodeURIComponent(query)}` : "/recipe");
      onSearch?.();
    }}>
      <input className="min-w-0 flex-1 py-2 bg-transparent focus:outline-none" type="search" name="q" aria-label="Search recipes" placeholder="Search..." />
      <button type="submit" aria-label="Submit recipe search" className="shrink-0"><SearchIcon /></button>
    </form>
  );
}
