import {Item} from "../item/model/item"
import {Mob} from "../mob/model/mob"
import ResponseMessage from "./responseMessage"

export default class ResponseMessageBuilder {
  private selfIdentifier: string = "you"
  private targetPossessive: boolean = false
  private pluralizeRequestCreator: boolean = false
  private pluralizeTarget: boolean = false
  private verbToRequestCreator: string
  private verbToTarget: string
  private verbToObservers: string
  private replacements: any = {}

  constructor(
    private readonly requestCreator: Mob,
    private readonly templateString: string,
    private readonly target?: Mob | Item) {
    if (!this.target) {
      this.target = requestCreator
    }
  }

  public setPluralizeRequestCreator(): ResponseMessageBuilder {
    this.pluralizeRequestCreator = true
    return this
  }

  public setPluralizeTarget(): ResponseMessageBuilder {
    this.pluralizeTarget = true
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

  public setTargetPossessive(): ResponseMessageBuilder {
    this.targetPossessive = true
    return this
  }

  public addReplacement(key: string, value: string): ResponseMessageBuilder {
    this.replacements[key] = value
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
        ...this.replacements,
        requestCreator: this.selfIdentifier,
        target: this.target === this.requestCreator ?
          "you" + (this.targetPossessive ? "r" : "") :
          this.target + (this.pluralizeTarget ? "'s" : ""),
        verb: this.target === this.requestCreator ? this.verbToTarget : this.verbToRequestCreator,
      },
      {
        ...this.replacements,
        requestCreator: this.requestCreator === this.target ?
          "you" : this.requestCreator + (this.pluralizeRequestCreator ? "'s" : ""),
        target: "you" + (this.targetPossessive ? "r" : ""),
        verb: this.verbToTarget,
      },
      {
        ...this.replacements,
        requestCreator: this.requestCreator + (this.pluralizeRequestCreator ? "'s" : ""),
        target: this.target + (this.pluralizeTarget ? "'s" : ""),
        verb: this.verbToObservers,
      })
  }
}
