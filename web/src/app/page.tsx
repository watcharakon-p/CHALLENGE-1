"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import { Paged, SortBy, SortDir, UserRow } from "./types";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { nextSort } from "@/lib/sort";
import { fetchUsers } from "@/lib/api-client";
import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";

export default function Home() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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

    if(loading) return <div>Loading...</div>
    if(error) return <div>Error: {error}</div>

    if(data.items.length === 0) return <div>No results.</div>

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
    <div>
      <h1>Challenge 1</h1>
      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search..."
        />

        <span>
          Total : {data.total.toLocaleString()}
        </span>
      </div>
      
      {body}

      <div className="mt-4">
        <Pagination
          page={page}
          total={data.total}
          pageSize={pageSize}
          onPage={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}
