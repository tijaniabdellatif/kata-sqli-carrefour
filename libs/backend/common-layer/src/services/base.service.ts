export abstract class BaseService {
  private static instances: Map<string, BaseService> = new Map();

  protected constructor() {
    const className = this.constructor.name;

    if (BaseService.instances.has(className)) {
      return BaseService.instances.get(className)!;
    }
    BaseService.instances.set(className, this);
  }

  protected static getInstance<T extends BaseService>(this: new () => T): T {
    const className = this.name;
    if (!BaseService.instances.has(className)) {
      BaseService.instances.set(className, new this());
    }
    return BaseService.instances.get(className) as T;
  }
}
