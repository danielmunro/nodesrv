import { Request } from "./request"
import { ResponseStatus } from "./responseStatus"

export default class Response {
  public static ok(request: Request, message: string): Promise<Response> {
    return this.create(request, ResponseStatus.Ok, message)
  }

  public static fail(request: Request, message: string): Promise<Response> {
    return this.create(request, ResponseStatus.ActionFailed, message)
  }

  private static create(request: Request, status: ResponseStatus, message: string): Promise<Response> {
    return new Promise((resolve) => resolve(new Response(request, status, message)))
  }

  constructor(
    readonly request: Request,
    readonly status: ResponseStatus,
    readonly message: string) {
  }
}
