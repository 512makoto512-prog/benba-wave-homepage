"use client";

import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";

const navLinks = [
  { label: "About", href: "#concept" },
  { label: "Review", href: "#reviews" },
  { label: "Booking", href: "#booking" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<"ja" | "en">("ja");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="text-xl font-black tracking-widest text-ocean">
            OKINAWANSUP
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-ink hover:text-ocean transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => setLang(lang === "ja" ? "en" : "ja")}
              className="flex items-center gap-1 text-sm font-medium text-ink hover:text-ocean transition-colors border border-gray-200 rounded-full px-3 py-1"
            >
              <Globe size={14} />
              {lang === "ja" ? "EN" : "JA"}
            </button>
            <a
              href="#booking"
              className="bg-sunset text-white text-sm font-bold px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              予約する
            </a>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-ink"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="メニュー"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-6 pt-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-base font-medium text-ink hover:text-ocean transition-colors py-2"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => setLang(lang === "ja" ? "en" : "ja")}
            className="flex items-center gap-2 text-sm font-medium text-ink w-fit border border-gray-200 rounded-full px-3 py-1"
          >
            <Globe size={14} />
            {lang === "ja" ? "EN" : "JA"}
          </button>
          <a
            href="#booking"
            className="bg-sunset text-white text-center font-bold px-5 py-3 rounded-full hover:opacity-90 transition-opacity"
            onClick={() => setMenuOpen(false)}
          >
            予約する
          </a>
        </div>
      )}
    </header>
  );
}
