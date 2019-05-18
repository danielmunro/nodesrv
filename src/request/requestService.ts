import {AffectType} from "../affect/enum/affectType"
import {Affect} from "../affect/model/affect"
import CheckedRequest from "../check/checkedRequest"
import {CheckType} from "../check/enum/checkType"
import {EventType} from "../event/enum/eventType"
import ItemEvent from "../item/event/itemEvent"
import {Item} from "../item/model/item"
import {Disposition} from "../mob/enum/disposition"
import AttackEvent from "../mob/event/attackEvent"
import DamageEventBuilder from "../mob/event/damageEventBuilder"
import MobEvent from "../mob/event/mobEvent"
import {DamageType} from "../mob/fight/enum/damageType"
import {Mob} from "../mob/model/mob"
import {Exit} from "../room/model/exit"
import {Skill} from "../skill/model/skill"
import SkillEvent from "../skill/skillEvent"
import Request from "./request"
import ResponseBuilder from "./responseBuilder"
import ResponseMessageBuilder from "./responseMessageBuilder"

export default class RequestService {
  constructor(
    private readonly checkedRequest: CheckedRequest) {}

  public getMob(): Mob {
    return this.checkedRequest.mob
  }

  public getMobLevel(): number {
    return this.checkedRequest.mob.level
  }

  public setFollow(mob: Mob) {
    this.checkedRequest.mob.follows = mob
  }

  public getAffects(): Affect[] {
    return this.checkedRequest.mob.affects
  }

  public hasAffect(affectType: AffectType): boolean {
    return this.checkedRequest.mob.affect().has(affectType)
  }

  public getEquipped(): Item[] {
    return this.checkedRequest.mob.equipped.items
  }

  public createMobEvent(eventType: EventType, context?: any): MobEvent {
    return new MobEvent(eventType, this.checkedRequest.mob, context)
  }

  public createAttackEvent(target?: Mob): AttackEvent {
    return new AttackEvent(this.checkedRequest.mob, target ? target : this.getTarget())
  }

  public createItemEvent(eventType: EventType, item: Item): ItemEvent {
    return new ItemEvent(eventType, item, this.checkedRequest.mob)
  }

  public createSkillEvent(skill: Skill, rollResult: boolean): SkillEvent {
    return new SkillEvent(skill, this.checkedRequest.mob, rollResult)
  }

  public createDamageEvent(amount: number, damageType: DamageType): DamageEventBuilder {
    return new DamageEventBuilder(this.getTarget(), amount, damageType)
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

  public getTarget() {
    return this.getResult(CheckType.HasTarget)
  }

  public getRoomExits(): Exit[] {
    return this.checkedRequest.room.exits
  }

  public getRoomMvCost(): number {
    return this.checkedRequest.room.getMovementCost()
  }

  public addItemToMobInventory(item?: Item): void {
    if (!item) {
      item = this.getResult(CheckType.ItemPresent)
      if (!item) {
        throw new Error("item not found for get action!")
      }
    }
    this.checkedRequest.mob.inventory.addItem(item)
  }

  public addItemToRoomInventory(item?: Item): void {
    if (!item) {
      item = this.getResult(CheckType.ItemPresent)
      if (!item) {
        throw new Error("item not found for get action!")
      }
    }
    this.checkedRequest.room.inventory.addItem(item)
  }

  public removeItemFromMobInventory(item?: Item): void {
    this.checkedRequest.mob.inventory.removeItem(item ? item : this.getResult())
  }

  public removeItemFromRoomInventory(item?: Item): void {
    this.checkedRequest.room.inventory.removeItem(item ? item : this.getResult())
  }

  public setMobDisposition(disposition: Disposition): void {
    this.checkedRequest.mob.disposition = disposition
  }

  public subtractGold(amount: number): void {
    this.checkedRequest.mob.gold -= amount
  }

  public addGold(amount: number): void {
    this.checkedRequest.mob.gold += amount
  }
}
