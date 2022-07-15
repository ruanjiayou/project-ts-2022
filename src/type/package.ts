export type Package = {
  [key: string]: {
    status?: number;
    code: number;
    message: string;
  };
}