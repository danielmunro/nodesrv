import {Item} from "../item/model/item"
import {Mob} from "../mob/model/mob"
import ResponseMessage from "./responseMessage"

export default class ResponseMessageBuilder {
  private selfIdentifier: string = "you"
  private pluralizeRequestCreator: boolean = false
  private verbToRequestCreator: string
  private verbToTarget: string
  private verbToObservers: string

  constructor(
    private readonly requestCreator: Mob,
    private readonly templateString: string,
    private readonly target?: Mob | Item) {}

  public setPluralizeRequestCreator(): ResponseMessageBuilder {
    this.pluralizeRequestCreator = true
    return this
  }

  public setVerbToRequestCreator(verb: string): ResponseMessageBuilder {
    this.verbToRequestCreator = verb
    return this
  }

  public setVerbToTarget(verb: string): ResponseMessageBuilder {
    this.verbToTarget = verb
    return this
  }

  public setVerbToObservers(verb: string): ResponseMessageBuilder {
    this.verbToObservers = verb
    return this
  }

  public setSelfIdentifier(selfIdentifier: string): ResponseMessageBuilder {
    this.selfIdentifier = selfIdentifier
    return this
  }

  public create(): ResponseMessage {
    if (!this.verbToObservers) {
      this.verbToObservers = this.verbToRequestCreator
    }
    return new ResponseMessage(
      this.requestCreator,
      this.templateString,
      {
        requestCreator: this.selfIdentifier,
        target: this.target === this.requestCreator ? "you" : this.target,
        verb: this.target === this.requestCreator ? this.verbToTarget : this.verbToRequestCreator,
      },
      {
        requestCreator: this.requestCreator + (this.pluralizeRequestCreator ? "'s" : ""),
        target: "you",
        verb: this.verbToTarget,
      },
      {
        requestCreator: this.requestCreator + (this.pluralizeRequestCreator ? "'s" : ""),
        target: this.target,
        verb: this.verbToObservers,
      })
  }
}
