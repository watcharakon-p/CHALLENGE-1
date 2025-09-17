"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import { Paged, SortBy, SortDir, UserRow } from "./types";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { nextSort } from "@/lib/sort";
import { fetchUsers } from "@/lib/api-client";
import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";
import TextField from "@/components/TextField";

export default function Home() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebouncedValue(search, 250);

  const [data, setData] = useState<Paged<UserRow>>({
    items: [],
    total: 0,
    page,
    pageSize,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Fetch users
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetchUsers({
      page,
      pageSize,
      sortBy,
      sortDir,
      search: debouncedSearch,
    }).then((res: Paged<UserRow>) => {
      setData(res);
      setLoading(false);
    }).catch((err: Error) => {
      setError(String(err));
      setLoading(false);
    }).finally(() => {
      setLoading(false);
    });
  }, [page, pageSize, sortBy, sortDir, debouncedSearch]);


  const onSort = useCallback((sortBy: SortBy) => {
    const {by, dir} = nextSort(sortBy, sortDir, sortBy);
    setSortBy(by);
    setSortDir(dir);
    setPage(1);
  }, [sortDir]);

  const body = useMemo(() => {

    if(loading) return <div className="py-10 text-center text-slate-500">Loading...</div>
    if(error) return <div className="py-10 text-center text-red-600">Error: {error}</div>

    if(data.items.length === 0) return <div className="py-10 text-center text-slate-500">No results.</div>

    return (
      <DataTable
        rows={data.items}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={onSort}
      />
    )
  }, [loading,error,data, sortBy, sortDir,onSort]);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between border-b">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight">Users</h2>
            <p className="text-sm text-slate-500">Browse, search, and sort user records.</p>
          </div>
          <div className="flex items-center gap-3">
            <TextField
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search users by name or email..."
              className="w-64"
            />
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              Total: {data.total.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="p-2 sm:p-3">
          {body}
        </div>

        <div className="flex items-center justify-between gap-4 border-t px-4 py-3">
          <div className="text-xs text-slate-500">Showing page {page}</div>
          <Pagination
            page={page}
            total={data.total}
            pageSize={pageSize}
            onPage={(p) => setPage(p)}
          />
        </div>
      </section>
    </div>
  );
}
