import { RequestType } from "../requestType"
import RequestContext from "./requestContext"

export default class InputContext implements RequestContext {
  public readonly command: string
  public readonly subject: string
  public readonly component: string
  public readonly message: string

  constructor(public readonly requestType: RequestType, public readonly input: string = requestType.toString()) {
    const words = this.input.split(" ")
    this.command = words[0]
    this.subject = words[1]
    this.component = words[2]
    this.message = words.slice(1).join(" ")
  }

  public getRequestType(): RequestType {
    return this.requestType
  }

  public getSource(): any {
    return this.input
  }
}
