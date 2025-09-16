export type SortDir = "asc" | "desc";

export type SortBy = "name" | "email" | "createdAt" | "orderTotal";

export interface ListQuery {
  page: number;
  pageSize: number;
  search?: string | null;
  sortBy: SortBy;
  sortDir: SortDir;
}

export interface UserAggRow {
  id: number;
  name: string | null;
  email: string;
  createdAt: Date;
  orderCount: number;
  orderTotal: number;
}

export interface UsersListResponse {
  items: UserAggRow[];
  total: number;
  page: number;
  pageSize: number;
}

export type OrderByMap = Record<SortBy, string>;
