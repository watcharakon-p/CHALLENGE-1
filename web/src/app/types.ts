export interface UserRow {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  orderCount: number;
  orderTotal: number;
}


export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type SortBy = "name" | "email" | "createdAt" | "orderTotal";
export type SortDir = "asc" | "desc";

export type UsersQuery = {
  sortBy?: SortBy;
  sortDir?: SortDir;
  page?: number;
  pageSize?: number;
  search?: string;
};

