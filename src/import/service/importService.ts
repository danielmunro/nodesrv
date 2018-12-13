import { readFileSync } from "fs"
import { newStartingAttributes, newVitals } from "../../attributes/factory"
import ItemBuilder from "../../item/itemBuilder"
import ItemRepository from "../../item/repository/item"
import { newMob } from "../../mob/factory"
import MobRepository from "../../mob/repository/mob"
import roll from "../../random/dice"
import { newRoom } from "../../room/factory"
import { Room } from "../../room/model/room"
import RoomRepository from "../../room/repository/room"
import { ResetFlag } from "../enum/resetFlag"
import { SectionHeader } from "../enum/sectionHeader"
import File from "../file"
import Reset from "../reset"

const NPC_MOVEMENT = 1000

export default class ImportService {
  private static dice(rollData) {
    if (rollData === undefined) {
      return 1
    }
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

  private itemTypes = []
  private lastReset: Reset

  constructor(
    private readonly mobRepository: MobRepository,
    private readonly roomRepository: RoomRepository,
    private readonly itemRepository: ItemRepository,
    private readonly writeNewData: boolean = true,
  ) {}

  public async parseAreaFile(filename: string): Promise<File> {
    const content = readFileSync(`fixtures/${filename}`).toString()
    const file = new File(filename, JSON.parse(content))
    await this.iterateSections(file)

    return file
  }

  public getItemTypes() {
    return this.itemTypes
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
  }

  private async addRow(header, file: File, row) {
    switch (header) {
      case SectionHeader.Mobiles:
        await this.addMob(file, row)
        break
      case SectionHeader.Rooms:
        await this.addRoom(file, row)
        break
      case SectionHeader.Resets:
        await this.addReset(file, row)
        break
      case SectionHeader.Objects:
        this.itemTypes.push(row.type)
        await this.addItem(file, row)
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
    const item = await ItemBuilder.createItemFromImportData(itemData)
    if (!item) {
      console.log(`skipping ${itemData.type}: ${itemData.id}`)
      return
    }
    file.items.push(item)
    if (this.writeNewData) {
      this.itemRepository.save(item)
    }
  }

  private async addMob(file, mobData) {
    const vitals = newVitals(ImportService.dice(mobData.hit), ImportService.dice(mobData.mana), NPC_MOVEMENT)
    const mob = newMob(
      mobData.name,
      mobData.description,
      mobData.race,
      vitals,
      newStartingAttributes(vitals, mobData.level))
    mob.gold = mobData.wealth
    mob.importId = mobData.id
    mob.alignment = mobData.alignment
    mob.level = mobData.level
    if (this.writeNewData) {
      await this.mobRepository.save(mob)
    }
    file.mobs.push(mob)
    file.mobMap[mob.importId] = mob
  }

  private async addRoom(file, roomData): Promise<Room> {
    const room = newRoom(roomData.title, roomData.description)
    room.importID = roomData.id
    if (this.writeNewData) {
      await this.roomRepository.save(room)
    }
    file.roomDataMap[room.importID] = roomData
    file.roomMap[room.importID] = room
    file.rooms.push(room)

    return room
  }
}
