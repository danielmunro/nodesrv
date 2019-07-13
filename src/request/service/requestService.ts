import ApplyAbilityResponse from "../../action/response/applyAbilityResponse"
import {AffectEntity} from "../../affect/entity/affectEntity"
import {AffectType} from "../../affect/enum/affectType"
import CheckedRequest from "../../check/checkedRequest"
import {CheckType} from "../../check/enum/checkType"
import {EventType} from "../../event/enum/eventType"
import {createAttackEvent, createItemEvent, createSkillEvent} from "../../event/factory/eventFactory"
import {ItemEntity} from "../../item/entity/itemEntity"
import ItemEvent from "../../item/event/itemEvent"
import {MobEntity} from "../../mob/entity/mobEntity"
import {Disposition} from "../../mob/enum/disposition"
import AttackEvent from "../../mob/event/attackEvent"
import DamageEventBuilder from "../../mob/event/damageEventBuilder"
import {DamageType} from "../../mob/fight/enum/damageType"
import {SkillEntity} from "../../mob/skill/entity/skillEntity"
import SkillEvent from "../../mob/skill/event/skillEvent"
import {ExitEntity} from "../../room/entity/exitEntity"
import {Target} from "../../types/target"
import ResponseBuilder from "../builder/responseBuilder"
import ResponseMessageBuilder from "../builder/responseMessageBuilder"
import Request from "../request"

export default class RequestService {
  public applyAbilityResponse: ApplyAbilityResponse

  constructor(private readonly checkedRequest: CheckedRequest) {}

  public getMob(): MobEntity {
    return this.checkedRequest.mob
  }

  public getMobLevel(): number {
    return this.checkedRequest.mob.level
  }

  public setFollow(mob: MobEntity) {
    this.checkedRequest.mob.follows = mob
  }

  public getAffects(): AffectEntity[] {
    return this.checkedRequest.mob.affects
  }

  public hasAffect(affectType: AffectType): boolean {
    return this.checkedRequest.mob.affect().has(affectType)
  }

  public getEquipped(): ItemEntity[] {
    return this.checkedRequest.mob.equipped.items
  }

  public createAttackEvent(target?: MobEntity): AttackEvent {
    return createAttackEvent(this.checkedRequest.mob, target ? target : this.getTarget() as MobEntity)
  }

  public createItemEvent(eventType: EventType, item: ItemEntity): ItemEvent {
    return createItemEvent(eventType, item, this.checkedRequest.mob)
  }

  public createSkillEvent(skill: SkillEntity, rollResult: boolean): SkillEvent {
    return createSkillEvent(skill, this.checkedRequest.mob, rollResult)
  }

  public createDamageEvent(amount: number, damageType: DamageType): DamageEventBuilder {
    return new DamageEventBuilder(this.getTarget() as MobEntity, amount, damageType)
      .setSource(this.getMob())
  }

  public createResponseMessage(message: string): ResponseMessageBuilder {
    return new ResponseMessageBuilder(this.getMob(), message, this.getTarget())
  }

  public respondWith(): ResponseBuilder {
    return new ResponseBuilder(this.checkedRequest)
  }

  public getResult(checkType?: CheckType) {
    if (!checkType) {
      return this.checkedRequest.check.result
    }
    return this.checkedRequest.getCheckTypeResult(checkType)
  }

  public getResults(...checkTypes: CheckType[]) {
    return checkTypes.map(checkType =>
      this.checkedRequest.getCheckTypeResult(checkType))
  }

  public getSubject(): string {
    return this.checkedRequest.request.getSubject()
  }

  public getMessage(): string {
    return this.checkedRequest.request.getContextAsInput().message
  }

  public getMessageInTell(): string {
    return this.checkedRequest.request.getContextAsInput().words.slice(2).join(" ")
  }

  public getComponent(): string {
    return this.checkedRequest.request.getComponent()
  }

  public getRequest(): Request {
    return this.checkedRequest.request
  }

  public getTarget(): Target {
    return this.getResult(CheckType.HasTarget)
  }

  public getRoomExits(): ExitEntity[] {
    return this.checkedRequest.room.exits
  }

  public getRoomMvCost(): number {
    return this.checkedRequest.room.getMovementCost()
  }

  public addItemToMobInventory(item?: ItemEntity): void {
    if (!item) {
      item = this.getResult(CheckType.ItemPresent)
      if (!item) {
        throw new Error("item not found for get action!")
      }
    }
    this.checkedRequest.mob.inventory.addItem(item)
  }

  public addItemToRoomInventory(item?: ItemEntity): void {
    if (!item) {
      item = this.getResult(CheckType.ItemPresent)
      if (!item) {
        throw new Error("item not found for get action!")
      }
    }
    this.checkedRequest.room.inventory.addItem(item)
  }

  public removeItemFromMobInventory(item?: ItemEntity): void {
    this.checkedRequest.mob.inventory.removeItem(item ? item : this.getResult())
  }

  public removeItemFromRoomInventory(item?: ItemEntity): void {
    this.checkedRequest.room.inventory.removeItem(item ? item : this.getResult())
  }

  public setMobDisposition(disposition: Disposition): RequestService {
    this.checkedRequest.mob.disposition = disposition
    return this
  }

  public subtractGold(amount: number): void {
    this.checkedRequest.mob.gold -= amount
  }

  public addGold(amount: number): void {
    this.checkedRequest.mob.gold += amount
  }
}
