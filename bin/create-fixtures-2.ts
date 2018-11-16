/* tslint:disable */
import { readFileSync, writeFileSync } from "fs"
import { newStartingAttributes, newVitals } from "../src/attributes/factory"
import File from "../src/import/file"
import { newContainer, newEquipment, newFood, newWeapon } from "../src/item/factory"
import { Item } from "../src/item/model/item"
import { newMob, newMobReset } from "../src/mob/factory"
import roll from "../src/random/dice"
import { Direction } from "../src/room/constants"
import { newRoom } from "../src/room/factory"

const listFile = readFileSync("fixtures/area/area.lst").toString()
const areaFiles = listFile.split("\n")
const itemTypes = []

areaFiles.forEach(async area => {
  const filename = `fixtures/${area}`
  const content = readFileSync(filename).toString()
  const file = new File(filename, JSON.parse(content))

  await iterateSections(file)

  createExits(file)
})

writeFileSync("itemTypes.json",
  JSON.stringify(itemTypes.filter((type, i) => itemTypes.indexOf(type) === i).sort()))

async function iterateSections(file: File) {
  console.log(`${file.filename} processing now`)
  file.data.forEach(async section => {
    let first = true
    let header = ""
    section.forEach(async row => {
      if (first) {
        header = row.header
      }
      switch (header) {
        case "MOBILES":
          addMob(file, row)
          break
        case "ROOMS":
          addRoom(file, row)
          break
        case "RESETS":
          addReset(file, row)
          break
        case "OBJECTS":
          addItem(file, row)
          break
      }
      first = false
    })
  })
}

function createExits(file: File) {
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
        // await exitRepository.save(newExit(direction, roomMap[importId], roomMap[door.vnum]))
      }
    })
  })
}

function dice(rollData) {
  const parts = rollData.split("d")
  const count = parts[0]
  const secondPart = parts[1].split("+")
  const sides = secondPart[0]
  const bonus = secondPart[1]

  return roll(count, sides) + bonus
}

function addMob(file: File, mobData) {
  const vitals = newVitals(dice(mobData.hit), dice(mobData.mana), 1000)
  const mob = newMob(
    mobData.name,
    mobData.description,
    mobData.race,
    vitals,
    newStartingAttributes(vitals, mobData.level))
  mob.gold = mobData.wealth

  file.mobs.push(mob)
  file.mobMap[mobData.id] = mob
}

function addRoom(file: File, roomData) {
  const room = newRoom(roomData.title, roomData.description)
  room.importID = roomData.id
  file.roomDataMap[room.importID] = roomData
  file.roomMap[room.importID] = room
  file.rooms.push(room)
}

function addItem(file, itemData) {
  const args = itemData.pObjFlags.split(" ")
  itemTypes.push(itemData.type)
  switch (itemData.type) {
    case "weapon":
      const weapon = newWeapon(
        itemData.name,
        itemData.description,
        args[0],
        args[2])
      addPropertiesToItem(weapon, itemData)
      break
    case "armor":
    case "clothing":
      const armor = newEquipment(itemData.name, itemData.description, args[0])
      addPropertiesToItem(armor, itemData)
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
      const item = newContainer(itemData.name, itemData.description)
      const itemFlags = itemData.pObjFlags.split(" ")
      item.container.weightCapacity = itemFlags[0]
      item.container.isOpen = itemFlags[1]
      item.container.liquid = itemFlags[2]
      item.container.maxWeightForItem = itemFlags[3]
      addPropertiesToItem(item, itemData)
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
      const item = newFood(itemData.name, itemData.description, itemData.values[0])
      break
    default:
      return
  }
}

function addPropertiesToItem(item: Item, itemData) {
  item.level = itemData.level
  item.value = itemData.cost
  item.weight = itemData.weight
  item.material = itemData.material
}

function addReset(file, resetData) {
  if (resetData.command === "M") {
    file.mobResets.push(newMobReset(
      file.mobMap[resetData.args[0]],
      file.roomMap[resetData.args[2]]))
  }
  if (resetData.command === "E") {
    // itemResets.push(newItemReset())
  }
  return resetData
}
