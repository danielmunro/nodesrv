/* tslint:disable */
import { readFileSync } from "fs"
import { newStartingAttributes, newVitals } from "../attributes/factory"
import { newContainer, newEquipment, newWeapon } from "../item/factory"
import { Item } from "../item/model/item"
import { newMob } from "../mob/factory"
import MobRepository from "../mob/repository/mob"
import roll from "../random/dice"
import { Direction } from "../room/constants"
import { newExit, newRoom } from "../room/factory"
import { Room } from "../room/model/room"
import ExitRepository from "../room/repository/exit"
import RoomRepository from "../room/repository/room"
import File from "./file"
import ItemRepository from "../item/repository/item"
import { newPermanentAffect } from "../affect/factory"
import { AffectType } from "../affect/affectType"
import Reset from "./reset"
import { SectionHeader } from "./sectionHeader"
import { ItemType } from "./itemType"
import { flagMap } from "./affectMap"
import { DirectionFlag } from "./directionFlag"

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

  private static async addPropertiesToItem(item: Item, itemData) {
    item.level = itemData.level
    item.value = itemData.cost
    item.weight = itemData.weight
    item.material = itemData.material
    item.importId = itemData.id
  }

  private static async addReset(file, resetData) {
    if (!resetData.args) {
      // bad reset
      return
    }
    file.resets.push(new Reset(resetData.command, resetData.args[0], resetData.args[2]))
  }

  constructor(
    private readonly mobRepository: MobRepository,
    private readonly roomRepository: RoomRepository,
    private readonly exitRepository: ExitRepository,
    private readonly itemRepository: ItemRepository,
  ) {}

  public async parseAreaFile(filename: string): Promise<File> {
    const content = readFileSync(`fixtures/${filename}`).toString()
    const file = new File(filename, JSON.parse(content))
    await this.iterateSections(file)

    return file
  }

  private async iterateSections(file: File) {
    let header = ""
    const dataLength = file.data.length
    for (let i = 0; i < dataLength; i++) {
      const section = file.data[i]
      const sectionLength = section.length
      if (sectionLength === 1) {
        continue
      }
      for (let j = 0; j < sectionLength; j++) {
        const row = section[j]
        if (row.header) {
          header = row.header
        }
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
            await this.addItem(file, row)
            break
        }
      }
    }
  }

  private async addMob(file, mobData) {
    if (!mobData.hit) {
      return
    }
    const vitals = newVitals(ImportService.dice(mobData.hit), ImportService.dice(mobData.mana), 1000)
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
    await this.mobRepository.save(mob)
    file.mobs.push(mob)
    file.mobMap[mob.importId] = mob
  }

  private async addRoom(file, roomData): Promise<Room> {
    const room = newRoom(roomData.title, roomData.description)
    room.importID = roomData.id
    await this.roomRepository.save(room)
    file.roomDataMap[room.importID] = roomData
    file.roomMap[room.importID] = room
    file.rooms.push(room)

    return room
  }

  private async addItem(file: File, itemData) {
    const args = itemData.pObjFlags.split(" ")
    switch (itemData.type) {
      case ItemType.Weapon:
        const weapon = newWeapon(
          itemData.name,
          itemData.description,
          args[0],
          args[2])
        await ImportService.addPropertiesToItem(weapon, itemData)
        await this.itemRepository.save(weapon)
        file.items.push(weapon)
        break
      case ItemType.Armor:
      case ItemType.Clothing:
        const armor = newEquipment(itemData.name, itemData.description, args[0])
        await ImportService.addPropertiesToItem(armor, itemData)
        await this.itemRepository.save(armor)
        file.items.push(armor)
        break
      case ItemType.Boat:
        break
      case ItemType.Container:
        const container = newContainer(itemData.name, itemData.description)
        const itemProps = itemData.pObjFlags.split(" ")
        container.container.weightCapacity = itemProps[0]
        container.container.liquid = itemProps[2]
        container.container.maxWeightForItem = itemProps[3]
        const flags = itemProps[1].split("")
        this.setItemAffects(container, flags)
        await ImportService.addPropertiesToItem(container, itemData)
        await this.itemRepository.save(container)
        file.items.push(container)
        break
      case ItemType.Drink:
        break
      case ItemType.Food:
        break
      default:
        return
    }
  }

  private setItemAffects(item: Item, flags: string[]) {
    flags.forEach(flag => {
      if (flagMap[flag]) {
        item.affects.push(newPermanentAffect(flagMap[flag]))
      }
    })
  }

  public async createExits(file: File) {
    const ids = Object.keys(file.roomMap)
    const idLength = ids.length
    for (let i = 0; i < idLength; i++) {
      const importId = ids[i]
      const room = file.roomDataMap[importId]
      if (room === undefined || room.doors === undefined) {
        continue
      }
      const doorLength = room.doors.length
      for (let j = 0; j < doorLength; j++) {
        const door = room.doors[j]
        await this.createExitFromDoor(file, door, importId)
      }
    }
  }

  private async createExitFromDoor(file: File, door, importId) {
    let direction: Direction
    switch (door.door) {
      case DirectionFlag.North:
        direction = Direction.North
        break
      case DirectionFlag.East:
        direction = Direction.East
        break
      case DirectionFlag.South:
        direction = Direction.South
        break
      case DirectionFlag.West:
        direction = Direction.West
        break
      case DirectionFlag.Up:
        direction = Direction.Up
        break
      case DirectionFlag.Down:
        direction = Direction.Down
        break
    }
    if (file.roomMap[importId] && file.roomMap[door.vnum]) {
      await this.exitRepository.save(newExit(direction, file.roomMap[importId], file.roomMap[door.vnum]))
    }
  }
}
