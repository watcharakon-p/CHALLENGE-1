import { SortBy, SortDir } from "@/app/types"

export function nextSort(prevBy: SortBy, prevDir: SortDir, sortBy: SortBy):{by: SortBy, dir: SortDir} {
  if(prevBy === sortBy) {
    return {by: prevBy, dir: prevDir === "asc" ? "desc" : "asc"}
  }
  return {by: sortBy, dir: "asc"}
}