export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    statusCode?: number;
  }
  export interface ApiErrorResponse {
    success: boolean;
    errorCode: string;
  }
  export interface Page<TResult> {
    pageSize: number;
    pageNumber: number;
    total: number;
    result: TResult[];
  }
  export interface PagedApiResponse<T> extends ApiResponse<Page<T>> {}