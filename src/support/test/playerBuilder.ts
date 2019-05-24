import {Item} from "../../item/model/item"
import {Standing} from "../../mob/enum/standing"
import {Mob} from "../../mob/model/mob"
import {SpecializationType} from "../../mob/specialization/enum/specializationType"
import {AuthorizationLevel} from "../../player/enum/authorizationLevel"
import {Player} from "../../player/model/player"
import {newSkill} from "../../skill/factory"
import {SkillType} from "../../skill/skillType"
import {newSpell} from "../../spell/factory"
import {SpellType} from "../../spell/spellType"

export default class PlayerBuilder {
  constructor(public readonly player: Player) {}

  public setSpecializationType(specializationType: SpecializationType): PlayerBuilder {
    this.player.sessionMob.specializationType = specializationType
    return this
  }

  public setTrains(amount: number): PlayerBuilder {
    this.player.sessionMob.playerMob.trains = amount
    return this
  }

  public setPractices(amount: number): PlayerBuilder {
    this.player.sessionMob.playerMob.practices = amount
    return this
  }

  public equip(item: Item): PlayerBuilder {
    this.player.sessionMob.equipped.addItem(item)
    return this
  }

  public addItem(item: Item): PlayerBuilder {
    this.player.sessionMob.inventory.addItem(item)
    return this
  }

  public getItems(): Item[] {
    return this.player.sessionMob.inventory.items
  }

  public addSkill(skillType: SkillType, level: number = 1): PlayerBuilder {
    this.player.sessionMob.skills.push(newSkill(skillType, level))
    return this
  }

  public addSpell(spellType: SpellType, level: number = 1): PlayerBuilder {
    this.player.sessionMob.spells.push(newSpell(spellType, level))
    return this
  }

  public setHunger(hunger: number) {
    this.player.sessionMob.playerMob.hunger = hunger
  }

  public setStanding(standing: Standing): PlayerBuilder {
    this.player.sessionMob.playerMob.standing = standing
    return this
  }

  public setAuthorizationLevel(authorizationLevel: AuthorizationLevel): PlayerBuilder {
    this.player.sessionMob.playerMob.authorizationLevel = authorizationLevel
    return this
  }

  public setLevel(level: number): PlayerBuilder {
    this.player.sessionMob.level = level
    return this
  }

  public setGold(amount: number): PlayerBuilder {
    this.player.sessionMob.gold = amount
    return this
  }

  public setBounty(amount: number): PlayerBuilder {
    this.player.sessionMob.playerMob.bounty = amount
    return this
  }

  public setHp(amount: number): PlayerBuilder {
    this.player.sessionMob.vitals.hp = amount
    return this
  }

  public setMv(amount: number): PlayerBuilder {
    this.player.sessionMob.vitals.mv = amount
    return this
  }

  public setExperienceToLevel(amount: number): PlayerBuilder {
    this.player.sessionMob.playerMob.experienceToLevel = amount
    return this
  }

  public getExperienceToLevel(): number {
    return this.player.sessionMob.playerMob.experienceToLevel
  }

  public getMob(): Mob {
    return this.player.sessionMob
  }

  public getMobLevel(): number {
    return this.player.sessionMob.level
  }

  public getMobName(): string {
    return this.player.sessionMob.name
  }

  public get(): Player {
    return this.player
  }
}
