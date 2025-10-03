export interface IApi {
  get: any;
  post: PostApiType;
  postData: PostApiType;
  put: PutApiType;
  putData: PutApiType;
  getPage: GetPageApiType;
  deleteData: DeleteApiType;
}
export interface IQueryParams {
  pageSize: number;
  pageNumber: number;
  search?: string;
  sortBy?: string;
  sortOrder: string;
  filterBy?: string;
}
export type PostApiType = (url: string, payload?: any) => Promise<any>;
export type GetApiType = (url: string, payload?: any) => Promise<any>;
export type GetPageApiType = (url: string, query: IQueryParams) => Promise<any>;
export type PutApiType = (url: string, payload?: any) => Promise<any>;
export type DeleteApiType = (url: string, payload?: any) => Promise<any>;
export type RequestApiType = (
  url: string,
  type: string,
  payload: any | null
) => Promise<any>;
export type GetFileApiType = (url: string) => Promise<any>;
