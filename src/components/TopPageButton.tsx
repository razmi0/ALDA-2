import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const TopPageButton = () => {
    return (
        <TooltipProvider skipDelayDuration={500}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        aria-label="go to top of the page"
                        className={`z-50 fixed m-4 mb-7 bottom-0 right-0 p-1 rounded-lg bg-slate-200/80 hover:opacity-70 transition-opacity border border-zinc-200 shadow-md`}>
                        <span className={`sr-only`}>go to top of the page</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#09090b">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                        </svg>
                    </button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-200/80" collisionPadding={10}>
                    Go to top of the page
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
export default TopPageButton;
