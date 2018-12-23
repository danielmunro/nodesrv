import DamageSource from "../../../mob/model/damageSource"
import {DamageSourceFlag} from "../../enum/damageSourceFlag"

export default function(damageSource: DamageSource, trait: DamageSourceFlag) {
  switch (trait) {
    case DamageSourceFlag.Summon:
      damageSource.summon = true
      return
    case DamageSourceFlag.Charm:
      damageSource.charm = true
      return
    case DamageSourceFlag.Magic:
      damageSource.magic = true
      return
    case DamageSourceFlag.Weapon:
      damageSource.weapon = true
      return
    case DamageSourceFlag.Bash:
      damageSource.bash = true
      return
    case DamageSourceFlag.Pierce:
      damageSource.pierce = true
      return
    case DamageSourceFlag.Slash:
      damageSource.slash = true
      return
    case DamageSourceFlag.Fire:
      damageSource.fire = true
      return
    case DamageSourceFlag.Cold:
      damageSource.cold = true
      return
    case DamageSourceFlag.Lightning:
      damageSource.lightning = true
      return
    case DamageSourceFlag.Acid:
      damageSource.acid = true
      return
    case DamageSourceFlag.Poison:
      damageSource.poison = true
      return
    case DamageSourceFlag.Negative:
      damageSource.negative = true
      return
    case DamageSourceFlag.Holy:
      damageSource.holy = true
      return
    case DamageSourceFlag.Energy:
      damageSource.energy = true
      return
    case DamageSourceFlag.Mental:
      damageSource.mental = true
      return
    case DamageSourceFlag.Disease:
      damageSource.disease = true
      return
    case DamageSourceFlag.Drowning:
      damageSource.drowning = true
      return
    case DamageSourceFlag.Light:
      damageSource.light = true
      return
    case DamageSourceFlag.Sound:
      damageSource.sound = true
      return
    case DamageSourceFlag.Wood:
      damageSource.wood = true
      return
    case DamageSourceFlag.Silver:
      damageSource.silver = true
      return
    case DamageSourceFlag.Iron:
      damageSource.iron = true
      return
    case DamageSourceFlag.Distraction:
      damageSource.distraction = true
      return
  }
}
