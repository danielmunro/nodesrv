import Attributes from "../attributes/model/attributes"
import Gain from "../mob/gain"
import {Mob} from "../mob/model/mob"
import {getSizeFromRace, Race} from "../mob/race/race"
import {Specialization} from "../mob/specialization/specialization"
import {getRandomIntFromRange, percentRoll} from "../random/helpers"

export default class LevelService {
  private static getHpGainFromStat(value: number): number {
    switch (value) {
      case 15:
        return 1
      case 16:
        return 2
      case 18:
        return 3
      case 20:
        return 4
      case 22:
        return 5
      case 23:
        return 6
      case 24:
        return 7
      case 25:
        return 8
      default:
        return 0
    }
  }

  private static getMvGainFromStat(value: number): number {
    switch (value) {
      case 18:
        return 1
      case 20:
        return 2
      case 22:
        return 3
      case 24:
        return 4
      case 25:
        return 5
      default:
        return 0
    }
  }

  private static calculateHpGainFromCon(attributes: Attributes, specialization: Specialization): number {
    return ((3 * LevelService.getHpGainFromStat(attributes.stats.con)) +
      getRandomIntFromRange(...specialization.getHpGainRange())) / 3
  }

  private static calculateHpGainFromStr(attributes: Attributes, specialization: Specialization): number {
    return ((3 * LevelService.getHpGainFromStat(attributes.stats.str)) +
      getRandomIntFromRange(...specialization.getHpGainRange())) / 4
  }

  constructor(private readonly mob: Mob) {}

  public calculateHpGain() {
    const attributes = this.mob.getCombinedAttributes()
    const specialization = this.mob.specialization()
    return LevelService.calculateHpGainFromCon(attributes, specialization) +
      LevelService.calculateHpGainFromStr(attributes, specialization) +
      getSizeFromRace(this.mob.race) - 2
  }

  public calculateManaGain() {
    const attributes = this.mob.getCombinedAttributes()
    const race = this.mob.race
    let amount = (attributes.stats.int * 0.2) * (1 + (percentRoll() / 100) + (percentRoll() / 100))
      + (attributes.stats.wis * 0.1) * (1 + percentRoll() / 100)

    if (race === Race.Elf || race === Race.HalfElf) {
      amount *= 1.1
    }

    if (race === Race.Faerie) {
      amount *= 1.25
    }

    amount *= this.mob.specialization().getManaGainModifier()

    return amount
  }

  public calculateMvGain() {
    return 3 + LevelService.getMvGainFromStat(this.mob.getCombinedAttributes().stats.dex)
  }

  public calculatePracticeGain(): number {
    return this.mob.getCombinedAttributes().stats.wis / 5
  }

  public canMobLevel(): boolean {
    return this.mob.playerMob && this.mob.playerMob.experienceToLevel <= 0
  }

  public gainLevel(): Gain {
    const gain = new Gain(
      this.mob.level + 1,
      this.calculateHpGain(),
      this.calculateManaGain(),
      this.calculateMvGain(),
      this.calculatePracticeGain())
    this.mob.attributes.push(gain.createAttributes())
    this.mob.playerMob.experienceToLevel =
      this.mob.playerMob.experiencePerLevel + this.mob.playerMob.experienceToLevel
    this.mob.level = gain.newLevel
    this.mob.playerMob.practices += gain.practices
    this.mob.playerMob.trains++

    return gain
  }
}
