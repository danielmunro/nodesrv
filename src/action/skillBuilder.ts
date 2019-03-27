import AffectBuilder from "../affect/affectBuilder"
import {AffectType} from "../affect/affectType"
import {Affect} from "../affect/model/affect"
import AbilityService from "../check/abilityService"
import CheckBuilder from "../check/checkBuilder"
import CheckedRequest from "../check/checkedRequest"
import {CheckType} from "../check/checkType"
import Cost from "../check/cost/cost"
import {percentRoll} from "../random/helpers"
import {Request} from "../request/request"
import {RequestType} from "../request/requestType"
import ResponseMessage from "../request/responseMessage"
import {SkillMessages} from "../skill/constants"
import {SkillType} from "../skill/skillType"
import {Messages} from "./constants"
import {ActionPart} from "./enum/actionPart"
import {ActionType} from "./enum/actionType"
import Skill from "./impl/skill"

export default class SkillBuilder {
  private static createDefaultResponseMessage() {
    return (checkedRequest: CheckedRequest) =>
      new ResponseMessage(checkedRequest.mob, "", {})
  }

  private static createFailResponseMessage() {
    return (checkedRequest: CheckedRequest) =>
      new ResponseMessage(checkedRequest.mob, SkillMessages.Fail)
  }

  private helpText: string
  private requestType: RequestType
  private actionType: ActionType
  private affectType: AffectType
  private actionParts: ActionPart[] = [ ActionPart.Action ]
  private costs: Cost[] = []
  private roll: (checkedRequest: CheckedRequest) => boolean
  private checkBuilder: (request: Request, checkBuilder: CheckBuilder) => void
  private successMessage: (checkedRequest: CheckedRequest) => ResponseMessage
  private failMessage: (checkedRequest: CheckedRequest) => ResponseMessage
  private applySkill: (checkedRequest: CheckedRequest, affectBuilder: AffectBuilder) => Promise<Affect | void>

  constructor(private readonly abilityService: AbilityService, private readonly skillType: SkillType) {
    this.helpText = Messages.Help.NoActionHelpTextProvided
    this.requestType = (this.skillType as any) as RequestType
    this.applySkill = (_, affectBuilder) => Promise.resolve(affectBuilder ? affectBuilder.build() : undefined)
    this.roll = (checkedRequest: CheckedRequest) =>
      checkedRequest.getCheckTypeResult(CheckType.HasSkill).level > percentRoll()
    this.failMessage = SkillBuilder.createDefaultResponseMessage()
    this.successMessage = SkillBuilder.createFailResponseMessage()
  }

  public setRequestType(requestType: RequestType): SkillBuilder {
    this.requestType = requestType
    return this
  }

  public setAffectType(affectType: AffectType): SkillBuilder {
    this.affectType = affectType
    return this
  }

  public setActionType(actionType: ActionType): SkillBuilder {
    this.actionType = actionType
    return this
  }

  public setCosts(costs: Cost[]): SkillBuilder {
    this.costs = costs
    return this
  }

  public setActionParts(actionParts: ActionPart[]): SkillBuilder {
    this.actionParts = actionParts
    return this
  }

  public setCheckBuilder(checkBuilder: (request: Request, checkBuilder: CheckBuilder) => void): SkillBuilder {
    this.checkBuilder = checkBuilder
    return this
  }

  public setSuccessMessage(successMessage: (checkedRequest: CheckedRequest) => ResponseMessage): SkillBuilder {
    this.successMessage = successMessage
    return this
  }

  public setFailMessage(failMessage: (checkedRequest: CheckedRequest) => ResponseMessage): SkillBuilder {
    this.failMessage = failMessage
    return this
  }

  public setApplySkill(
    applySkill: (checkedRequest: CheckedRequest, affectBuilder: AffectBuilder) =>
      Promise<Affect | void>): SkillBuilder {
    this.applySkill = applySkill
    return this
  }

  public setRoll(roll: (checkedRequest: CheckedRequest) => boolean): SkillBuilder {
    this.roll = roll
    return this
  }

  public create(): Skill {
    return new Skill(
      this.abilityService,
      this.requestType,
      this.skillType,
      this.affectType,
      this.actionType,
      this.actionParts,
      this.costs,
      this.roll,
      this.successMessage,
      this.failMessage,
      this.applySkill,
      this.checkBuilder,
      this.helpText)
  }
}
