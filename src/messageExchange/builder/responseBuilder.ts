import CheckedRequest from "../../check/checkedRequest"
import {MobEntity} from "../../mob/entity/mobEntity"
import {RoomEntity} from "../../room/entity/roomEntity"
import InputContext from "../context/inputContext"
import {RequestType} from "../enum/requestType"
import {ResponseStatus} from "../enum/responseStatus"
import Request from "../request"
import Response from "../response"
import ResponseMessage from "../responseMessage"
import ResponseMessageBuilder from "./responseMessageBuilder"

export default class ResponseBuilder {
  public static createResponse(
    mob: MobEntity,
    room: RoomEntity,
    responseMessage: ResponseMessage) {
    return new Response(
      new Request(mob, room, new InputContext(RequestType.Noop, "")),
      ResponseStatus.Info,
      responseMessage)
  }

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

  public okWithMessage(responseMessageBuilder: ResponseMessageBuilder): Promise<Response> {
    return this.response(ResponseStatus.Ok, responseMessageBuilder.create())
  }

  public response(status: ResponseStatus, message: ResponseMessage): Promise<Response> {
    return Promise.resolve(new Response(this.request, status, message))
  }
}
