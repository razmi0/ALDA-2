import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SearchIcon } from "lucide-react";
import { useCallback, useMemo, useState, type ChangeEvent } from "react";
import type { FaqType } from "./types";
export default function ReactAccordion({ faqs }: { faqs: FaqType[] }) {
  const [search, setSearch] = useState("");

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const data = faq.question + faq.answer;
      const searchStr = search.trim().toLowerCase();
      return data.toLowerCase().includes(searchStr);
    });
  }, [faqs, search]);

  return (
    <>
      <SearchBar handleSearch={handleSearch} match={filteredFaqs.length} total={faqs.length} />
      <Accordion type="multiple">
        {filteredFaqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="text-lg quattrocento-sans-bold">
              <span>
                <span className="mr-5" aria-description="Question number">
                  Q{faq.id}
                </span>
                {faq.question}
              </span>
            </AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}

type SearchBarProps = {
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  match: number;
  total: number;
};

const SearchBar = ({ handleSearch, match, total }: SearchBarProps) => {
  return (
    <search className="horizontal center gap-5 mb-10">
      <div className="relative w-full">
        <label htmlFor="searchInput" className="sr-only">
          Search for a question
        </label>
        <input
          id="searchInput"
          onChange={handleSearch}
          type="text"
          placeholder="Search for a question..."
          className="w-full py-2 pt-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
        />

        <SearchIcon className="absolute w-5 h-5 text-gray-500 left-3 top-1/2 transform -translate-y-1/2" />
      </div>
      <output>
        <span>{match !== total && match}</span>
        <span>{match !== total && `/${total}`}</span>
      </output>
    </search>
  );
};
