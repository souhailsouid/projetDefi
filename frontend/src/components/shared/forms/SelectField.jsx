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
          <SelectLabel>Actions</SelectLabel>
          <SelectItem value="borrow">Borrow</SelectItem>
          <SelectItem value="lending">Lending</SelectItem>
          <SelectItem value="withdraw">Withdraw</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
