import AttributeBuilder from "../../attributes/builder/attributeBuilder"
import AttributesEntity from "../../attributes/entity/attributesEntity"
import KafkaService from "../../kafka/kafkaService"
import {MAX_MOB_LEVEL} from "../../mob/constants"
import {MobEntity} from "../../mob/entity/mobEntity"
import {RaceType} from "../../mob/race/enum/raceType"
import {Specialization} from "../../mob/specialization/specialization"
import {getRandomIntFromRange, percentRoll} from "../../support/random/helpers"
import Gain from "./levelService/gain"

export default class LevelService {
  private static createAttributesFromGain(gain: Gain): AttributesEntity {
    return new AttributeBuilder()
      .setVitals(gain.hp, gain.mana, gain.mv).build()
  }

  private static getGainFromStat(value: number): number {
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

  private static calculateHpGainFromCon(attributes: AttributesEntity, specialization: Specialization): number {
    return ((3 * LevelService.getGainFromStat(attributes.con)) +
      getRandomIntFromRange(...specialization.getHpGainRange())) / 3
  }

  private static calculateHpGainFromStr(attributes: AttributesEntity, specialization: Specialization): number {
    return ((3 * LevelService.getGainFromStat(attributes.str)) +
      getRandomIntFromRange(...specialization.getHpGainRange())) / 4
  }

  constructor(
    private readonly kafkaService: KafkaService,
    private readonly mob: MobEntity) {}

  public calculateHpGain() {
    const attributes = this.mob.attribute().combine()
    const specialization = this.mob.specialization()
    return LevelService.calculateHpGainFromCon(attributes, specialization) +
      LevelService.calculateHpGainFromStr(attributes, specialization) +
      this.mob.race().size - 2
  }

  public calculateManaGain() {
    const attributes = this.mob.attribute().combine()
    const race = this.mob.raceType
    let amount = (attributes.int * 0.2) * (1 + (percentRoll() / 100) + (percentRoll() / 100))
      + (attributes.wis * 0.1) * (1 + percentRoll() / 100)

    if (race === RaceType.Elf || race === RaceType.Halfling) {
      amount *= 1.1
    }

    if (race === RaceType.Faerie) {
      amount *= 1.25
    }

    amount *= this.mob.specialization().getManaGainModifier()

    return amount
  }

  public calculateMvGain() {
    return 3 +
      LevelService.getGainFromStat(this.mob.attribute().getDex()) +
      (this.mob.raceType === RaceType.Giant ? -1 : 0)
  }

  public calculatePracticeGain(): number {
    return this.mob.attribute().getWis() / 5
  }

  public canMobLevel(): boolean {
    return this.mob.isPlayerMob() && this.mob.playerMob.experienceToLevel <= 0
      && this.mob.level < MAX_MOB_LEVEL
  }

  public async gainLevel(): Promise<Gain> {
    const gain = this.createGain()
    this.mob.attributes.push(LevelService.createAttributesFromGain(gain))
    this.mob.playerMob.experienceToLevel =
      this.mob.playerMob.experiencePerLevel + this.mob.playerMob.experienceToLevel
    this.mob.level = gain.newLevel
    this.mob.playerMob.practices += gain.practices
    this.mob.playerMob.trains++
    await this.kafkaService.publishMob(this.mob)

    return gain
  }

  private createGain(): Gain {
    return {
      hp: this.calculateHpGain(),
      mana: this.calculateManaGain(),
      mv: this.calculateMvGain(),
      newLevel: this.mob.level + 1,
      practices: this.calculatePracticeGain(),
    }
  }
}
