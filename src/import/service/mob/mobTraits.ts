import {Mob} from "../../../mob/model/mob"
import {MobTrait} from "../../enum/mobTrait"

export default function(mob: Mob, trait: MobTrait) {
  switch (trait) {
    case MobTrait.IsNpc:
      mob.traits.isNpc = true
      return
    case MobTrait.Sentinel:
      mob.traits.wanders = false
      return
    case MobTrait.Scavenger:
      mob.traits.scavenger = true
      return
    case MobTrait.Aggressive:
      mob.traits.aggressive = true
      return
    case MobTrait.StayArea:
      mob.traits.stayArea = true
      return
    case MobTrait.Wimpy:
      mob.traits.wimpy = true
      return
    case MobTrait.Pet:
      mob.traits.isPet = true
      return
    case MobTrait.Trainer:
      mob.traits.trainer = true
      return
    case MobTrait.Practice:
      mob.traits.practice = true
      return
    case MobTrait.Undead:
      mob.traits.undead = true
      return
    case MobTrait.Weaponsmith:
      mob.traits.weaponsmith = true
      return
    case MobTrait.Armorer:
      mob.traits.armorer = true
      return
    case MobTrait.Cleric:
      mob.traits.cleric = true
      return
    case MobTrait.Mage:
      mob.traits.mage = true
      return
    case MobTrait.Ranger:
      mob.traits.ranger = true
      return
    case MobTrait.Warrior:
      mob.traits.warrior = true
      return
    case MobTrait.NoAlign:
      mob.traits.noAlign = true
      return
    case MobTrait.NoPurge:
      mob.traits.noPurge = true
      return
    case MobTrait.Outdoors:
      mob.traits.outdoors = true
      return
    case MobTrait.Indoors:
      mob.traits.indoors = true
      return
    case MobTrait.Mount:
      mob.traits.mount = true
      return
    case MobTrait.Healer:
      mob.traits.healer = true
      return
    case MobTrait.Gain:
      mob.traits.gain = true
      return
    case MobTrait.Changer:
      mob.traits.changer = true
      return
    case MobTrait.NoTrans:
      mob.traits.noTrans = true
      return
    default:
      console.error("unknown trait", trait)
  }
}
