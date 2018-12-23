import {Mob} from "../../../mob/model/mob"
import {MobOffensiveTrait} from "../../enum/mobOffensiveTrait"

export default function(mob: Mob, trait: MobOffensiveTrait) {
  switch (trait) {
    case MobOffensiveTrait.AreaAttack:
      mob.offensiveTraits.areaAttack = true
      return
    case MobOffensiveTrait.Backstab:
      mob.offensiveTraits.backstab = true
      return
    case MobOffensiveTrait.Bash:
      mob.offensiveTraits.bash = true
      return
    case MobOffensiveTrait.Berserk:
      mob.offensiveTraits.berserk = true
      return
    case MobOffensiveTrait.Disarm:
      mob.offensiveTraits.disarm = true
      return
    case MobOffensiveTrait.Dodge:
      mob.offensiveTraits.dodge = true
      return
    case MobOffensiveTrait.Fade:
      mob.offensiveTraits.fade = true
      return
    case MobOffensiveTrait.Fast:
      mob.offensiveTraits.fast = true
      return
    case MobOffensiveTrait.Kick:
      mob.offensiveTraits.kick = true
      return
    case MobOffensiveTrait.KickDirt:
      mob.offensiveTraits.kickDirt = true
      return
    case MobOffensiveTrait.Parry:
      mob.offensiveTraits.parry = true
      return
    case MobOffensiveTrait.Rescue:
      mob.offensiveTraits.rescue = true
      return
    case MobOffensiveTrait.Tail:
      mob.offensiveTraits.tail = true
      return
    case MobOffensiveTrait.Trip:
      mob.offensiveTraits.trip = true
      return
    case MobOffensiveTrait.Crush:
      mob.offensiveTraits.crush = true
      return
    case MobOffensiveTrait.AssistAll:
      mob.offensiveTraits.assistAll = true
      return
    case MobOffensiveTrait.AssistAlign:
      mob.offensiveTraits.assistAlign = true
      return
    case MobOffensiveTrait.AssistRace:
      mob.offensiveTraits.assistRace = true
      return
    case MobOffensiveTrait.AssistPlayers:
      mob.offensiveTraits.assistPlayers = true
      return
    case MobOffensiveTrait.AssistGuard:
      mob.offensiveTraits.assistGuard = true
      return
    case MobOffensiveTrait.AssistVnum:
      mob.offensiveTraits.assistVnum = true
      return
    case MobOffensiveTrait.OffCharge:
      mob.offensiveTraits.offCharge = true
      return
    case MobOffensiveTrait.AssistElement:
      mob.offensiveTraits.assistElement = true
      return
    default:
      console.error("unknown mob offensive trait", trait)
  }
}
