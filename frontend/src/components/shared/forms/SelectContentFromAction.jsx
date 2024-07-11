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

const  SelectContentFromAction = ({ placeholder, setActionContent })  => {
  const items = [
    { value: "borrow", label: "Borrow" },
    { value: "lending", label: "Lending" },
    { value: "withdraw", label: "Withdraw" },
  ];

  const [selected, setSelected] = React.useState(items[0].value);

  const handleSelect = (value) => {
    setSelected(value);
  };

  const renderContent = () => {
    switch (selected) {
      case "borrow":
        return setActionContent('Borrow')
      case "lending":
        return setActionContent('Lending')
      case "withdraw":
        return setActionContent('Withdraw')
      default:
        return null;
    }
  };

  return (
    <div>
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Actions</SelectLabel>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="mt-4">{renderContent()}</div>
    </div>
  );
    
}


export default SelectContentFromAction;