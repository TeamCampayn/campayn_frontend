
import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  className?: string;
}

interface EnhancedTableProps {
  columns: Column[];
  data: any[];
  searchable?: boolean;
  filterable?: boolean;
  stickyHeader?: boolean;
  zebraStripes?: boolean;
  onSearch?: (query: string) => void;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  renderActions?: (row: any) => React.ReactNode;
  className?: string;
}

export const EnhancedTable = React.forwardRef<HTMLDivElement, EnhancedTableProps>(
  ({ 
    columns, 
    data, 
    searchable = true,
    filterable = true,
    stickyHeader = true,
    zebraStripes = true,
    onSearch,
    onSort,
    renderActions,
    className,
    ...props 
  }, ref) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: "asc" | "desc" } | null>(null);

    const handleSort = (key: string) => {
      let direction: "asc" | "desc" = "asc";
      if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }
      setSortConfig({ key, direction });
      onSort?.(key, direction);
    };

    const handleSearch = (query: string) => {
      setSearchQuery(query);
      onSearch?.(query);
    };

    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        {/* Search and Filter Bar */}
        {(searchable || filterable) && (
          <div className="flex flex-col sm:flex-row gap-4">
            {searchable && (
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 border-primary-200 focus:border-primary-500"
                />
              </div>
            )}
            
            {filterable && (
              <Button variant="outline" className="border-primary-200 text-primary-700 hover:bg-primary-50">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            )}
          </div>
        )}

        {/* Table */}
        <div className="border border-primary-100 rounded-lg overflow-hidden bg-white shadow-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className={cn(stickyHeader && "sticky top-0 bg-primary-50 z-10")}>
                <TableRow className="hover:bg-transparent border-primary-100">
                  {columns.map((column) => (
                    <TableHead 
                      key={column.key} 
                      className={cn(
                        "font-semibold text-primary-800 bg-primary-50",
                        column.sortable && "cursor-pointer hover:bg-primary-100",
                        column.className
                      )}
                      onClick={column.sortable ? () => handleSort(column.key) : undefined}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        {column.sortable && sortConfig?.key === column.key && (
                          <span className="text-primary-600">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  ))}
                  {renderActions && (
                    <TableHead className="font-semibold text-primary-800 bg-primary-50">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {data.map((row, index) => (
                  <TableRow 
                    key={index}
                    className={cn(
                      "group transition-colors hover:bg-primary-25 border-primary-50",
                      zebraStripes && index % 2 === 0 && "bg-slate-25"
                    )}
                  >
                    {columns.map((column) => (
                      <TableCell 
                        key={column.key} 
                        className={cn("text-slate-700", column.className)}
                      >
                        {row[column.key]}
                      </TableCell>
                    ))}
                    
                    {renderActions && (
                      <TableCell>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {renderActions(row)}
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
);

EnhancedTable.displayName = "EnhancedTable";
