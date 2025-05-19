
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MainContentProps {
  children: ReactNode;
}

const MainContent = ({ children }: MainContentProps) => {
  return (
    <main className={cn(
      "flex-1 overflow-auto p-3 sm:p-6", 
      "transition-all duration-300",
    )}>
      {children}
    </main>
  );
};

export default MainContent;
