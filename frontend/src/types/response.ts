import { Pagination } from "./pagination";

export interface Response<T> {
  message: string;
  data: T;
  pagination?: Pagination;
}
