import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import type { WebsiteLink } from "./types";

type MobileMenuProps = {
    websiteLinks: WebsiteLink[];
};

const MobileMenu = ({ websiteLinks }: MobileMenuProps) => {
    const [open, setOpen] = useState(false);

    return (
        <section className="lg:hidden flex">
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        aria-label="Ouvrir le menu de navigation"
                        aria-expanded={open}
                        onPointerDown={(event) => event.preventDefault()}
                        onClick={() => setOpen((prev) => !prev)}
                        className="inline-flex items-center justify-center rounded-md p-1 touch-manipulation text-white hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
                        <MenuIcon className="w-9 h-9" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-3">
                    {websiteLinks.map(({ href, isActive, name }) => (
                        <DropdownMenuItem
                            key={name}
                            asChild
                            className="font-bold text-[1rem] cursor-pointer"
                            onSelect={() => setOpen(false)}>
                            <a href={href} className={cn("w-full", isActive ? "text-pur-500" : "")}>
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
