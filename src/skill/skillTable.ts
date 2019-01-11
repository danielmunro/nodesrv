import {ActionType} from "../action/actionType"
import {AffectType} from "../affect/affectType"
import Check from "../check/check"
import CheckedRequest from "../check/checkedRequest"
import {Messages as CheckMessages} from "../check/constants"
import Cost from "../check/cost/cost"
import {CostType} from "../check/cost/costType"
import GameService from "../gameService/gameService"
import SpecializationLevel from "../mob/specialization/specializationLevel"
import backstab from "./action/backstab"
import bash from "./action/bash"
import berserk from "./action/berserk"
import dirtKick from "./action/dirtKick"
import disarm from "./action/disarm"
import dodge from "./action/dodge"
import enhancedDamage from "./action/enhancedDamage"
import envenom from "./action/envenom"
import fastHealing from "./action/fastHealing"
import secondAttack from "./action/secondAttack"
import sharpen from "./action/sharpen"
import sneak from "./action/sneak"
import steal from "./action/steal"
import trip from "./action/trip"
import {Costs} from "./constants"
import {Messages} from "./precondition/constants"
import defaultSkillPrecondition from "./precondition/defaultSkillPrecondition"
import dirtKickPrecondition from "./precondition/dirtKick"
import disarmPrecondition from "./precondition/disarm"
import envenomPrecondition from "./precondition/envenom"
import sharpenPrecondition from "./precondition/sharpen"
import sneakPrecondition from "./precondition/sneak"
import stealPrecondition from "./precondition/steal"
import tripPrecondition from "./precondition/trip"
import {SkillType} from "./skillType"
import fightSkillPrecondition from "./precondition/fightSkillPrecondition"

function newWeaponSkill(service: GameService, skillType: SkillType) {
  return service.definition().skill(
    skillType,
    (checkedRequest: CheckedRequest) => checkedRequest.respondWith().success(),
    () => Check.ok(),
    SpecializationLevel.create(1, 1, 1, 1),
    ActionType.Neutral)
}

export function getSkillTable(service: GameService) {
  const definition = service.definition()
  return [
    definition.skill(
      SkillType.Dodge,
      dodge,
      fightSkillPrecondition,
      SpecializationLevel.create(22, 20, 1, 13),
      ActionType.Defensive),

    definition.skill(
      SkillType.Disarm,
      disarm,
      disarmPrecondition,
      SpecializationLevel.create(0, 0, 12, 11),
      ActionType.Offensive,
      [
        new Cost(CostType.Mv, Costs.Disarm.Mv, Messages.All.NotEnoughMv),
        new Cost(CostType.Delay, Costs.Disarm.Delay),
      ]),

    definition.skill(
      SkillType.SecondAttack,
      secondAttack,
      fightSkillPrecondition,
      SpecializationLevel.create(24, 30, 12, 5),
      ActionType.Offensive),

    definition.skill(
      SkillType.Bash,
      bash,
      defaultSkillPrecondition,
      SpecializationLevel.create(0, 0, 0, 1),
      ActionType.Offensive,
      [
        new Cost(CostType.Mv, Costs.Bash.Mv, Messages.All.NotEnoughMv),
      ],
      AffectType.Stunned),

    definition.skill(
      SkillType.Trip,
      trip,
      tripPrecondition,
      SpecializationLevel.create(0, 0, 15, 1),
      ActionType.Offensive,
      [
        new Cost(CostType.Mv, Costs.Trip.Mv, Messages.All.NotEnoughMv),
        new Cost(CostType.Delay, Costs.Trip.Delay),
      ],
      AffectType.Stunned),

    definition.skill(
      SkillType.Berserk,
      berserk,
      defaultSkillPrecondition,
      SpecializationLevel.create(0, 0, 15, 1),
      ActionType.Defensive,
      [
        new Cost(CostType.Delay, Costs.Berserk.Delay),
        new Cost(CostType.Mv, mob =>
          Math.max(mob.getCombinedAttributes().vitals.mv / 2, Costs.Berserk.Mv), CheckMessages.TooTired),
      ],
      AffectType.Berserk),

    definition.skill(
      SkillType.Sneak,
      sneak,
      sneakPrecondition,
      SpecializationLevel.create(45, 45, 4, 10),
      ActionType.Defensive,
      [
        new Cost(CostType.Mv, Costs.Sneak.Mv),
        new Cost(CostType.Delay, Costs.Sneak.Delay),
      ],
      AffectType.Sneak),

    definition.skill(
      SkillType.Envenom,
      envenom,
      envenomPrecondition,
      SpecializationLevel.create(0, 0, 10, 0),
      ActionType.Defensive,
      [
        new Cost(CostType.Mana, Costs.Envenom.Mana),
      ],
      AffectType.Poison),

    definition.skill(
      SkillType.Backstab,
      backstab,
      fightSkillPrecondition,
      SpecializationLevel.create(0, 0, 1, 0),
      ActionType.Offensive,
      [
        new Cost(CostType.Mv, Costs.Backstab.Mv, Messages.All.NotEnoughMv),
        new Cost(CostType.Delay, Costs.Backstab.Delay),
      ]),

    definition.skill(
      SkillType.EnhancedDamage,
      enhancedDamage,
      fightSkillPrecondition,
      SpecializationLevel.create(30, 45, 25, 1),
      ActionType.Neutral),

    definition.skill(
      SkillType.DirtKick,
      dirtKick,
      dirtKickPrecondition,
      SpecializationLevel.create(0, 0, 3, 3),
      ActionType.Offensive,
      [
        new Cost(CostType.Mv, Costs.DirtKick.Mv, Messages.All.NotEnoughMv),
      ],
      AffectType.Blind),

    definition.skill(
      SkillType.FastHealing,
      fastHealing,
      defaultSkillPrecondition,
      SpecializationLevel.create(9, 15, 16, 6),
      ActionType.Neutral),

    definition.skill(
      SkillType.Steal,
      steal,
      stealPrecondition,
      SpecializationLevel.create(0, 0, 5, 0),
      ActionType.Offensive,
      [
        new Cost(CostType.Mv, Costs.Steal.Mv),
        new Cost(CostType.Delay, Costs.Steal.Delay),
      ]),

    definition.skill(
      SkillType.Sharpen,
      sharpen,
      sharpenPrecondition,
      SpecializationLevel.create(1, 1, 1, 1),
      ActionType.Neutral,
      [
        new Cost(CostType.Mana, Costs.Sharpen.Mana),
        new Cost(CostType.Mv, Costs.Sharpen.Mv),
        new Cost(CostType.Delay, Costs.Sharpen.Delay),
      ],
      AffectType.Sharpened),

    newWeaponSkill(service, SkillType.Sword),
    newWeaponSkill(service, SkillType.Mace),
    newWeaponSkill(service, SkillType.Wand),
    newWeaponSkill(service, SkillType.Dagger),
    newWeaponSkill(service, SkillType.Stave),
    newWeaponSkill(service, SkillType.Whip),
    newWeaponSkill(service, SkillType.Spear),
    newWeaponSkill(service, SkillType.Axe),
    newWeaponSkill(service, SkillType.Flail),
    newWeaponSkill(service, SkillType.Polearm),
  ]
}
