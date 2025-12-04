'use client';

import * as React from 'react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Row,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type PaginationState,
  type OnChangeFn,
} from '@tanstack/react-table';
import { DataTableToolbar } from './data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTablePagination } from './data-table-pagination';
import { type LucideIcon } from 'lucide-react';
import { DataTableSkeleton } from './data-table-skeleton';

// Global map to store column visibility preferences per table (persists across unmounts)
const columnVisibilityStore = new Map<string, VisibilityState>();

interface CustomRowProps<TData> {
  row: Row<TData>;
  customState: unknown;
  onClick?: (row: TData) => void;
}

const CustomRow = <TData,>({ row, customState, onClick }: CustomRowProps<TData>) => {
  const [state, setState] = React.useState(customState);

  React.useEffect(() => {
    setState(customState);
  }, [customState]);

  return (
    <TableRow key={row.id} data-selected={row.getIsSelected()}>
      {row.getVisibleCells().map(cell => (
        <TableCell key={cell.id} onClick={() => onClick?.(cell.row.original)}>
          {flexRender(cell.column.columnDef.cell, { ...cell.getContext(), state, setState })}
        </TableCell>
      ))}
    </TableRow>
  );
};

export interface CustomFilterProps {
  className?: string;
  label?: string;
}

interface FilterWithItem {
  label: string;
  value: string;
  defaultValue?: string;
  icon?: LucideIcon;
  options: Array<{
    label: string;
    value: string;
  }>;
}

type ExtractColumnKeys<T> = T extends { accessorKey: infer K } ? (K extends string ? K : never) : never;

export type ExtendedColumnDef<TData> = ColumnDef<TData> & {
  columnVisibility?: (data: TData[]) => boolean;
};

interface DataTableProps<TData, TColumns extends ExtendedColumnDef<TData>[]> {
  columns: TColumns;
  data: TData[];
  onClick?: (row: TData, event?: React.MouseEvent) => void;
  placeholder?: string;
  filterWith?: FilterWithItem | FilterWithItem[];
  statuses?: Array<{ label: string; value: string }>;
  defaultStatus?: string;
  customState?: unknown;
  search?: ExtractColumnKeys<TColumns[number]> | ExtractColumnKeys<TColumns[number]>[] | Array<{ value: ExtractColumnKeys<TColumns[number]>; label: string; input?: React.ReactNode }>;
  dateFilter?: boolean;
  customFilter?: Array<{
    filter: React.ComponentType<Record<string, unknown>>;
    label: string;
    props?: Record<string, unknown>;
  }>;
  selectActions?: React.ReactNode | React.ReactNode[];
  onSelectionChange?: (selectedRows: TData[]) => void;
  onTableInstance?: (table: ReturnType<typeof useReactTable<TData>>) => void;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  pageCount?: number;
  pageSizes?: number[];
  isLoading?: boolean;
}

export function DataTable<TData, TColumns extends ExtendedColumnDef<TData>[] = ExtendedColumnDef<TData>[]>({
  columns,
  data,
  onClick,
  placeholder,
  filterWith,
  statuses = [],
  defaultStatus,
  customState,
  search,
  dateFilter,
  customFilter,
  selectActions,
  onSelectionChange,
  onTableInstance,
  onPaginationChange,
  pagination,
  pageCount,
  pageSizes = [10, 20, 30],
  isLoading = false,
}: DataTableProps<TData, TColumns>) {
  // Generate a unique key for this table based on the pathname
  const tableKey = React.useMemo(() => {
    if (typeof window === 'undefined') return 'default';
    return window.location.pathname;
  }, []);

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
    return columnVisibilityStore.get(tableKey) || {};
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});

  // Apply dynamic visibility but respect user preferences
  React.useEffect(() => {
    const storedPreferences = columnVisibilityStore.get(tableKey) || {};

    const dynamicVisibility = columns.reduce((acc, column) => {
      if (column.columnVisibility && 'accessorKey' in column && column.accessorKey) {
        const key = column.accessorKey as string;
        // Only apply dynamic visibility if user hasn't manually set this column
        if (!(key in storedPreferences)) {
          acc[key] = column.columnVisibility(data);
        }
      }
      return acc;
    }, {} as VisibilityState);

    const newVisibility = {
      ...storedPreferences, // User preferences take priority
      ...dynamicVisibility, // Apply dynamic visibility for columns not manually set
    };

    // Only update if visibility has actually changed
    setColumnVisibility(prev => {
      const hasChanged = Object.keys(newVisibility).some(key => prev[key] !== newVisibility[key]) ||
                         Object.keys(prev).some(key => !(key in newVisibility));
      return hasChanged ? newVisibility : prev;
    });
  }, [columns, data, tableKey]);

  // Custom handler to track user visibility changes
  const handleColumnVisibilityChange = React.useCallback<OnChangeFn<VisibilityState>>((updaterOrValue) => {
    setColumnVisibility(prev => {
      const newVisibility = typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue;
      // Store user's manual changes in the global map
      columnVisibilityStore.set(tableKey, {
        ...columnVisibilityStore.get(tableKey),
        ...newVisibility,
      });
      return newVisibility;
    });
  }, [tableKey]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      rowSelection,
      pagination: {
        pageIndex: pagination?.pageIndex ?? 0,
        pageSize: pagination?.pageSize ?? 10,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    onPaginationChange: onPaginationChange,
    pageCount: pageCount,
    manualPagination: true,
  });

  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table
        .getFilteredRowModel()
        .rows.filter(row => rowSelection[row.id as string])
        .map(row => row.original as TData);

      onSelectionChange(selectedRows);
    }
  }, [rowSelection, table, onSelectionChange]);

  React.useEffect(() => {
    if (onTableInstance) {
      onTableInstance(table);
    }
  }, [table, onTableInstance]);

  if (isLoading) return <DataTableSkeleton />;

  return (
    <div className="space-y-2">
      <DataTableToolbar<TData>
        filterWith={filterWith}
        defaultStatus={defaultStatus}
        customFilter={customFilter}
        dateFilter={dateFilter}
        id={search}
        statuses={statuses}
        table={table}
        placeholder={placeholder}
        selectActions={selectActions}
      />
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row =>
                customState !== undefined ? (
                  <CustomRow<TData> key={row.id} row={row} customState={customState} onClick={onClick} />
                ) : (
                  <TableRow key={row.id} data-selected={row.getIsSelected()}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} onClick={e => onClick?.(cell.row.original, e)}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} pageSizes={pageSizes} />
    </div>
  );
}
