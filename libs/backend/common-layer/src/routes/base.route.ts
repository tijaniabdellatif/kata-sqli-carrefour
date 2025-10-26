import { Router } from 'express';

export abstract class BaseRoutes {
  public router: Router;
  private isInit: boolean = false;

  constructor() {
    this.router = Router();
  }

  public getRouter(): Router {
    if (!this.isInit) {
      this.initRoutes();
      this.isInit = true;
    }

    return this.router;
  }

  protected abstract initRoutes(): void;

  public isInitialized(): boolean {
    return this.isInit;
  }
}
