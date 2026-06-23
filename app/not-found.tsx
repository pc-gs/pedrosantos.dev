import Link from "next/link";
import { Home } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageContainer>
      <div className="surface-panel-elevated flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="mb-2 text-6xl font-bold text-accent">404</h1>
        <h2 className="mb-4 text-2xl font-semibold">Page not found</h2>
        <p className="mb-8 max-w-md text-muted-foreground">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild className="rounded-xl bg-accent text-accent-foreground">
          <Link href="/">
            <Home className="h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </PageContainer>
  );
}