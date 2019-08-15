import { RequestType } from "../enum/requestType"

export default interface RequestContext {
  readonly requestType: RequestType
}
