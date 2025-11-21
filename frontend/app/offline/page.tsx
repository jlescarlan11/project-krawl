"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10 text-slate-50">
      <Card className="max-w-lg bg-slate-900 text-center">
        <CardHeader>
          <h1 className="text-3xl font-semibold text-slate-50">You&rsquo;re offline</h1>
          <p className="mt-2 text-slate-300">
            Reconnect to keep exploring Cebu City&rsquo;s cultural experiences on Krawl.
          </p>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <p className="text-sm text-slate-200">
            We cache the essentials so you can still browse recently viewed content. Once you&rsquo;re back online, reload
            to sync fresh data.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try again
            </Button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border-2 border-primary-green px-6 py-3 text-base font-medium text-primary-green hover:bg-light-green/10"
            >
              Back to home
            </Link>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}

