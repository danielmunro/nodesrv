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
    await this.createExits(file)

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
          case "MOBILES":
            await this.addMob(file, row)
            break
          case "ROOMS":
            await this.addRoom(file, row)
            break
          case "RESETS":
            await ImportService.addReset(file, row)
            break
          case "OBJECTS":
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

    try {
      await this.mobRepository.save(mob)
    } catch (exception) {
      console.log("exception saving mob", mobData)
    }

    file.mobs.push(mob)
    file.mobMap[mob.importId] = mob
  }

  private async addRoom(file, roomData): Promise<Room> {
    const room = newRoom(roomData.title, roomData.description)
    room.importID = roomData.id
    try {
      await this.roomRepository.save(room)
    } catch (exception) {
      console.log("exception saving room", roomData)
    }

    file.roomDataMap[room.importID] = roomData
    file.roomMap[room.importID] = room
    file.rooms.push(room)

    return room
  }

  private async addItem(file: File, itemData) {
    const args = itemData.pObjFlags.split(" ")
    switch (itemData.type) {
      case "weapon":
        const weapon = newWeapon(
          itemData.name,
          itemData.description,
          args[0],
          args[2])
        await ImportService.addPropertiesToItem(weapon, itemData)
        await this.itemRepository.save(weapon)
        file.items.push(weapon)
        break
      case "armor":
      case "clothing":
        const armor = newEquipment(itemData.name, itemData.description, args[0])
        await ImportService.addPropertiesToItem(armor, itemData)
        await this.itemRepository.save(armor)
        file.items.push(armor)
        break
      case "boat":
        break
      case "container":
        const container = newContainer(itemData.name, itemData.description)
        const itemProps = itemData.pObjFlags.split(" ")
        container.container.weightCapacity = itemProps[0]
        container.container.liquid = itemProps[2]
        container.container.maxWeightForItem = itemProps[3]
        const flags = itemProps[1].split("")
        this.setItemAffects(container, flags)
        await ImportService.addPropertiesToItem(container, itemData)
        try {
          await this.itemRepository.save(container)
        } catch (exception) {
          console.log("exception saving item", itemData)
        }
        file.items.push(container)
        break
      case "drink":
        break
      case "food":
        break
      default:
        return
    }
  }

  private setItemAffects(item: Item, flags: string[]) {
    const flagMap = {
      "A": AffectType.Glow,
      "B": AffectType.Hum,
      "C": AffectType.ImmortalLoad,
      "D": AffectType.Lock,
      "E": AffectType.Evil,
      "F": AffectType.Invisible,
      "G": AffectType.Magic,
      "H": AffectType.NoDrop,
      "I": AffectType.Bless,
      "J": AffectType.AntiGood,
      "K": AffectType.AntiEvil,
      "L": AffectType.AntiNeutral,
      "M": AffectType.NoRemove,
      "N": AffectType.Inventory,
      "O": AffectType.NoPurge,
      "P": AffectType.RotDeath,
      "Q": AffectType.VisDeath,
      "R": AffectType.NoSacrifice,
      "S": AffectType.NonMetal,
      "T": AffectType.NoLocate,
      "U": AffectType.MeltDrop,
      "V": AffectType.HasTimer,
      "W": AffectType.SellExtract,
      "X": AffectType.WearTimer,
      "Y": AffectType.BurnProof,
      "Z": AffectType.NounCurse,
      "aa": AffectType.ClanCorpse,
      "bb": AffectType.Warped,
      "cc": AffectType.Teleport,
      "dd": AffectType.NoIdentify,
    }
    flags.forEach(flag => {
      if (flagMap[flag]) {
        item.affects.push(newPermanentAffect(flagMap[flag]))
      }
    })
  }

  private async createExits(file: File) {
    console.log(`creating exits for ${file.filename}`)
    await Promise.all(Object.keys(file.roomMap).map(async importId => {
      if (file.roomDataMap[importId] === undefined || file.roomDataMap[importId].doors === undefined) {
        return
      }
      await Promise.all(file.roomDataMap[importId].doors.map(async door => {
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
      }))
    }))
    console.log(`done creating exits for ${file.filename}`)
  }
}
