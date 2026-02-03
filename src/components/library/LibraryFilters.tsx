import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LibraryFilterType, LibraryDateFilter } from "@/types/library";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface LibraryFiltersProps {
  dateFilter: LibraryDateFilter;
  onDateFilterChange: (value: LibraryDateFilter) => void;
  typeFilters: LibraryFilterType[];
  onTypeFilterChange: (types: LibraryFilterType[]) => void;
}

const typeOptions: { value: LibraryFilterType; label: string }[] = [
  { value: "video", label: "Video" },
  { value: "image", label: "Image" },
  { value: "pdf", label: "PDF" },
  { value: "word", label: "Word" },
  { value: "link", label: "Links" },
  { value: "other", label: "Other" },
];

const dateOptions: { value: LibraryDateFilter; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "this-week", label: "This week" },
  { value: "this-month", label: "This month" },
];

export function LibraryFilters({
  dateFilter,
  onDateFilterChange,
  typeFilters,
  onTypeFilterChange,
}: LibraryFiltersProps) {
  const toggleTypeFilter = (type: LibraryFilterType) => {
    if (typeFilters.includes(type)) {
      onTypeFilterChange(typeFilters.filter((t) => t !== type));
    } else {
      onTypeFilterChange([...typeFilters, type]);
    }
  };

  const clearFilters = () => {
    onDateFilterChange("newest");
    onTypeFilterChange([]);
  };

  const hasActiveFilters = typeFilters.length > 0 || dateFilter !== "newest";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Date Filter */}
      <Select value={dateFilter} onValueChange={onDateFilterChange}>
        <SelectTrigger className="w-[140px] h-8 text-xs">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {dateOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-xs">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Type Filter Badges */}
      <div className="flex flex-wrap items-center gap-1.5">
        {typeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => toggleTypeFilter(option.value)}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
              typeFilters.includes(option.value)
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
