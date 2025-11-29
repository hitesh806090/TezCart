"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = React.useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <Input 
        type="search"
        placeholder="Search gear..." 
        className="pl-9 h-9 rounded-full bg-secondary/50 border-transparent focus-visible:ring-primary/50 focus-visible:bg-secondary transition-all w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}
