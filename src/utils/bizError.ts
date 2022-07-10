export default class BizError extends Error {
  bizName: string;
  params?: any;
  constructor(name: string, params?: object) {
    super();
    this.bizName = name;
    this.params = params;
  }
}