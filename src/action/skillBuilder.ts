import AffectBuilder from "../affect/affectBuilder"
import {AffectType} from "../affect/enum/affectType"
import {Affect} from "../affect/model/affect"
import AbilityService from "../check/abilityService"
import CheckBuilder from "../check/checkBuilder"
import Cost from "../check/cost/cost"
import {CheckType} from "../check/enum/checkType"
import Request from "../request/request"
import RequestService from "../request/requestService"
import {RequestType} from "../request/requestType"
import ResponseMessage from "../request/responseMessage"
import {SkillMessages} from "../skill/constants"
import {SkillType} from "../skill/skillType"
import {percentRoll} from "../support/random/helpers"
import {Messages} from "./constants"
import {ActionPart} from "./enum/actionPart"
import {ActionType} from "./enum/actionType"
import Skill from "./impl/skill"

export default class SkillBuilder {
  private static createDefaultResponseMessage() {
    return (requestService: RequestService) =>
      new ResponseMessage(requestService.getMob(), "", {})
  }

  private static createFailResponseMessage() {
    return (requestService: RequestService) =>
      new ResponseMessage(requestService.getMob(), SkillMessages.Fail)
  }

  private helpText: string
  private requestType: RequestType
  private actionType: ActionType
  private affectType: AffectType
  private actionParts: ActionPart[] = [ ActionPart.Action ]
  private costs: Cost[] = []
  private roll: (requestService: RequestService) => boolean
  private checkBuilder: (request: Request, checkBuilder: CheckBuilder) => void
  private successMessage: (requestService: RequestService) => ResponseMessage
  private failMessage: (requestService: RequestService) => ResponseMessage
  private applySkill: (requestService: RequestService, affectBuilder: AffectBuilder) => Promise<Affect | void>
  private touchesTarget: boolean = false

  constructor(private readonly abilityService: AbilityService, private readonly skillType: SkillType) {
    this.helpText = Messages.Help.NoActionHelpTextProvided
    this.requestType = (this.skillType as any) as RequestType
    this.applySkill = (_, affectBuilder) => Promise.resolve(affectBuilder ? affectBuilder.build() : undefined)
    this.roll = (requestService: RequestService) =>
      requestService.getResult(CheckType.HasSkill).level > percentRoll()
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

  public setSuccessMessage(successMessage: (requestService: RequestService) => ResponseMessage): SkillBuilder {
    this.successMessage = successMessage
    return this
  }

  public setFailMessage(failMessage: (requestService: RequestService) => ResponseMessage): SkillBuilder {
    this.failMessage = failMessage
    return this
  }

  public setApplySkill(
    applySkill: (requestService: RequestService, affectBuilder: AffectBuilder) =>
      Promise<Affect | void>): SkillBuilder {
    this.applySkill = applySkill
    return this
  }

  public setRoll(roll: (requestService: RequestService) => boolean): SkillBuilder {
    this.roll = roll
    return this
  }

  public setTouchesTarget(): SkillBuilder {
    this.touchesTarget = true
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
      this.touchesTarget,
      this.helpText)
  }
}
