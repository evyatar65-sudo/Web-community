"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Heart, LogIn, User, LogOut, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

const benefitsSubLinks = [
  { href: "/alumni-benefits#benefits", label: "הטבות ושותפויות" },
  { href: "/alumni-benefits#jobs", label: "לוח תעסוקה" },
  { href: "/alumni-benefits#networking", label: "נטוורקינג" },
  { href: "/alumni-benefits#academia", label: "אקדמיה" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data);
      } else {
        setProfile(null);
      }
    }
    loadProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setProfile(null);
    setUserMenuOpen(false);
  }

  const navLinks = [
    { href: "/about", label: "אודות" },
    { href: "/activities", label: "פעילויות" },
    { href: "/memorial", label: "הנצחה ומורשת" },
    { href: "/events", label: "אירועים" },
    { href: "/shop", label: "חנות" },
    { href: "/contact", label: "צור קשר" },
  ];

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-green-darkest shadow-lg" : "bg-green-darkest"
      }`}
      style={{ backgroundColor: "#1a2e1a" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-green-mid flex items-center justify-center text-white font-bold text-sm">
              סנ
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-rubik font-bold text-sm leading-tight">
                עמותת בוגרי
              </div>
              <div className="text-green-light font-rubik font-bold text-sm leading-tight">
                סיירת נח&quot;ל
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-green-light"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Benefits dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`px-3 py-2 rounded text-sm font-medium flex items-center gap-1 transition-colors ${
                  pathname.startsWith("/alumni-benefits")
                    ? "text-green-light"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                קידום בוגרים
                <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full mt-1 right-0 bg-white rounded-lg shadow-xl py-2 w-48 border border-gray-100">
                  {benefitsSubLinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-pale hover:text-green-dark"
                    >
                      {sub.label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link
                      href="/alumni-benefits"
                      className="block px-4 py-2 text-sm font-medium text-green-dark hover:bg-green-pale"
                    >
                      כל ההטבות ←
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {navLinks.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-green-light"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/donate"
              className="hidden sm:flex items-center gap-1.5 bg-gold text-white px-4 py-2 rounded text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Heart size={14} />
              תרומה
            </Link>

            {profile ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-2 py-1.5 rounded hover:bg-white/10"
                >
                  <div className="w-8 h-8 rounded-full bg-green-mid flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {profile.avatar_url ? (
                      <Image src={profile.avatar_url} alt={profile.full_name} width={32} height={32} className="object-cover w-full h-full" />
                    ) : (
                      profile.full_name?.[0] || "מ"
                    )}
                  </div>
                  <ChevronDown size={12} />
                </button>
                {userMenuOpen && (
                  <div className="absolute top-full mt-1 left-0 bg-white rounded-lg shadow-xl py-2 w-48 border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{profile.full_name}</p>
                      <p className="text-xs text-gray-500">{profile.status === "approved" ? "חבר מאושר" : "ממתין לאישור"}</p>
                    </div>
                    {profile.status === "approved" && (
                      <>
                        <Link href="/members" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-pale">
                          <User size={14} /> מאגר בוגרים
                        </Link>
                        <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-pale">
                          <User size={14} /> הפרופיל שלי
                        </Link>
                        <Link href="/forum" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-pale">
                          פורום
                        </Link>
                        <Link href="/archive" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-pale">
                          ארכיון
                        </Link>
                      </>
                    )}
                    {profile.role === "admin" && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-green-dark font-medium hover:bg-green-pale">
                        <Shield size={14} /> פאנל ניהול
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-1">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={14} /> יציאה
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded hover:bg-white/10 text-sm font-medium"
              >
                <LogIn size={14} />
                כניסה
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-gray-300 hover:text-white p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="תפריט"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-green-darkest border-t border-white/10" style={{ backgroundColor: "#1a2e1a" }}>
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2.5 rounded text-base font-medium transition-colors ${
                  pathname === link.href
                    ? "text-green-light bg-white/10"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/alumni-benefits"
              className="block px-3 py-2.5 rounded text-base font-medium text-gray-300 hover:text-white hover:bg-white/10"
            >
              קידום בוגרים
            </Link>
            <div className="pt-3 flex gap-3">
              <Link
                href="/donate"
                className="flex-1 flex items-center justify-center gap-1.5 bg-gold text-white px-4 py-2.5 rounded text-sm font-semibold"
              >
                <Heart size={14} /> תרומה
              </Link>
              {!profile && (
                <Link
                  href="/login"
                  className="flex-1 flex items-center justify-center gap-1.5 border border-white/30 text-white px-4 py-2.5 rounded text-sm font-medium"
                >
                  <LogIn size={14} /> כניסה
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
