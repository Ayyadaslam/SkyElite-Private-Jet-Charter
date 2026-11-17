import { useEffect, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenSignIn: () => void;
  onOpenBookNow: () => void;
}

const NAV_ITEMS = [
  { label: 'Book', href: '#book' },
  { label: 'Departures', href: '#departures' },
  { label: 'Fleet', href: '#fleet' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'Membership', href: '#membership' },
  { label: 'FAQ', href: '#faq' },
];

export function Navbar({
  theme,
  onToggleTheme,
  onOpenSignIn,
  onOpenBookNow,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 dark:bg-[#0D1219]/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800/80 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between gap-8">
          <a
            href="#start"
            className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight whitespace-nowrap shrink-0 transition-colors hover:text-gray-700 dark:hover:text-gray-300"
          >
            SkyElite
          </a>

          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 lg:gap-8"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-gray-900 dark:text-slate-100 hover:text-gray-700 dark:hover:text-slate-300 transition-colors whitespace-nowrap shrink-0"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-full text-gray-900 dark:text-slate-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onOpenSignIn}
              className="text-sm font-medium text-gray-900 dark:text-slate-100 hover:text-gray-700 dark:hover:text-slate-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onOpenBookNow}
              className="bg-[#202A36] hover:bg-[#1a2229] text-white dark:bg-slate-100 dark:hover:bg-white dark:text-[#111821] rounded-full px-5 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#202A36] dark:focus-visible:outline-slate-200"
            >
              Book Now
            </button>
          </div>

          <div className="md:hidden flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl text-gray-900 dark:text-slate-100 hover:bg-white/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] -mr-2 rounded-xl text-gray-900 dark:text-slate-100 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#202A36]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 bg-white/95 dark:bg-[#161F2B]/95 backdrop-blur-md rounded-2xl shadow-xl ring-1 ring-black/5 border border-gray-300 dark:border-slate-800 p-4">
            <nav aria-label="Mobile Navigation" className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={handleLinkClick}
                  className="min-h-[44px] flex items-center px-4 py-2.5 rounded-xl text-base font-medium text-gray-900 dark:text-slate-100 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-slate-800/80 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between gap-3 px-1">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSignIn();
                }}
                className="min-h-[44px] px-4 py-2 rounded-full text-sm font-medium text-gray-900 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenBookNow();
                }}
                className="min-h-[44px] px-5 py-2 rounded-full bg-[#202A36] hover:bg-[#1a2229] text-white dark:bg-slate-100 dark:hover:bg-white dark:text-[#111821] text-sm font-medium transition-colors cursor-pointer"
              >
                Book Now
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
