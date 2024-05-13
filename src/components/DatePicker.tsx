import * as React from "react";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
export function DatePickerWithPresets() {
  const [date, setDate] = React.useState<Date>();
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  return (
    <div className="vertical center">
      <Button
        onClick={() => {
          if (dialogRef.current?.open) dialogRef.current?.close();
          dialogRef.current?.showModal();
        }}
        variant={"outline"}
        className={cn("w-full justify-start text-left font-normal")}>
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "PPP") : <></>}
      </Button>

      <div className="rounded-md border">
        <Calendar mode="single" selected={date} onSelect={setDate} className="bg-white rounded-md" />
      </div>
    </div>
  );
}
