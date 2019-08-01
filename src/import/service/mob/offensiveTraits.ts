import {MobEntity} from "../../../mob/entity/mobEntity"
import Maybe from "../../../support/functional/maybe/maybe"
import {MobOffensiveTrait} from "../../enum/mobOffensiveTrait"

type OffensiveTraitTransformer = (mobEntity: MobEntity) => void

interface OffensiveTraitMapper {
  offensiveTrait: MobOffensiveTrait,
  transform: OffensiveTraitTransformer,
}

function createMapper(offensiveTrait: MobOffensiveTrait, transform: OffensiveTraitTransformer): OffensiveTraitMapper {
  return {
    offensiveTrait,
    transform,
  }
}

const offensiveTraitTransformerMap: OffensiveTraitMapper[] = [
  createMapper(MobOffensiveTrait.AreaAttack, mob => mob.offensiveTraits.areaAttack = true),
  createMapper(MobOffensiveTrait.Backstab, mob => mob.offensiveTraits.backstab = true),
  createMapper(MobOffensiveTrait.Bash, mob => mob.offensiveTraits.bash = true),
  createMapper(MobOffensiveTrait.Berserk, mob => mob.offensiveTraits.berserk = true),
  createMapper(MobOffensiveTrait.Disarm, mob => mob.offensiveTraits.disarm = true),
  createMapper(MobOffensiveTrait.Dodge, mob => mob.offensiveTraits.dodge = true),
  createMapper(MobOffensiveTrait.Fade, mob => mob.offensiveTraits.fade = true),
  createMapper(MobOffensiveTrait.Fast, mob => mob.offensiveTraits.fast = true),
  createMapper(MobOffensiveTrait.Kick, mob => mob.offensiveTraits.kick = true),
  createMapper(MobOffensiveTrait.KickDirt, mob => mob.offensiveTraits.kickDirt = true),
  createMapper(MobOffensiveTrait.Parry, mob => mob.offensiveTraits.parry = true),
  createMapper(MobOffensiveTrait.Rescue, mob => mob.offensiveTraits.rescue = true),
  createMapper(MobOffensiveTrait.Tail, mob => mob.offensiveTraits.tail = true),
  createMapper(MobOffensiveTrait.Trip, mob => mob.offensiveTraits.trip = true),
  createMapper(MobOffensiveTrait.Crush, mob => mob.offensiveTraits.crush = true),
  createMapper(MobOffensiveTrait.AssistAll, mob => mob.offensiveTraits.assistAll = true),
  createMapper(MobOffensiveTrait.AssistRace, mob => mob.offensiveTraits.assistRace = true),
  createMapper(MobOffensiveTrait.AssistPlayers, mob => mob.offensiveTraits.assistPlayers = true),
  createMapper(MobOffensiveTrait.AssistGuard, mob => mob.offensiveTraits.assistGuard = true),
  createMapper(MobOffensiveTrait.AssistVnum, mob => mob.offensiveTraits.assistVnum = true),
  createMapper(MobOffensiveTrait.OffCharge, mob => mob.offensiveTraits.offCharge = true),
  createMapper(MobOffensiveTrait.AssistElement, mob => mob.offensiveTraits.assistElement = true),
]

export default function(offensiveTrait: MobOffensiveTrait, mob: MobEntity) {
  Maybe.if(offensiveTraitTransformerMap.find(t => t.offensiveTrait === offensiveTrait),
    map => map.transform(mob))
}
