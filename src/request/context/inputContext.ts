import { RequestType } from "../requestType"
import RequestContext from "./requestContext"

export default class InputContext implements RequestContext {
  public readonly words: string[]
  public readonly command: string
  public readonly subject: string
  public readonly component: string
  public readonly message: string

  constructor(public readonly requestType: RequestType, public readonly input: string = requestType.toString()) {
    this.words = this.input.split(" ")
    this.command = this.words[0]
    this.subject = this.words[1]
    this.component = this.words[2]
    this.message = this.words.slice(1).join(" ")
  }

  public getRequestType(): RequestType {
    return this.requestType
  }

  public getSource(): any {
    return this.input
  }
}
