import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

export function DatePickerWithPresets({ id }: { id: string | number }) {
  const [date, setDate] = React.useState<Date>();
  const [reveal, setReveal] = React.useState(false);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (reveal && target.dataset.button !== `calendar#${id}`) {
        setReveal(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  });

  console.log(reveal);

  return (
    <div className="relative w-full">
      <label className="mb-1 text-left text-sm w-full block">Réservez une date :</label>
      <button
        onClick={() => setReveal((p) => !p)}
        data-button={`calendar#${id}`}
        className="w-full inline-flex items-center justify-start px-5 h-10 text-left font-normal transition-colors whitespace-nowrap bg-white rounded-md mb-2">
        <CalendarIcon className="mr-2 h-5 w-5 stroke-[1.5] text-black/50" />
        <span data-dateoutput={id} className="translate-y-[2px]">
          {date ? format(date, "PPP") : <></>}
        </span>
      </button>
      <input
        id={id.toString()}
        data-dateinput={id}
        type="hidden"
        name="date"
        value={date ? format(date, "PPP") : "Pick a date"}
        className=" font-normal"
      />
      <div className="rounded-md max-w-72 w-72 space-y-2 absolute">
        {reveal && (
          <>
            <Select onValueChange={(value) => setDate(addDays(new Date(), parseInt(value)))}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une date prédéfinie" />
              </SelectTrigger>
              <SelectContent className="max-w-72 w-72">
                <SelectItem value="0">Aujourd'hui</SelectItem>
                <SelectItem value="1">Demain</SelectItem>
                <SelectItem value="3">Dans trois jour</SelectItem>
                <SelectItem value="7">Dans une semaine</SelectItem>
              </SelectContent>
            </Select>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="bg-white max-w-72 w-72 rounded-md z-10 absolute"
            />
          </>
        )}
      </div>
    </div>
  );
}
