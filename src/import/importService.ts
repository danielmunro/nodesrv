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
  }

  constructor(
    private readonly mobRepository: MobRepository,
    private readonly roomRepository: RoomRepository,
    private readonly exitRepository: ExitRepository,
  ) {}

  public async parseAreaFile(filename: string): Promise<File> {
    const content = readFileSync(`fixtures/${filename}`).toString()
    const file = new File(filename, JSON.parse(content))

    await this.iterateSections(file)

    return file
  }

  private async iterateSections(file: File) {
    console.log(`${file.filename} processing now`)
    let header = ""
    await Promise.all(file.data.map(async section => {
      await Promise.all(section.map(async row => {
        if (row.header) {
          header = row.header
          console.log(row.header)
        }
        switch (header) {
          case "MOBILES":
            await this.addMob(file, row)
            break
          case "ROOMS":
            await this.addRoom(file, row)
            break
          case "RESETS":
            await this.addReset(file, row)
            break
          case "OBJECTS":
            // await this.addItem(file, row)
            break
        }
      }))
    }))
    console.log("creating exits")
    await this.createExits(file)
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

  private async addItem(file, itemData) {
    const args = itemData.pObjFlags.split(" ")
    switch (itemData.type) {
      case "weapon":
        const weapon = newWeapon(
          itemData.name,
          itemData.description,
          args[0],
          args[2])
        await ImportService.addPropertiesToItem(weapon, itemData)
        break
      case "armor":
      case "clothing":
        const armor = newEquipment(itemData.name, itemData.description, args[0])
        await ImportService.addPropertiesToItem(armor, itemData)
        break
      case "boat":
        break
      case "container":
        /**
         * RESET
         * 0 - all item weight
         * 1 - container is open
         * 2 - liquid
         * 3 - individual item max weight
         * 4 - loot count
         */
        const container = newContainer(itemData.name, itemData.description)
        const itemFlags = itemData.pObjFlags.split(" ")
        container.container.weightCapacity = itemFlags[0]
        container.container.isOpen = itemFlags[1]
        container.container.liquid = itemFlags[2]
        container.container.maxWeightForItem = itemFlags[3]
        await ImportService.addPropertiesToItem(container, itemData)
        break
      case "drink":
        /**
         * 0 - ?
         * 1 - amount remaining
         * 2 - liquid
         */
        break
      case "food":
        /**
         * 0 - amount
         * 1 - nourishment
         * 2 - <not used>
         * 3 - poisoned
         */
        // const item = newFood(itemData.name, itemData.description, itemData.values[0])
        break
      default:
        return
    }
  }

  private async addReset(file, resetData) {
    if (resetData.command === "M") {
      file.mobResets.push({ mobId: resetData.args[0], roomId: resetData.args[2] })
    }
    if (resetData.command === "E") {
      // itemResets.push(newItemReset())
    }
    return resetData
  }

  private createExits(file: File) {
    Object.keys(file.roomMap).forEach(importId => {
      if (file.roomDataMap[importId] === undefined || file.roomDataMap[importId].doors === undefined) {
        return
      }
      file.roomDataMap[importId].doors.forEach(async door => {
        let direction: Direction
        switch (door.door) {
          case "D0":
            direction = Direction.North
            break
          case "D1":
            direction = Direction.East
            break
          case "D2":
            direction = Direction.South
            break
          case "D3":
            direction = Direction.West
            break
          case "D4":
            direction = Direction.Up
            break
          case "D5":
            direction = Direction.Down
            break
        }
        if (file.roomMap[importId] && file.roomMap[door.vnum]) {
          await this.exitRepository.save(newExit(direction, file.roomMap[importId], file.roomMap[door.vnum]))
        }
      })
    })
  }
}
