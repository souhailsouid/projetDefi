import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";


const StrategiesList = ({
  strategies,
  onSelect,
}) => {
  
  return (
    <Card className="p-4 bg-white rounded-lg border-none shadow-none">
      <ul role="list" className="space-y-4">
        <li className="group flex items-center space-x-4 p-4 bg-white rounded-md transition-colors">
          <div className="flex-1">
            <p className="text-sm text-gray-500"></p>
          </div>
        </li>
        <ScrollArea className="h-[330px] px-2 ">
          {strategies.map((strategie, index) => (
            <li
              key={index}
              className="group flex items-center space-x-4 p-4 bg-white hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
              onClick={() => onSelect(strategie.value)}
            >
              <div className="flex-1">
                <p className="text-sm text-gray-500">{strategie.symbol}</p>
              </div>
            </li>
          ))}
        </ScrollArea>
      </ul>
    </Card>
  );
};

export default StrategiesList;
