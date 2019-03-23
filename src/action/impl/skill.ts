import {AffectType} from "../../affect/affectType"
import AbilityService from "../../check/abilityService"
import Check from "../../check/check"
import CheckedRequest from "../../check/checkedRequest"
import {CheckType} from "../../check/checkType"
import Cost from "../../check/cost/cost"
import {Mob} from "../../mob/model/mob"
import roll from "../../random/dice"
import {Request} from "../../request/request"
import Response from "../../request/response"
import ResponseMessage from "../../request/responseMessage"
import {ResponseStatus} from "../../request/responseStatus"
import {Skill as SkillModel} from "../../skill/model/skill"
import SkillEvent from "../../skill/skillEvent"
import {SkillType} from "../../skill/skillType"
import Action from "../action"
import {ActionType} from "../enum/actionType"
import AffectBuilder from "../../affect/affectBuilder"
import {Affect} from "../../affect/model/affect"
import CheckBuilder from "../../check/checkBuilder"
import {percentRoll} from "../../random/helpers"
import {RequestType} from "../../request/requestType"
import {ActionPart} from "../enum/actionPart"

export default class Skill extends Action {
  constructor(
    protected readonly abilityService: AbilityService,
    protected readonly requestType: RequestType,
    protected readonly skillType: SkillType,
    protected readonly affectType: AffectType,
    protected readonly actionType: ActionType,
    protected readonly actionParts: ActionPart[],
    protected readonly costs: Cost[],
    protected readonly successMessage: (checkedRequest: CheckedRequest) => ResponseMessage,
    protected readonly failureMessage: (checkedRequest: CheckedRequest) => ResponseMessage,
    protected readonly applySkill: (checkedRequest: CheckedRequest, affectBuilder?: AffectBuilder) =>
      Promise<Affect | void>,
    protected readonly checkComponents: (request: Request, checkBuilder: CheckBuilder) => void,
    protected readonly helpText: string) {
    super()
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const rollResult = this.roll(checkedRequest)
    await this.publishSkillEventFromCheckedRequest(checkedRequest, rollResult)
    if (!rollResult) {
      return checkedRequest.responseWithMessage(
        ResponseStatus.ActionFailed,
        this.getFailureMessage(checkedRequest))
    }
    await this.applySkill(checkedRequest)
    return checkedRequest.responseWithMessage(
      ResponseStatus.Success,
      this.successMessage(checkedRequest))
  }

  public check(request: Request): Promise<Check> {
    const checkBuilder = this.abilityService.createCheckTemplate(request)
      .perform(this)
      .requireFromActionParts(request, this.getActionParts())
      .capture(this)
    if (this.checkComponents) {
      this.checkComponents(request, checkBuilder)
    }
    return checkBuilder.create()
  }

  public getAffectType(): AffectType {
    return this.affectType
  }

  public getSkillType(): SkillType {
    return this.skillType
  }

  public getCosts(): Cost[] {
    return this.costs
  }

  public getActionType(): ActionType {
    return this.actionType
  }

  public roll(checkedRequest: CheckedRequest): boolean {
    return checkedRequest.getCheckTypeResult(CheckType.HasSpell).level > percentRoll()
  }

  public getFailureMessage(checkedRequest: CheckedRequest): ResponseMessage {
    return this.failureMessage(checkedRequest)
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    return this.successMessage(checkedRequest)
  }

  public getHelpText(): string {
    return this.helpText
  }

  public getRequestType(): RequestType {
    return this.requestType
  }

  public getActionParts(): ActionPart[] {
    return this.actionParts
  }

  protected getSkillRoll(mob: Mob, skill: SkillModel): number {
    let amount = (skill.level * 2) / 3
    if (mob.getAffect(AffectType.Forget)) {
      amount -= roll(4, 6)
    }
    const max = Math.min(100, Math.max(1, amount))
    return roll(1, max)
  }

  private publishSkillEventFromCheckedRequest(checkedRequest: CheckedRequest, rollResult: boolean) {
    return this.abilityService.publishEvent(
      new SkillEvent(checkedRequest.getCheckTypeResult(CheckType.HasSkill), checkedRequest.mob, rollResult))
  }
}
