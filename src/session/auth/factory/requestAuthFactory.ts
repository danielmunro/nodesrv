import AuthStep from "../authStep/authStep"
import {ResponseStatus} from "../enum/responseStatus"
import Request from "../request"
import Response from "../response"

export function createResponse(
  request: Request, status: ResponseStatus, authStep: AuthStep, message?: string): Response {
  return { request, status, authStep, message }
}
