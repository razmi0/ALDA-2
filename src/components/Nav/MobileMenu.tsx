import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import type { WebsiteLink } from "./types";

type MobileMenuProps = {
  websiteLinks: WebsiteLink[];
};

const MobileMenu = ({ websiteLinks }: MobileMenuProps) => {
  return (
    <section className="lg:hidden flex">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MenuIcon className="w-9 h-9 text-pur-500 hover:text-pur-500/80" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="inline-flex gap-5">
          {websiteLinks.map(({ href, isActive, name }) => (
            <DropdownMenuItem key={name} className="font-bold text-[1rem]">
              <a href={href} className={cn(isActive ? "text-pur-500" : "")}>
                {name}
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  );
};

export default MobileMenu;
