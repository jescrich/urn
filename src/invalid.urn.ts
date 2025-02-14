export class InvalidUrnError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "InvalidUrnError";
    }
  }