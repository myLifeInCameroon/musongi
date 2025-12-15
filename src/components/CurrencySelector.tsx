import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign } from "lucide-react";

const currencies = [
  { code: "XAF", label: "FCFA", flag: "🇨🇲" },
  { code: "USD", label: "USD", flag: "🇺🇸" },
  { code: "EUR", label: "EUR", flag: "🇪🇺" },
] as const;

export const CurrencySelector = () => {
  const { currency, setCurrency, t } = useLanguage();

  return (
    <Select value={currency} onValueChange={(value) => setCurrency(value as "XAF" | "USD" | "EUR")}>
      <SelectTrigger className="w-[100px] h-9 bg-background border-input">
        <DollarSign className="h-4 w-4 mr-1" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-popover border-border z-50">
        {currencies.map((curr) => (
          <SelectItem key={curr.code} value={curr.code}>
            <span className="flex items-center gap-2">
              <span>{curr.flag}</span>
              <span>{curr.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
