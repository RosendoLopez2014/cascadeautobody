import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold text-neutral-200 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          Page Not Found
        </h2>
        <p className="text-neutral-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button>
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Browse Shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
