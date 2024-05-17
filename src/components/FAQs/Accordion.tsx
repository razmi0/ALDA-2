import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqType } from "./types";
export default function ReactAccordion({ faqs }: { faqs: FaqType[] }) {
  return (
    <Accordion type="single" collapsible>
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id}>
          <AccordionTrigger className="text-xl">
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
  );
}
