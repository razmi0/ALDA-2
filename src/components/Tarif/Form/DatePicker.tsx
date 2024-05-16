import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

export function DatePickerWithPresets({ id }: { id: string | number }) {
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="vertical center">
      <label className="mb-1 text-left text-sm w-full">Réservez une date :</label>
      <div className="w-full inline-flex items-center justify-start px-5 h-10 text-left font-normal transition-colors whitespace-nowrap bg-white rounded-tr-md rounded-tl-md">
        <CalendarIcon className="mr-2 h-5 w-5 stroke-[1.5]" />
        <span data-dateoutput={id}>{date ? format(date, "PPP") : <></>}</span>
      </div>
      <input
        id={id.toString()}
        data-dateinput={id}
        type="hidden"
        name="date"
        value={date ? format(date, "PPP") : "Pick a date"}
        className="text-left font-normal"
      />
      <div className="rounded-br-md rounded-bl-md max-w-72">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="bg-white max-w-72 rounded-br-md rounded-bl-md"
        />
      </div>
    </div>
  );
}
