import Spell from "../../../../action/impl/spell"
import {EventType} from "../../../../event/enum/eventType"
import {createModifiedCastEvent} from "../../../../event/factory/eventFactory"
import EventConsumer from "../../../../event/interface/eventConsumer"
import EventResponse from "../../../../event/messageExchange/eventResponse"
import CastEvent from "../../../event/castEvent"
import {SpecializationType} from "../../../specialization/enum/specializationType"
import {RaceType} from "../../enum/raceType"

export default class DrowMageBonus implements EventConsumer {
  public static bonusModifier = 3

  constructor(private readonly spellTable: Spell[]) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.Cast ]
  }

  public consume(castEvent: CastEvent): Promise<EventResponse> {
    const spell = this.spellTable.find(sp =>
      sp.getSpellType() === castEvent.spell.spellType) as Spell
    if (castEvent.mob.raceType === RaceType.Drow &&
      castEvent.mob.specializationType === SpecializationType.Mage &&
      spell.getSpecializationType() === SpecializationType.Mage) {
      return EventResponse.modified(
        createModifiedCastEvent(castEvent, castEvent.roll + DrowMageBonus.bonusModifier))
    }

    return EventResponse.none(castEvent)
  }
}
