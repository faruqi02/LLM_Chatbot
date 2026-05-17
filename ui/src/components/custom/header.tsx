import { ThemeToggle } from "./theme-toggle";
import { Button } from "../ui/button";
import { BookOpen } from "lucide-react";

export const Header = () => {
  return (
    <>
      <header className="flex items-center justify-between px-2 sm:px-4 py-2 bg-background text-black dark:text-white w-full">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("http://localhost:8000/Requirement/architecture_flow.html", "_blank")}
            title="View Architecture Flow"
            className="flex items-center space-x-2 ml-2"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Architecture Flow</span>
          </Button>
        </div>
      </header>
    </>
  );
};