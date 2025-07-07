
"use client"

import { useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table"
import * as XLSX from "xlsx"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  FileDown,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  containerClass?: string
}

export function DataTable<TData, TValue>({ columns, data, containerClass }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
  })

  const handleExcelExport = () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
    XLSX.writeFile(wb, "data_export.xlsx")
  }

  const handleResetSearch = () => setGlobalFilter("")

  return (
    <div className={`space-y-6 bg-background p-6 rounded-2xl shadow-sm border ${containerClass}`}>
      {/* Toolbar Section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search (Ctrl+F)..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-11 pr-10 h-11 rounded-xl bg-background focus-visible:ring-2 focus-visible:ring-primary/50 border-muted"
          />
          {globalFilter && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-muted/50"
              onClick={handleResetSearch}
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          onClick={handleExcelExport}
          className="rounded-xl gap-2 border bg-background hover:bg-muted/50 shadow-none hover:shadow-sm transition-all border-muted"
        >
          <FileDown className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline font-medium text-foreground">Export Excel</span>
        </Button>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border overflow-hidden border-muted">
        <Table>
          <TableHeader className="bg-muted/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-6 py-4 text-foreground font-medium hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-3">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground">
                          {{
                            asc: <ChevronUp className="h-5 w-5 text-primary" />,
                            desc: <ChevronDown className="h-5 w-5 text-primary" />,
                          }[header.column.getIsSorted() as string] ?? <ChevronsUpDown className="h-5 w-5" />}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/20 data-[state=selected]:bg-muted/50 border-muted">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-6 py-4 font-medium text-foreground/90 group-hover:text-foreground transition-colors"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
                    <Search className="h-10 w-10 text-muted-foreground/30" />
                    <span className="text-lg">No matching records found</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="h-10 w-10 p-0 rounded-xl border border-muted bg-background hover:bg-muted/20"
          >
            <ChevronsLeft className="h-5 w-5 text-foreground" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-10 w-10 p-0 rounded-xl border border-muted bg-background hover:bg-muted/20"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </Button>
          <div className="flex items-center gap-2 px-5 text-sm font-medium text-muted-foreground">
            Page{" "}
            <span className="text-foreground">
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-10 w-10 p-0 rounded-xl border border-muted bg-background hover:bg-muted/20"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="h-10 w-10 p-0 rounded-xl border border-muted bg-background hover:bg-muted/20"
          >
            <ChevronsRight className="h-5 w-5 text-foreground" />
          </Button>
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>Show</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="h-10 rounded-xl border border-muted px-3 focus:ring-2 focus:ring-primary/50 bg-background"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <span>entries per page</span>
        </div>
      </div>
    </div>
  )
}
