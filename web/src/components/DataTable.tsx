import { SortBy, SortDir, UserRow } from "@/app/types";
import { useMemo } from "react";
import SortIcon from "./Sorticon";

type Props = {
  rows: UserRow[];
  sortBy: SortBy;
  sortDir: SortDir;
  onSort: (sortBy: SortBy) => void;
};

export default function DataTable({ rows, sortBy, sortDir, onSort }: Props) {

  const gridTemplate = useMemo(() => {
    return "[grid-template-columns:60px_1fr_1fr_180px_120px_140px]";
  }, []);

  const currencyFmt = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
  }, []);

  const dateFmt = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }, []);

  const HeaderCell = (key: SortBy, label: string) => (
    <button
      type="button"
      onClick={() => onSort(key)}
      className="px-2 py-1 text-left cursor-pointer inline-flex items-center gap-1 hover:text-slate-900 text-slate-700"
      role="columnheader"
      aria-sort={
        sortBy === key
          ? sortDir === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
    >
      <span>{label}</span>
      <SortIcon active={sortBy === key} dir={sortDir} />
    </button>
  );
  
  return (
    <div className="w-full">
      {/* header */}
      <div
        className={[
          "grid",
          gridTemplate,
          "gap-2",
          "px-3 py-2 border-b border-slate-200",
          "text-xs uppercase tracking-wide text-slate-500",
          "sticky top-0 z-10 bg-white",
        ].join(" ")}
      >
        <div className="font-semibold">ID</div>
        <div>{HeaderCell("name", "Name")}</div>
        <div>{HeaderCell("email", "Email")}</div>
        <div>{HeaderCell("createdAt", "Created At")}</div>
        <div className="font-semibold">Orders</div>
        <div>{HeaderCell("orderTotal", "Order Total")}</div>
      </div>

      {/* body */}
      <div className="h-[560px] w-full overflow-y-auto">
        {rows.map((row) => (
          <div
            key={row.id}
            className={[
              "grid",
              gridTemplate,
              "gap-2",
              "px-3 py-2 border-b border-slate-100",
              "text-sm",
              "odd:bg-white even:bg-slate-50/60 hover:bg-slate-100/80 transition-colors",
            ].join(" ")}
          >
            <div className="font-semibold">#{row.id}</div>
            <div className="truncate">{row.name}</div>
            <div className="truncate">{row.email}</div>
            <div className="text-slate-500">
              {dateFmt.format(new Date(row.createdAt))}
              </div>
            <div className="font-semibold">{row.orderCount}</div>
            <div>{currencyFmt.format(row.orderTotal)}</div>
          </div>
        ))}

        {rows.length === 0 && (
          <div className="h-[560px] w-full flex items-center justify-center">
            No results.
          </div>
        )}

      </div>
    </div>
  );
}
