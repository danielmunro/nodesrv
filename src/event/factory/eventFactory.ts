import Action from "../../action/impl/action"
import Cost from "../../check/cost/cost"
import {Client} from "../../client/client"
import {Channel} from "../../client/enum/channel"
import ClientEvent from "../../client/event/clientEvent"
import InputEvent from "../../client/event/inputEvent"
import SocialEvent from "../../client/event/socialEvent"
import {ItemEntity} from "../../item/entity/itemEntity"
import ItemEvent from "../../item/event/itemEvent"
import {MobEntity} from "../../mob/entity/mobEntity"
import AttackEvent from "../../mob/event/attackEvent"
import CastEvent from "../../mob/event/castEvent"
import CostEvent from "../../mob/event/costEvent"
import DamageEvent from "../../mob/event/damageEvent"
import DeathEvent from "../../mob/event/deathEvent"
import ItemDroppedEvent from "../../mob/event/itemDroppedEvent"
import MobArrivedEvent from "../../mob/event/mobArrivedEvent"
import MobEvent from "../../mob/event/mobEvent"
import MobLeftEvent from "../../mob/event/mobLeftEvent"
import MobMessageEvent from "../../mob/event/mobMessageEvent"
import MobMoveEvent from "../../mob/event/mobMoveEvent"
import TickEvent from "../../mob/event/tickEvent"
import TouchEvent from "../../mob/event/touchEvent"
import {Attack} from "../../mob/fight/attack"
import Death from "../../mob/fight/death"
import {DamageType} from "../../mob/fight/enum/damageType"
import FightEvent from "../../mob/fight/event/fightEvent"
import {Fight} from "../../mob/fight/fight"
import {SkillEntity} from "../../mob/skill/entity/skillEntity"
import SkillEvent from "../../mob/skill/event/skillEvent"
import {SpellEntity} from "../../mob/spell/entity/spellEntity"
import Request from "../../request/request"
import Response from "../../request/response"
import ResponseMessage from "../../request/responseMessage"
import {RoomEntity} from "../../room/entity/roomEntity"
import {Direction} from "../../room/enum/direction"
import RoomMessageEvent from "../../room/event/roomMessageEvent"
import {Target} from "../../types/target"
import {EventType} from "../enum/eventType"
import TestEvent from "../test/testEvent"

export function createClientEvent(eventType: EventType, client: Client): ClientEvent {
  return { eventType, client }
}

export function createInputEvent(request: Request, action: Action, response?: Response): InputEvent {
  return {
    action,
    eventType: EventType.ClientRequest,
    mob: request.mob,
    request,
    response,
  }
}

export function createSocialEvent(mob: MobEntity, channel: Channel, message: string, toMob?: MobEntity): SocialEvent {
  return {
    channel,
    eventType: EventType.Social,
    message,
    mob,
    toMob,
  }
}

export function createTestEvent(eventType: EventType): TestEvent {
  return { eventType }
}

export function createItemEvent(eventType: EventType, item: ItemEntity, carriedBy?: any): ItemEvent {
  return { eventType, item, carriedBy }
}

export function createDestroyItemEvent(item: ItemEntity, carriedBy?: any): ItemEvent {
  return { eventType: EventType.ItemDestroyed, item, carriedBy }
}

export function createCostEvent(mob: MobEntity, costs: Cost[]): CostEvent {
  return { eventType: EventType.CostApplied, mob, costs }
}

export function createDamageEvent(
  mob: MobEntity, amount: number, damageType: DamageType, modifier: number, source: MobEntity): DamageEvent {
  return {
    amount,
    damageType,
    eventType: EventType.DamageCalculation,
    mob,
    modifier,
    source,
  }
}

export function createModifiedDamageEvent(damageEvent: DamageEvent, modifier: number) {
  return createDamageEvent(
    damageEvent.mob,
    damageEvent.amount,
    damageEvent.damageType,
    damageEvent.modifier + modifier,
    damageEvent.source)
}

export function createMobEvent(eventType: EventType, mob: MobEntity): MobEvent {
  return { eventType, mob }
}

export function createItemDroppedEvent(mob: MobEntity, item: ItemEntity): ItemDroppedEvent {
  return { eventType: EventType.ItemDropped, mob, item }
}

export function createMobLeaveEvent(
  mob: MobEntity, room: RoomEntity, mvCost: number, direction?: Direction): MobLeftEvent {
  return { eventType: EventType.MobLeft, mob, room, mvCost, direction }
}

export function createMobArriveEvent(
  mob: MobEntity, room: RoomEntity, mvCost: number, direction?: Direction): MobArrivedEvent {
  return { eventType: EventType.MobArrived, mob, room, mvCost, direction }
}

export function createMobMoveEvent(
  mob: MobEntity, source: RoomEntity, destination: RoomEntity, mvCost: number, direction?: Direction): MobMoveEvent {
  return { eventType: EventType.MobMoved, mob, source, destination, mvCost, direction }
}

export function createModifiedMobMoveEvent(event: MobMoveEvent, mvCost: number): MobMoveEvent {
  return { ...event, mvCost }
}

export function createMobMessageEvent(mob: MobEntity, message: string): MobMessageEvent {
  return { eventType: EventType.MobUpdated, mob, message }
}

export function createFightEvent(
  eventType: EventType, mob: MobEntity, fight: Fight, attacks: Attack[] = []): FightEvent {
  return { eventType, mob, fight, attacks }
}

export function createRoomMessageEvent(room: RoomEntity, message: ResponseMessage): RoomMessageEvent {
  return { eventType: EventType.RoomMessage, room, message }
}

export function createSkillEvent(skill: SkillEntity | SpellEntity, mob: MobEntity, rollResult: boolean): SkillEvent {
  return { eventType: EventType.SkillInvoked, skill, mob, rollResult }
}

export function createTouchEvent(mob: MobEntity, target: MobEntity): TouchEvent {
  return { eventType: EventType.Touch, mob, target }
}

export function createAttackEvent(mob: MobEntity, target: MobEntity): AttackEvent {
  return { eventType: EventType.Attack, mob, target }
}

export function createTickEvent(mob: MobEntity, room: RoomEntity, regenModifier: number): TickEvent {
  return { eventType: EventType.Tick, mob, room, regenModifier }
}

export function createModifiedTickEvent(event: TickEvent, regenModifier: number): TickEvent {
  return { ...event, regenModifier }
}

export function createCastEvent(mob: MobEntity, spell: SpellEntity, target: Target, roll: number): CastEvent {
  return { eventType: EventType.Cast, mob, spell, target, roll }
}

export function createModifiedCastEvent(event: CastEvent, roll: number): CastEvent {
  return { ...event, roll }
}

export function createDeathEvent(death: Death): DeathEvent {
  return { eventType: EventType.MobDeath, death }
}
