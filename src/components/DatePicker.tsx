import * as React from "react";

import { addDays, format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";

export function DatePickerWithPresets() {
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="vertical">
      <span className="font-normal text-sm mb-2">Choisissez une date :</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <></>}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2">
          <Select onValueChange={(value) => setDate(addDays(new Date(), parseInt(value)))}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="0">Aujourd'hui</SelectItem>
              <SelectItem value="1">Demain</SelectItem>
              <SelectItem value="3">Dans trois jour</SelectItem>
              <SelectItem value="7">Dans une semaine</SelectItem>
            </SelectContent>
          </Select>
          <div className="rounded-md border">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
