import DamageSourceEntity from "../../../mob/entity/damageSourceEntity"
import Maybe from "../../../support/functional/maybe/maybe"
import {DamageSourceFlag} from "../../enum/damageSourceFlag"

type DamageSourceTransformer = (damageSource: DamageSourceEntity) => void

interface DamageSourceMapper {
  damageSource: DamageSourceFlag,
  transform: DamageSourceTransformer,
}

function createMapper(damageSource: DamageSourceFlag, transform: DamageSourceTransformer): DamageSourceMapper {
  return {
    damageSource,
    transform,
  }
}

const damageSourceTransformerMap: DamageSourceMapper[] = [
  createMapper(DamageSourceFlag.Summon, damageSource => damageSource.summon = true),
  createMapper(DamageSourceFlag.Charm, damageSource => damageSource.charm = true),
  createMapper(DamageSourceFlag.Magic, damageSource => damageSource.magic = true),
  createMapper(DamageSourceFlag.Weapon, damageSource => damageSource.weapon = true),
  createMapper(DamageSourceFlag.Bash, damageSource => damageSource.bash = true),
  createMapper(DamageSourceFlag.Pierce, damageSource => damageSource.pierce = true),
  createMapper(DamageSourceFlag.Slash, damageSource => damageSource.slash = true),
  createMapper(DamageSourceFlag.Fire, damageSource => damageSource.fire = true),
  createMapper(DamageSourceFlag.Charm, damageSource => damageSource.charm = true),
  createMapper(DamageSourceFlag.Cold, damageSource => damageSource.cold = true),
  createMapper(DamageSourceFlag.Lightning, damageSource => damageSource.lightning = true),
  createMapper(DamageSourceFlag.Acid, damageSource => damageSource.acid = true),
  createMapper(DamageSourceFlag.Poison, damageSource => damageSource.poison = true),
  createMapper(DamageSourceFlag.Negative, damageSource => damageSource.negative = true),
  createMapper(DamageSourceFlag.Holy, damageSource => damageSource.holy = true),
  createMapper(DamageSourceFlag.Energy, damageSource => damageSource.energy = true),
  createMapper(DamageSourceFlag.Mental, damageSource => damageSource.mental = true),
  createMapper(DamageSourceFlag.Disease, damageSource => damageSource.disease = true),
  createMapper(DamageSourceFlag.Drowning, damageSource => damageSource.drowning = true),
  createMapper(DamageSourceFlag.Light, damageSource => damageSource.light = true),
  createMapper(DamageSourceFlag.Sound, damageSource => damageSource.sound = true),
  createMapper(DamageSourceFlag.Wood, damageSource => damageSource.wood = true),
  createMapper(DamageSourceFlag.Silver, damageSource => damageSource.silver = true),
  createMapper(DamageSourceFlag.Iron, damageSource => damageSource.iron = true),
  createMapper(DamageSourceFlag.Distraction, damageSource => damageSource.distraction = true),
]

export default function(damageSourceFlag: DamageSourceFlag, damageSourceEntity: DamageSourceEntity) {
  Maybe.if(damageSourceTransformerMap.find(t => t.damageSource === damageSourceFlag),
      map => map.transform(damageSourceEntity))
}
