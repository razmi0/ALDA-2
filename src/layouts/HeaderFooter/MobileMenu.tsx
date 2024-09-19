import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import { useMemo } from "react";



const MobileMenu = () => {
    const isActivePath = (path: string) => window.location.pathname === path;

const websiteLinks = useMemo(() => [
    { name: "Accueil", href: "/", isActive: isActivePath("/") },
    { name: "Nous", href: "/nous", isActive: isActivePath("/nous") },
    { name: "FAQs", href: "/FAQ", isActive: isActivePath("/FAQ") },
    { name: "Contact", href: "/contact", isActive: isActivePath("/contact") },
    { name: "Tarifs", href: "/tarifs", isActive: isActivePath("/tarifs") },
], []);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <MenuIcon className="w-9 h-9" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {websiteLinks.map(({href,isActive,name}) => (
                    <DropdownMenuItem key={name}>
                        <a href={href} className={cn(isActive ? "text-pur-500" : "")}>{name}</a>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
  }


  export default MobileMenu;