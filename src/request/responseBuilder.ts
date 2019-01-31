import CheckedRequest from "../check/checkedRequest"
import { Request } from "./request"
import Response from "./response"
import ResponseMessage from "./responseMessage"
import { ResponseStatus } from "./responseStatus"

export default class ResponseBuilder {
  constructor(private readonly request: Request | CheckedRequest) {}

  public success(
    templateString?: string,
    toRequestCreator?: object,
    toTarget = toRequestCreator,
    toObservers = toTarget): Promise<Response> {
    return this.response(
      ResponseStatus.Success,
      new ResponseMessage(
        this.request.mob,
        templateString || "",
        toRequestCreator,
        toTarget,
        toObservers))
  }

  public fail(
    templateString?: string,
    toRequestCreator?: object,
    toTarget = toRequestCreator,
    toObservers = toTarget): Promise<Response> {
    return this.response(
      ResponseStatus.ActionFailed,
      new ResponseMessage(
        this.request.mob,
        templateString || "",
        toRequestCreator,
        toTarget,
        toObservers))
  }

  public info(messageToRequestCreator: string): Promise<Response> {
    return this.response(
      ResponseStatus.Info,
      new ResponseMessage(this.request.mob, messageToRequestCreator))
  }

  public error(messageToRequestCreator: string): Promise<Response> {
    return this.response(
      ResponseStatus.PreconditionsFailed,
      new ResponseMessage(this.request.mob, messageToRequestCreator))
  }

  private response(status: ResponseStatus, message: ResponseMessage): Promise<Response> {
    return Promise.resolve(new Response(this.request, status, message))
  }
}
