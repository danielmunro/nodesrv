import { Request } from "./request"
import { ResponseStatus } from "./responseStatus"
import Response from "./response"

export default class ResponseBuilder {
  constructor(
    readonly request: Request,
  ) {}

  public info(message: string): Promise<Response> {
    return this.response(ResponseStatus.Info, message)
  }

  public success(message: string): Promise<Response> {
    return this.response(ResponseStatus.Success, message)
  }

  public fail(message: string): Promise<Response> {
    return this.response(ResponseStatus.ActionFailed, message)
  }

  public error(message: string): Promise<Response> {
    return this.response(ResponseStatus.PreconditionsFailed, message)
  }

  private response(status: ResponseStatus, message: string): Promise<Response> {
    return new Promise((resolve) => resolve(new Response(this, status, message)))
  }
}
