"use client";

import { usePathname } from "next/navigation";
import {
  Header,
  Footer,
  MobileMenu,
  BottomNav,
} from "@/components/navigation";
import { GuestModeBanner } from "@/components/auth";
import { ROUTES } from "@/lib/routes";

export interface NavigationWrapperProps {
  showGuestBanner?: boolean;
}

/**
 * NavigationWrapper component
 *
 * Conditionally renders navigation components based on the current route.
 * Hides all navigation on the sign-in and onboarding pages.
 * 
 * Note: This component returns fragments that should be placed in the layout
 * at the appropriate positions (Header/MobileMenu before main, Footer/BottomNav after).
 */
export function NavigationWrapper({
  showGuestBanner = true,
}: NavigationWrapperProps = {}) {
  const pathname = usePathname();
  const isSignInPage = pathname === ROUTES.SIGN_IN;
  const isOnboardingPage = pathname === ROUTES.ONBOARDING;

  // Hide navigation on sign-in and onboarding pages
  if (isSignInPage || isOnboardingPage) {
    return null;
  }

  return (
    <>
      {showGuestBanner && <GuestModeBanner />}
      <Header />
      <MobileMenu />
    </>
  );
}

/**
 * NavigationFooter component
 *
 * Conditionally renders footer navigation components based on the current route.
 * Hides footer navigation on the sign-in and onboarding pages.
 */
export function NavigationFooter() {
  const pathname = usePathname();
  const isSignInPage = pathname === ROUTES.SIGN_IN;
  const isOnboardingPage = pathname === ROUTES.ONBOARDING;

  // Hide navigation on sign-in and onboarding pages
  if (isSignInPage || isOnboardingPage) {
    return null;
  }

  return (
    <>
      <Footer />
      <BottomNav />
    </>
  );
}

