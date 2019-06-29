import AffectBuilder from "../../affect/builder/affectBuilder"
import {AffectEntity} from "../../affect/entity/affectEntity"
import {AffectType} from "../../affect/enum/affectType"
import Check from "../../check/check"
import Cost from "../../check/cost/cost"
import {CheckType} from "../../check/enum/checkType"
import AbilityService from "../../check/service/abilityService"
import {createTouchEvent} from "../../event/factory/eventFactory"
import {MobEntity} from "../../mob/entity/mobEntity"
import {RequestType} from "../../request/enum/requestType"
import {ResponseStatus} from "../../request/enum/responseStatus"
import Request from "../../request/request"
import Response from "../../request/response"
import ResponseMessage from "../../request/responseMessage"
import RequestService from "../../request/service/requestService"
import SkillEvent from "../../mob/skill/event/skillEvent"
import {SkillType} from "../../mob/skill/skillType"
import {ActionPart} from "../enum/actionPart"
import {ActionType} from "../enum/actionType"
import ApplyAbilityResponse from "../response/applyAbilityResponse"
import Action, {ApplyAbility, CheckComponentAdder} from "./action"

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
    protected readonly applySkill: ApplyAbility,
    protected readonly checkComponents: CheckComponentAdder,
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
      if (touchEventResponse.isSatisfied()) {
        return requestService.respondWith().response(
          ResponseStatus.ActionFailed,
          touchEventResponse.context)
      }
    }
    const applyResponse = await this.getAffectFromApplySkill(requestService)
    const checkTarget = requestService.getResult(CheckType.HasTarget)
    if (applyResponse) {
      this.applyAffectIfAffectCreated(requestService, checkTarget, applyResponse.affect)
    }
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

  /* istanbul ignore next */
  public getHelpText(): string {
    return this.helpText
  }

  public getRequestType(): RequestType {
    return this.requestType
  }

  public getActionParts(): ActionPart[] {
    return this.actionParts
  }

  private applyAffectIfAffectCreated(requestService: RequestService, checkTarget?: MobEntity, affect?: AffectEntity) {
    if (affect) {
      const target = checkTarget || requestService.getMob()
      target.affect().add(affect)
    }
  }

  private async checkIfSkillIsOffensive(requestService: RequestService, checkTarget: MobEntity) {
    if (this.actionType === ActionType.Offensive) {
      await this.abilityService.publishEvent(requestService.createAttackEvent(checkTarget))
    }
  }

  private getAffectFromApplySkill(requestService: RequestService): Promise<ApplyAbilityResponse | void> {
    return this.applySkill(
      requestService, new AffectBuilder(this.affectType).setLevel(requestService.getMobLevel()))
  }

  private createTouchEventResponse(requestService: RequestService) {
    return this.abilityService.publishEvent(
      createTouchEvent(requestService.getMob(), requestService.getResult(CheckType.HasTarget)))
  }

  private async doRoll(requestService: RequestService): Promise<boolean> {
    const rollResultInitial = this.roll(requestService)
    const skill = requestService.getResult(CheckType.HasSkill)
    const eventResponse = await this.abilityService.publishEvent(
      requestService.createSkillEvent(skill, rollResultInitial))
    return (eventResponse.event as SkillEvent).rollResult
  }
}
