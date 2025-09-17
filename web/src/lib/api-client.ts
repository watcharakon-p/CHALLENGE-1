import { UsersQuery } from "@/app/types";

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";


export async function fetchUsers(query: UsersQuery) {
  const url = `${BASE}/api/users`;
  const params = new URLSearchParams();

  if(query.page) params.set("page", String(query.page))
  if(query.pageSize) params.set("pageSize", String(query.pageSize))
  if(query.sortBy) params.set("sortBy", String(query.sortBy))
  if(query.sortDir) params.set("sortDir", String(query.sortDir))
  if(query.search) params.set("search", String(query.search))

  const res = await fetch(`${url}?${params.toString()}`)
  if(!res.ok) throw new Error("Failed to fetch users")
  return res.json()
}
