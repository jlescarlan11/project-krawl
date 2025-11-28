import Link from "next/link";
import { ROUTES } from "@/lib/routes";

/**
 * Footer component
 *
 * Site footer with links, legal information, and branding.
 */
export function Footer() {
  return (
    <footer className="hidden lg:block bg-bg-white border-t border-[var(--color-border-subtle)] shadow-[var(--shadow-elevation-1)] mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="font-bold text-lg text-primary-green mb-4">
              Krawl
            </h3>
            <p className="text-text-secondary text-sm">
              The Living Map of Filipino Culture in Cebu City
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href={ROUTES.HOME}
                  className="text-text-secondary hover:text-primary-green text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.MAP}
                  className="text-text-secondary hover:text-primary-green text-sm"
                >
                  Map
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.SEARCH}
                  className="text-text-secondary hover:text-primary-green text-sm"
                >
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href={ROUTES.TERMS}
                  className="text-text-secondary hover:text-primary-green text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.PRIVACY}
                  className="text-text-secondary hover:text-primary-green text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-[var(--color-border-subtle)] text-center">
          <p className="text-text-tertiary text-sm">
            © {new Date().getFullYear()} Krawl. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

