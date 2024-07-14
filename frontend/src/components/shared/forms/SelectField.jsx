import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectField({ placeholder }) {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Protocol</SelectLabel>
          <SelectItem value="borrow" disabled>Coumpound</SelectItem>
          <SelectItem value="lending" disabled>Uniswap</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
