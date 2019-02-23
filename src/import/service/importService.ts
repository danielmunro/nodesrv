import { readFileSync } from "fs"
import { newStartingAttributes, newVitals } from "../../attributes/factory"
import ItemRepository from "../../item/repository/item"
import { newMob } from "../../mob/factory"
import {Mob} from "../../mob/model/mob"
import Shop from "../../mob/model/shop"
import MobRepository from "../../mob/repository/mob"
import roll from "../../random/dice"
import { newRoom } from "../../room/factory"
import { Room } from "../../room/model/room"
import RoomRepository from "../../room/repository/room"
import {DamageSourceFlag} from "../enum/damageSourceFlag"
import {MobOffensiveTrait} from "../enum/mobOffensiveTrait"
import {MobTrait} from "../enum/mobTrait"
import { ResetFlag } from "../enum/resetFlag"
import { SectionHeader } from "../enum/sectionHeader"
import File from "../file"
import ItemBuilder from "../itemBuilder"
import Reset from "../reset"
import damageTraits from "./mob/damageTraits"
import mobTraits from "./mob/mobTraits"
import offensiveTraits from "./mob/offensiveTraits"

const NPC_MOVEMENT = 1000

export default class ImportService {
  private static dice(rollData) {
    const parts = rollData.split("d")
    const count = parts[0]
    const secondPart = parts[1].split("+")
    const sides = secondPart[0]
    const bonus = secondPart[1]

    return roll(count, sides) + bonus
  }

  private static getAmount(amount) {
    if (amount <= 0 || amount === null) {
      return 999
    }

    return amount
  }

  private static addMobTraits(mob: Mob, traits: MobTrait[]) {
    traits.forEach(trait => mobTraits(mob, trait))
  }

  private static addMobOffensiveTraits(mob: Mob, traits: MobOffensiveTrait[]) {
    traits.forEach(trait => offensiveTraits(mob, trait))
  }

  private static addMobVulnerableTraits(mob: Mob, traits: DamageSourceFlag[]) {
    traits.forEach(trait => damageTraits(mob.vulnerable, trait))
  }

  private static addMobResistTraits(mob: Mob, traits: DamageSourceFlag[]) {
    traits.forEach(trait => damageTraits(mob.resist, trait))
  }

  private static addMobImmuneTraits(mob: Mob, traits: DamageSourceFlag[]) {
    traits.forEach(trait => damageTraits(mob.immune, trait))
  }

  private static async addShop(file: File, resetData) {
    const mob = file.mobs.find(m => m.canonicalId === resetData.keeper)
    const shop = new Shop()
    shop.buyModifier = resetData.profitBuy
    shop.sellModifier = resetData.profitSell
    shop.openHour = resetData.openHour
    shop.closeHour = resetData.closeHour
    mob.shop = shop
    file.shops.push(shop)
  }

  private static async addMob(file, mobData) {
    const vitals = newVitals(ImportService.dice(mobData.hit), ImportService.dice(mobData.mana), NPC_MOVEMENT)
    const mob = newMob(
      mobData.name,
      mobData.description,
      mobData.race,
      vitals,
      newStartingAttributes(vitals, mobData.level))
    mob.brief = mobData.brief
    mob.gold = mobData.wealth
    mob.canonicalId = mobData.id
    mob.importId = mobData.id
    mob.alignment = mobData.alignment
    mob.level = mobData.level
    ImportService.addMobTraits(mob, Array.isArray(mobData.affects) ? mobData.affects : [mobData.affects])
    ImportService.addMobOffensiveTraits(mob, Array.isArray(mobData.off) ? mobData.off : [mobData.off])
    ImportService.addMobVulnerableTraits(
      mob, Array.isArray(mobData.vulnerable) ? mobData.vulnerable : [mobData.vulnerable])
    ImportService.addMobResistTraits(
      mob, Array.isArray(mobData.resist) ? mobData.resist : [mobData.resist])
    ImportService.addMobImmuneTraits(
      mob, Array.isArray(mobData.imm) ? mobData.imm : [mobData.imm])
    file.mobs.push(mob)
    file.mobMap[mob.importId] = mob
  }

  private lastReset: Reset

  constructor(
    private readonly mobRepository: MobRepository,
    private readonly roomRepository: RoomRepository,
    private readonly itemRepository: ItemRepository,
    private readonly itemBuilder: ItemBuilder,
    private readonly writeNewData: boolean = true,
  ) {}

  public async parseAreaFile(filename: string): Promise<File> {
    const content = readFileSync(`fixtures/${filename}`).toString()
    const file = new File(filename, JSON.parse(content))
    await this.iterateSections(file)

    return file
  }

  private async iterateSections(file: File) {
    let header = ""
    for (const section of file.data) {
      if (section.length === 1 && Array.isArray(section[0])) {
        continue
      }
      for (const row of section.values) {
        if (row.header) {
          header = row.header
        }
        if (Object.keys(row).length === 1) {
          continue
        }
        await this.addRow(header, file, row)
      }
    }
    if (this.writeNewData) {
      await this.mobRepository.save(file.mobs)
      await this.itemRepository.save(file.items)
    }
  }

  private async addRow(header, file: File, row) {
    switch (header) {
      case SectionHeader.Mobiles:
        await ImportService.addMob(file, row)
        break
      case SectionHeader.Rooms:
        await this.addRoom(file, row)
        break
      case SectionHeader.Resets:
        await this.addReset(file, row)
        break
      case SectionHeader.Objects:
        await this.addItem(file, row)
        break
      case SectionHeader.Shops:
        await ImportService.addShop(file, row)
        break
    }
  }

  private async addReset(file, resetData) {
    const resetSubject = resetData.args[0]
    const reset = new Reset(
      resetData.command,
      resetSubject,
      this.getResetDestination(resetData),
      ImportService.getAmount(resetData.args[1]),
      ImportService.getAmount(3 in resetData.args ? resetData.args[3] : null))
    if (resetData.command === ResetFlag.Mob) {
      this.lastReset = reset
    }
    file.resets.push(reset)
  }

  private getResetDestination(resetData) {
    if (resetData.command === ResetFlag.GiveItemToMob) {
      return this.lastReset.idOfResetSubject
    }
    if (resetData.command === ResetFlag.EquipItemToMob) {
      return this.lastReset.idOfResetSubject
    }
    return resetData.args[2]
  }

  private async addItem(file, itemData) {
    const item = await this.itemBuilder.createItemFromImportData(itemData)
    if (!item) {
      console.log(`skipping ${itemData.type}: ${itemData.id}`)
      return
    }
    file.items.push(item)
  }

  private async addRoom(file, roomData): Promise<Room> {
    const room = newRoom(roomData.title, roomData.description)
    room.canonicalId = roomData.id
    if (this.writeNewData) {
      await this.roomRepository.save(room)
    }
    file.roomDataMap[room.canonicalId] = roomData
    file.roomMap[room.canonicalId] = room
    file.rooms.push(room)

    return room
  }
}
