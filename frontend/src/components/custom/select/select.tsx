import {
  Select as SelectWrapper,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  items: {
    name: string;
    value: string;
  }[];
  placeholder?: string;
}

function Select({ items, placeholder = " " }: Props) {
  return (
    <SelectWrapper>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item, i) => (
          <SelectItem key={i} value={item.value}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectWrapper>
  );
}

export { Select };
