import { DbModel } from "@shared/services/model.service";

type TableMethod = InstanceType<typeof DbModel>["createTable"];

class _Tables {
  private tableMethods: TableMethod[] = [];

  addMethod = (method: TableMethod) => this.tableMethods.push(method);

  runAll = async (fn?: Function) => {
    for (const method of this.tableMethods) await method();
    if (fn) await fn();
  };
}

export const models = new _Tables();
