// Application-wide TypeScript interfaces
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
