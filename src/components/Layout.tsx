
import { ThemeToggle } from "@/components/ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
}
