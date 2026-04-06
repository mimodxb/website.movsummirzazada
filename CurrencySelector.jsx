import React from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CurrencySelector = () => {
  const { selectedCurrency, changeCurrency } = useCurrency();
  const currencies = ['USD', 'EUR', 'GBP', 'AED', 'AZN'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-[#A8B3AF] hover:text-[#E0A995] gap-2">
          <Globe className="w-4 h-4" />
          {selectedCurrency}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#0A1612] border-[#E0A995]/20 text-[#EBE8E3]">
        {currencies.map(curr => (
          <DropdownMenuItem 
            key={curr}
            onClick={() => changeCurrency(curr)}
            className="hover:bg-[#E0A995]/10 hover:text-[#E0A995] cursor-pointer"
          >
            {curr}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySelector;