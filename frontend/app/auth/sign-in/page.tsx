import Link from "next/link";

export const metadata = {
  title: "Krawl – Sign In",
  description: "Access your Krawl account to create and save Gems and Krawls.",
};

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg-light)] px-4 py-12">
      <section className="w-full max-w-md rounded-[var(--radius-lg)] bg-white p-8 text-center shadow-[var(--shadow-elevation-2)]">
        <p className="text-sm font-semibold text-[var(--color-primary-green)]">
          Coming Soon
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--color-text-primary)]">
          Sign In to Krawl
        </h1>
        <p className="mt-4 text-base text-[var(--color-text-secondary)]">
          Google sign-in will be available once authentication is implemented.
          For now, continue exploring as a guest.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex w-full items-center justify-center rounded-[var(--radius-default)] bg-[var(--color-primary-green)] px-6 py-3 text-base font-semibold text-white transition hover:bg-[var(--color-dark-green)]"
        >
          Return to Krawl
        </Link>
      </section>
    </main>
  );
}
