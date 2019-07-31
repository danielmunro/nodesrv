import {MobEntity} from "../../../mob/entity/mobEntity"
import Maybe from "../../../support/functional/maybe/maybe"
import {MobTrait} from "../../enum/mobTrait"

type MobTraitTransformer = (mob: MobEntity) => void

interface MobTraitMapper {
  mobTrait: MobTrait,
  transform: MobTraitTransformer
}

function createTransformer(mobTrait: MobTrait, transform: MobTraitTransformer): MobTraitMapper {
  return { mobTrait, transform }
}

const mobTraitTransformerMap: MobTraitMapper[] = [
  createTransformer(MobTrait.IsNpc, mob => mob.traits.isNpc = true),
  createTransformer(MobTrait.Sentinel, mob => mob.traits.wanders = true),
  createTransformer(MobTrait.Scavenger, mob => mob.traits.scavenger = true),
  createTransformer(MobTrait.Aggressive, mob => mob.traits.aggressive = true),
  createTransformer(MobTrait.StayArea, mob => mob.traits.stayArea = true),
  createTransformer(MobTrait.Wimpy, mob => mob.traits.wimpy = true),
  createTransformer(MobTrait.Pet, mob => mob.traits.isPet = true),
  createTransformer(MobTrait.Trainer, mob => mob.traits.trainer = true),
  createTransformer(MobTrait.Practice, mob => mob.traits.practice = true),
  createTransformer(MobTrait.Undead, mob => mob.traits.undead = true),
  createTransformer(MobTrait.Weaponsmith, mob => mob.traits.weaponsmith = true),
  createTransformer(MobTrait.Armorer, mob => mob.traits.armorer = true),
  createTransformer(MobTrait.Cleric, mob => mob.traits.cleric = true),
  createTransformer(MobTrait.Mage, mob => mob.traits.mage = true),
  createTransformer(MobTrait.Ranger, mob => mob.traits.ranger = true),
  createTransformer(MobTrait.Warrior, mob => mob.traits.warrior = true),
  createTransformer(MobTrait.NoAlign, mob => mob.traits.noAlign = true),
  createTransformer(MobTrait.NoPurge, mob => mob.traits.noPurge = true),
  createTransformer(MobTrait.Outdoors, mob => mob.traits.outdoors = true),
  createTransformer(MobTrait.Indoors, mob => mob.traits.indoors = true),
  createTransformer(MobTrait.Mount, mob => mob.traits.mount = true),
  createTransformer(MobTrait.Healer, mob => mob.traits.healer = true),
  createTransformer(MobTrait.Gain, mob => mob.traits.gain = true),
  createTransformer(MobTrait.Changer, mob => mob.traits.changer = true),
  createTransformer(MobTrait.NoTrans, mob => mob.traits.noTrans = true),
]

export default function(mob: MobEntity, trait: MobTrait) {
  Maybe.if(
    mobTraitTransformerMap.find(t => t.mobTrait === trait),
    transformer => transformer.transform(mob))
}
