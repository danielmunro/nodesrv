import { RequestType } from "../requestType"

export default interface RequestContext {
  getRequestType(): RequestType
  getSource(): any
}
