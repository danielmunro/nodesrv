import AttributeBuilder from "../../../../../attributes/attributeBuilder"
import {newHitroll, newVitals} from "../../../../../attributes/factory"
import CheckBuilderFactory from "../../../../../check/checkBuilderFactory"
import CheckedRequest from "../../../../../check/checkedRequest"
import Cost from "../../../../../check/cost/cost"
import DelayCost from "../../../../../check/cost/delayCost"
import ManaCost from "../../../../../check/cost/manaCost"
import EventService from "../../../../../event/eventService"
import MobService from "../../../../../mob/mobService"
import {Mob} from "../../../../../mob/model/mob"
import {Race} from "../../../../../mob/race/race"
import {getRandomIntFromRange} from "../../../../../random/helpers"
import ResponseMessage from "../../../../../request/responseMessage"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {Messages} from "../../../../constants"
import {ActionType} from "../../../../enum/actionType"
import Spell from "../../../../spell"

export const SKELETAL_WARRIOR_ID = 3
const DEFAULT_MANA = 100
const DEFAULT_MV = 100

export default class SummonUndeadAction extends Spell {
  private static createSkeletalWarrior(caster: Mob, warrior: Mob): Mob {
    const level = caster.level * 0.8
    const maxHp = level * 8 + getRandomIntFromRange(level * level / 8, level * level)
    warrior.level = level
    warrior.vitals.hp = maxHp
    warrior.vitals.mana = DEFAULT_MANA
    warrior.vitals.mv = DEFAULT_MV
    warrior.attributes.push(
      new AttributeBuilder()
        .setHitRoll(newHitroll(1, level / 2))
        .setVitals(newVitals(maxHp, DEFAULT_MANA, DEFAULT_MV))
        .build())
    warrior.deathTimer = (level / 5) + 10
    warrior.follows = caster
    warrior.race = Race.Undead
    return warrior
  }

  constructor(
    checkBuilderFactory: CheckBuilderFactory,
    eventService: EventService,
    private readonly mobService: MobService) {
    super(checkBuilderFactory, eventService)
  }

  public async applySpell(checkedRequest: CheckedRequest): Promise<void> {
    this.mobService.add(
      SummonUndeadAction.createSkeletalWarrior(
        checkedRequest.mob,
        await this.mobService.createMobFromId(SKELETAL_WARRIOR_ID)),
      checkedRequest.room)
  }

  public getSpellType(): SpellType {
    return SpellType.SummonUndead
  }

  public getActionType(): ActionType {
    return ActionType.Defensive
  }

  public getCosts(): Cost[] {
    return [
      new ManaCost(50),
      new DelayCost(1),
    ]
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    return new ResponseMessage(
      checkedRequest.mob,
      SpellMessages.SummonUndead.Success)
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
