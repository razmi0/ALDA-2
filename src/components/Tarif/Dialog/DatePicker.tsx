import * as React from "react";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
export function DatePickerWithPresets() {
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="vertical center">
      <label className="mb-1 text-left text-sm w-full">Réservez une date :</label>
      <Button type="button" variant={"outline"} className={cn("w-full justify-start text-left font-normal max-w-72")}>
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "PPP") : <></>}
      </Button>
      <input type="hidden" name="date" value={date?.toDateString()} />

      <div className="rounded-md border max-w-72">
        <Calendar mode="single" selected={date} onSelect={setDate} className="bg-white rounded-md max-w-72" />
      </div>
    </div>
  );
}
