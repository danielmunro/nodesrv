import AffectBuilder from "../../affect/affectBuilder"
import {AffectType} from "../../affect/affectType"
import {Affect} from "../../affect/model/affect"
import AbilityService from "../../check/abilityService"
import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import {CheckType} from "../../check/checkType"
import Cost from "../../check/cost/cost"
import TouchEvent from "../../mob/event/touchEvent"
import {Mob} from "../../mob/model/mob"
import Request from "../../request/request"
import RequestService from "../../request/requestService"
import {RequestType} from "../../request/requestType"
import Response from "../../request/response"
import ResponseMessage from "../../request/responseMessage"
import {ResponseStatus} from "../../request/responseStatus"
import SkillEvent from "../../skill/skillEvent"
import {SkillType} from "../../skill/skillType"
import Action from "../action"
import {ActionPart} from "../enum/actionPart"
import {ActionType} from "../enum/actionType"

export default class Skill extends Action {
  constructor(
    protected readonly abilityService: AbilityService,
    protected readonly requestType: RequestType,
    protected readonly skillType: SkillType,
    protected readonly affectType: AffectType,
    protected readonly actionType: ActionType,
    protected readonly actionParts: ActionPart[],
    protected readonly costs: Cost[],
    protected readonly roll: (requestService: RequestService) => boolean,
    protected readonly successMessage: (requestService: RequestService) => ResponseMessage,
    protected readonly failureMessage: (requestService: RequestService) => ResponseMessage,
    protected readonly applySkill: (requestService: RequestService, affectBuilder: AffectBuilder) =>
      Promise<Affect | void>,
    protected readonly checkComponents: (request: Request, checkBuilder: CheckBuilder) => void,
    protected readonly touchesTarget: boolean,
    protected readonly helpText: string) {
    super()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    if (!await this.doRoll(requestService)) {
      return requestService.respondWith().response(
        ResponseStatus.ActionFailed,
        this.getFailureMessage(requestService))
    }
    if (this.touchesTarget) {
      const touchEventResponse = await this.createTouchEventResponse(requestService)
      if (touchEventResponse.isSatisifed()) {
        return requestService.respondWith().response(
          ResponseStatus.ActionFailed,
          touchEventResponse.context)
      }
    }
    const affect = await this.getAffectFromApplySkill(requestService) as Affect
    const checkTarget = requestService.getResult(CheckType.HasTarget)
    this.applyAffectIfAffectCreated(requestService, checkTarget, affect)
    await this.checkIfSkillIsOffensive(requestService, checkTarget)
    return requestService.respondWith().response(
      ResponseStatus.Success,
      this.successMessage(requestService))
  }

  public check(request: Request): Promise<Check> {
    const checkBuilder = this.abilityService.createCheckTemplate(request)
      .perform(this)
      .requireFromActionParts(request, this.getActionParts())
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

  public getFailureMessage(requestService: RequestService): ResponseMessage {
    return this.failureMessage(requestService)
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

  private applyAffectIfAffectCreated(requestService: RequestService, checkTarget?: Mob, affect?: Affect) {
    if (affect) {
      const target = checkTarget || requestService.getMob()
      target.affect().add(affect)
    }
  }

  private async checkIfSkillIsOffensive(requestService: RequestService, checkTarget: Mob) {
    if (this.actionType === ActionType.Offensive) {
      await this.abilityService.publishEvent(
        requestService.createAttackEvent(checkTarget))
    }
  }

  private getAffectFromApplySkill(requestService: RequestService) {
    return this.applySkill(
      requestService, new AffectBuilder(this.affectType).setLevel(requestService.getMobLevel()))
  }

  private createTouchEventResponse(requestService: RequestService) {
    return this.abilityService.publishEvent(
      new TouchEvent(requestService.getMob(), requestService.getResult(CheckType.HasTarget)))
  }

  private async doRoll(requestService: RequestService): Promise<boolean> {
    const rollResultInitial = this.roll(requestService)
    const skill = requestService.getResult(CheckType.HasSkill)
    const eventResponse = await this.abilityService.publishEvent(
      requestService.createSkillEvent(skill, rollResultInitial))
    return (eventResponse.event as SkillEvent).rollResult
  }
}
