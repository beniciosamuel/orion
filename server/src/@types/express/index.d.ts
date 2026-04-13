import type { Context } from "../../services/Context";

declare global {
  namespace Express {
    interface Request {
      context?: Context;
    }
  }
}

export {};
