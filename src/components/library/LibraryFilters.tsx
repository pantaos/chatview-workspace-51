import { ArrowUpDown, Filter } from "lucide-react";
import { LibraryFilterType, LibrarySortOption } from "@/types/library";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface LibraryFiltersProps {
  sortOption: LibrarySortOption;
  onSortChange: (value: LibrarySortOption) => void;
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

const sortOptions: { value: LibrarySortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
];

export function LibraryFilters({
  sortOption,
  onSortChange,
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

  const hasTypeFilters = typeFilters.length > 0;

  return (
    <div className="flex items-center gap-2">
      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="text-xs text-muted-foreground">Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={sortOption} onValueChange={(v) => onSortChange(v as LibrarySortOption)}>
            {sortOptions.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value} className="text-sm">
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Type Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className={`h-9 w-9 ${hasTypeFilters ? 'border-primary text-primary' : ''}`}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel className="text-xs text-muted-foreground">Filter by type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {typeOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={typeFilters.includes(option.value)}
              onCheckedChange={() => toggleTypeFilter(option.value)}
              className="text-sm"
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
