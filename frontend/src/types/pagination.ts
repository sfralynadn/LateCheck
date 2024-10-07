export interface Pagination {
  current_page: number;
  total: number;
  from: number;
  to: number;
  per_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  last_page: number;
}
