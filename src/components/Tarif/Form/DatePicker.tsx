import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

export function DatePickerWithPresets({ id }: { id: string | number }) {
  const [date, setDate] = React.useState<Date>();
  const [reveal, setReveal] = React.useState(false);

  return (
    <div className="relative w-72">
      <label className="mb-1 text-left text-sm w-full block">Réservez une date :</label>
      <button
        onClick={() => setReveal((p) => !p)}
        data-button={`calendar#${id}`}
        type="button"
        className="w-full horizontal gap-2 items-center justify-start px-2 h-10 text-left font-normal transition-colors whitespace-nowrap mb-2 bg-white hover:bg-white/80 rounded-md">
        <CalendarIcon className=" h-5 w-5 stroke-[1.5] text-black/60 hover:text-black/50" />
        <output data-dateoutput={id} className="translate-y-[2px]">
          {date ? format(date, "PPP") : <></>}
        </output>
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
            <div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="bg-white max-w-72 w-72 rounded-md z-10 absolute"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
