import CheckedRequest from "../check/checkedRequest"
import { Request } from "./request"
import Response from "./response"
import ResponseAction from "./responseAction"
import ResponseMessage from "./responseMessage"
import { ResponseStatus } from "./responseStatus"

export default class ResponseBuilder {
  constructor(
    private readonly request: Request | CheckedRequest,
    private readonly responseAction: ResponseAction,
  ) {}

  public success(message: ResponseMessage = null): Promise<Response> {
    return this.response(ResponseStatus.Success, message)
  }

  public fail(message: ResponseMessage = null): Promise<Response> {
    return this.response(ResponseStatus.ActionFailed, message)
  }

  public info(messageToRequestCreator: string): Promise<Response> {
    return this.response(ResponseStatus.Info, new ResponseMessage(messageToRequestCreator))
  }

  public error(messageToRequestCreator: string): Promise<Response> {
    return this.response(ResponseStatus.PreconditionsFailed, new ResponseMessage(messageToRequestCreator))
  }

  private response(status: ResponseStatus, message: ResponseMessage): Promise<Response> {
    return Promise.resolve(new Response(this.request, status, message, this.responseAction))
  }
}
