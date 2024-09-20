/**
 * Standalone accordion component for FAQs with search functionality
 * npm i lucide-react, npx shadcn@latest add accordion
 */

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ListCollapse, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";
import type { FaqType } from "./types";

// TYPES
// --

type Visibility = {
  all: boolean;
  open: string[];
};

// CONTANTS
// --

const SEARCH_THRESHOLD = 2;
const HIGHLIGHT_WORD_THRESHOLD = 2;
const DIACRITICS: Record<string, string> = {
  È: "e",
  É: "e",
  Ê: "e",
  Ë: "e",
  è: "e",
  é: "e",
  ê: "e",
  ë: "e",
  à: "a",
  á: "a",
  â: "a",
  ã: "a",
  ä: "a",
  å: "a",
  æ: "a",
  À: "a",
  Á: "a",
  Â: "a",
  Ã: "a",
  Ä: "a",
  Å: "a",
  Æ: "a",
  Ù: "u",
  Ú: "u",
  Û: "u",
  Ü: "u",
  ù: "u",
  ú: "u",
  û: "u",
  ü: "u",
  Ì: "i",
  Í: "i",
  Î: "i",
  Ï: "i",
  ì: "i",
  í: "i",
  î: "i",
  ï: "i",
  Ÿ: "y",
  ÿ: "y",
  Ò: "o",
  Ó: "o",
  Ô: "o",
  Õ: "o",
  Ö: "o",
  Ø: "o",
  ò: "o",
  ó: "o",
  ô: "o",
  õ: "o",
  ö: "o",
  ø: "o",
} as const;

// HELPERS
// --

const replaceDiacritics = (str: string) => str.replace(/[^A-Za-z0-9]/g, (char) => DIACRITICS[char] || char);

const buildRegs = (searchArr: string[]) => {
  return searchArr.map((searchWord) => {
    return new RegExp(
      searchWord
        .split("")
        .map((char) => /** (?:a|$)(?:b|$)(?:c|$)  */ "(?:" + char + "|$)")
        .join(""),
      "gi"
    );
  });
};

const validMatch = (word: string, searchedRegs: RegExp[]) => {
  return searchedRegs.some((reg) => {
    const res = reg.exec(replaceDiacritics(word));
    return res && res[0].length > HIGHLIGHT_WORD_THRESHOLD;
  });
};

const buildMarkedText = (text: string, searchArr: string[]) => {
  return text
    .split(" ")
    .map((word) => (validMatch(word, buildRegs(searchArr)) ? `<mark>${word}</mark>` : word))
    .join(" ");
};

const insertHtml = (p: HTMLParagraphElement[], markedText: string[]) => {
  p.forEach((p, i) => {
    p.innerHTML = markedText[i] || "";
  });
};

// COMPONENTS
// --

export default function SearchableAccordion({ faqs }: { faqs: FaqType[] }) {
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState<Visibility>({ all: false, open: [] });

  useEffect(() => {
    if (search.length > SEARCH_THRESHOLD) {
      visibility.open.forEach((id) => {
        Array.from(document.querySelectorAll(`[data-mark="${id}"]`)).forEach((el) => {
          const paragraphs = Array.from(el.querySelectorAll("p")) as HTMLParagraphElement[];
          const originalText = paragraphs.map((p) => p.textContent || "");
          const markedText = originalText.map((text) => buildMarkedText(text, search.split(" "))); // marked text
          insertHtml(paragraphs, markedText);
        });
      });
    }
  }, [search, visibility]);

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(replaceDiacritics(e.target.value.trim()));
  }, []);

  const handleToggle = useCallback((visible: string[]) => {
    setVisibility({ all: false, open: visible });
  }, []);

  const handleToggleAll = useCallback(() => {
    setVisibility((prev) => {
      return {
        all: !prev.all,
        open: !prev.all ? faqs.map((faq) => faq.id) : [],
      };
    });
  }, []);

  const filteredFaqs = useMemo(() => {
    const filtered = faqs.filter((faq) => {
      const data = replaceDiacritics(faq.question + faq.answer);
      const searchStr = search.trim().toLowerCase();
      return data.toLowerCase().includes(searchStr);
    });

    return filtered;
  }, [faqs, search]);

  return (
    <>
      <SearchBar
        handleSearch={handleSearch}
        match={filteredFaqs.length}
        total={faqs.length}
        all={visibility.all}
        toggleAll={handleToggleAll}
      />
      <Accordion type="multiple" onValueChange={handleToggle} value={visibility.open}>
        {filteredFaqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id} data-mark={faq.id}>
            <AccordionTrigger className="text-lg quattrocento-sans-bold">
              <div className="inline-flex">
                <span className="mr-5" aria-description="Question number">
                  Q{faq.id}
                </span>
                <h3>{faq.question}</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {faq.answer.map((text) => {
                return <p key={text}>{text}</p>;
              })}
            </AccordionContent>
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
  all: boolean;
  toggleAll: () => void;
};

const SearchBar = ({ handleSearch, match, total, all, toggleAll }: SearchBarProps) => {
  return (
    <search className="vertical items-start mb-10">
      <label className="font-medium" htmlFor="searchInput">
        Chercher par mots-clés :
      </label>
      <div className="relative w-full mr-2">
        <input
          id="searchInput"
          onChange={handleSearch}
          type="text"
          placeholder="Entrer un mot-clé.."
          className="w-full py-2 pt-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
        />

        <SearchIcon className="absolute w-5 h-5 text-gray-500 left-3 top-1/2 transition-colors -translate-y-1/2" />
        <button type="button" onClick={toggleAll}>
          <ListCollapse
            className={`absolute w-7 h-7 right-3 top-1/2 transition-colors -translate-y-1/2 ${all ? "text-green-600 hover:text-green-500" : "text-gray-500 hover:text-gray-400"}`}
          />
        </button>
      </div>
      <output>
        <span>{match !== total && match}</span>
        <span>{match !== total && `/${total}`}</span>
      </output>
    </search>
  );
};
