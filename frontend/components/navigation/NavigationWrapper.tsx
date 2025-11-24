"use client";

import { usePathname } from "next/navigation";
import {
  Header,
  Footer,
  MobileMenu,
  BottomNav,
} from "@/components/navigation";
import { ROUTES } from "@/lib/routes";

/**
 * NavigationWrapper component
 *
 * Conditionally renders navigation components based on the current route.
 * Hides all navigation on the sign-in page.
 * 
 * Note: This component returns fragments that should be placed in the layout
 * at the appropriate positions (Header/MobileMenu before main, Footer/BottomNav after).
 */
export function NavigationWrapper() {
  const pathname = usePathname();
  const isSignInPage = pathname === ROUTES.SIGN_IN;

  // Hide navigation on sign-in page
  if (isSignInPage) {
    return null;
  }

  return (
    <>
      <Header />
      <MobileMenu />
    </>
  );
}

/**
 * NavigationFooter component
 *
 * Conditionally renders footer navigation components based on the current route.
 * Hides footer navigation on the sign-in page.
 */
export function NavigationFooter() {
  const pathname = usePathname();
  const isSignInPage = pathname === ROUTES.SIGN_IN;

  // Hide navigation on sign-in page
  if (isSignInPage) {
    return null;
  }

  return (
    <>
      <Footer />
      <BottomNav />
    </>
  );
}

