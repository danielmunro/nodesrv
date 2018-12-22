import { readFileSync } from "fs"
import { newStartingAttributes, newVitals } from "../../attributes/factory"
import ItemBuilder from "../../item/itemBuilder"
import ItemRepository from "../../item/repository/item"
import { newMob } from "../../mob/factory"
import Shop from "../../mob/model/shop"
import MobRepository from "../../mob/repository/mob"
import roll from "../../random/dice"
import { newRoom } from "../../room/factory"
import { Room } from "../../room/model/room"
import RoomRepository from "../../room/repository/room"
import {MobTrait} from "../enum/mobTrait"
import { ResetFlag } from "../enum/resetFlag"
import { SectionHeader } from "../enum/sectionHeader"
import File from "../file"
import Reset from "../reset"

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

  private static addMobTraits(mob, traits: string[]) {
    for (const trait of traits) {
      switch (trait) {
        case MobTrait.IsNpc:
          mob.traits.isNpc = true
          break
        case MobTrait.Sentinel:
          mob.traits.wanders = false
          break
        case MobTrait.Scavenger:
          mob.traits.scavenger = true
          break
        case MobTrait.Aggressive:
          mob.traits.aggressive = true
          break
        case MobTrait.StayArea:
          mob.traits.stayArea = true
          break
        case MobTrait.Wimpy:
          mob.traits.wimpy = true
          break
        case MobTrait.Pet:
          mob.traits.isPet = true
          break
        case MobTrait.Trainer:
          mob.traits.trainer = true
          break
        case MobTrait.Practice:
          mob.traits.practice = true
          break
        case MobTrait.Undead:
          mob.traits.undead = true
          break
        case MobTrait.Weaponsmith:
          mob.traits.weaponsmith = true
          break
        case MobTrait.Armorer:
          mob.traits.armorer = true
          break
        case MobTrait.Cleric:
          mob.traits.cleric = true
          break
        case MobTrait.Mage:
          mob.traits.mage = true
          break
        case MobTrait.Ranger:
          mob.traits.ranger = true
          break
        case MobTrait.Warrior:
          mob.traits.warrior = true
          break
        case MobTrait.NoAlign:
          mob.traits.noAlign = true
          break
        case MobTrait.NoPurge:
          mob.traits.noPurge = true
          break
        case MobTrait.Outdoors:
          mob.traits.outdoors = true
          break
        case MobTrait.Indoors:
          mob.traits.indoors = true
          break
        case MobTrait.Mount:
          mob.traits.mount = true
          break
        case MobTrait.Healer:
          mob.traits.healer = true
          break
        case MobTrait.Gain:
          mob.traits.gain = true
          break
        case MobTrait.Changer:
          mob.traits.changer = true
          break
        case MobTrait.NoTrans:
          mob.traits.noTrans = true
          break
        default:
          console.error("unknown trait", trait)
      }
    }
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
    mob.gold = mobData.wealth
    mob.canonicalId = mobData.id
    mob.importId = mobData.id
    mob.alignment = mobData.alignment
    mob.level = mobData.level
    ImportService.addMobTraits(mob, Array.isArray(mobData.affects) ? mobData.affects : [mobData.affects])
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
