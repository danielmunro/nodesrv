import Action from "../action/action"
import Cost from "../check/cost/cost"
import {Channel} from "../client/channel"
import {Client} from "../client/client"
import ClientEvent from "../client/event/clientEvent"
import InputEvent from "../client/event/inputEvent"
import SocialEvent from "../client/event/socialEvent"
import ItemEvent from "../item/event/itemEvent"
import {Item} from "../item/model/item"
import AttackEvent from "../mob/event/attackEvent"
import CostEvent from "../mob/event/costEvent"
import DamageEvent from "../mob/event/damageEvent"
import MobEvent from "../mob/event/mobEvent"
import MobMoveEvent from "../mob/event/mobMoveEvent"
import TouchEvent from "../mob/event/touchEvent"
import {Attack} from "../mob/fight/attack"
import {DamageType} from "../mob/fight/enum/damageType"
import FightEvent from "../mob/fight/event/fightEvent"
import {Fight} from "../mob/fight/fight"
import {Mob} from "../mob/model/mob"
import Request from "../request/request"
import Response from "../request/response"
import ResponseMessage from "../request/responseMessage"
import {Direction} from "../room/constants"
import RoomMessageEvent from "../room/event/roomMessageEvent"
import {Room} from "../room/model/room"
import {Skill} from "../skill/model/skill"
import SkillEvent from "../skill/skillEvent"
import {Spell} from "../spell/model/spell"
import {EventType} from "./enum/eventType"
import TestEvent from "./test/testEvent"

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

export function createSocialEvent(mob: Mob, channel: Channel, message: string, toMob?: Mob): SocialEvent {
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

export function createItemEvent(eventType: EventType, item: Item, carriedBy?: any): ItemEvent {
  return { eventType, item, carriedBy }
}

export function createCostEvent(mob: Mob, costs: Cost[]): CostEvent {
  return { eventType: EventType.CostApplied, mob, costs }
}

export function createDamageEvent(
  target: Mob, amount: number, damageType: DamageType, modifier: number, source: Mob): DamageEvent {
  return {
    amount,
    damageType,
    eventType: EventType.DamageCalculation,
    modifier,
    source,
    target,
  }
}

export function createMobEvent(eventType: EventType, mob: Mob, context?: any): MobEvent {
  return { eventType, mob, context }
}

export function createMobMoveEvent(mob: Mob, source: Room, destination: Room, direction?: Direction): MobMoveEvent {
  return { eventType: EventType.MobMoved, mob, source, destination, direction }
}

export function createFightEvent(eventType: EventType, mob: Mob, fight: Fight, attacks: Attack[] = []): FightEvent {
  return { eventType, mob, fight, attacks }
}

export function createRoomMessageEvent(room: Room, message: ResponseMessage): RoomMessageEvent {
  return { eventType: EventType.RoomMessage, room, message }
}

export function createSkillEvent(skill: Skill | Spell, mob: Mob, rollResult: boolean): SkillEvent {
  return { eventType: EventType.SkillInvoked, skill, mob, rollResult }
}

export function createTouchEvent(mob: Mob, target: Mob): TouchEvent {
  return { eventType: EventType.Touch, mob, target }
}

export function createAttackEvent(mob: Mob, target: Mob): AttackEvent {
  return { eventType: EventType.Attack, mob, target }
}
