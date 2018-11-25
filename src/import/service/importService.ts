import { readFileSync } from "fs"
import { newStartingAttributes, newVitals } from "../../attributes/factory"
import { newContainer, newEquipment, newItemFixture, newWeapon } from "../../item/factory"
import { Item } from "../../item/model/item"
import { newMob } from "../../mob/factory"
import MobRepository from "../../mob/repository/mob"
import roll from "../../random/dice"
import { Direction } from "../../room/constants"
import { newExit, newRoom } from "../../room/factory"
import { Room } from "../../room/model/room"
import ExitRepository from "../../room/repository/exit"
import RoomRepository from "../../room/repository/room"
import File from "../file"
import ItemRepository from "../../item/repository/item"
import { newPermanentAffect } from "../../affect/factory"
import Reset from "../reset"
import { SectionHeader } from "../enum/sectionHeader"
import { ItemType } from "../enum/itemType"
import { flagMap } from "../affectMap"
import { DirectionFlag } from "../enum/directionFlag"
import ItemBuilder from "../../item/itemBuilder"

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

  private static async addReset(file, resetData) {
    if (!resetData.args) {
      return
    }
    file.resets.push(new Reset(resetData.command, resetData.args[0], resetData.args[2]))
  }

  private itemTypes = []
  private itemBuilder = new ItemBuilder()

  constructor(
    private readonly mobRepository: MobRepository,
    private readonly roomRepository: RoomRepository,
    private readonly exitRepository: ExitRepository,
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
      if (section.length === 1) {
        continue
      }
      for (const row of section) {
        if (row.header) {
          header = row.header
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
        await ImportService.addReset(file, row)
        break
      case SectionHeader.Objects:
        this.itemTypes.push(row.type)
        await this.addItem(file, row)
        break
    }
  }

  private async addItem(file, itemData) {
    const item = await this.itemBuilder.createItemFromImportData(itemData)
    if (!item) {
      return
    }
    file.items.push(item)
    if (this.writeNewData) {
      this.itemRepository.save(item)
    }
  }

  private async addMob(file, mobData) {
    if (!mobData.hit) {
      return
    }
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
