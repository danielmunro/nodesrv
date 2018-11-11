import { readFileSync } from "fs"
import { initializeConnection } from "../src/db/connection"
import { Direction } from "../src/room/constants"
import { newExit, newRoom } from "../src/room/factory"
import { Room } from "../src/room/model/room"
import { getExitRepository } from "../src/room/repository/exit"
import { getRoomRepository } from "../src/room/repository/room"
import { Mob } from "../src/mob/model/mob"
import { allRaces } from "../src/mob/race/constants"
import { getMobRepository } from "../src/mob/repository/mob"
import { newMob } from "../src/mob/factory"
import { newAttributes, newStartingAttributes, newVitals } from "../src/attributes/factory"
import roll from "../src/random/dice"

const content = readFileSync("fixtures/areas/midgaard.json").toString()
const data = JSON.parse(content)
const rooms: Room[] = []
const mobs: Mob[] = []
const roomMap = {}
const mobMap = {}
const roomDataMap = {}
const resets = []

initializeConnection().then(async () => {
  const roomRepository = await getRoomRepository()
  const exitRepository = await getExitRepository()
  const mobRepository = await getMobRepository()
  data.forEach(async section => {
    let first = true
    let header = ""
    section.forEach(async row => {
      if (first) {
        header = row.header
      }
      switch (header) {
        case "MOBILES":
          addMob(row)
          break
        case "ROOMS":
          addRoom(row)
          break
        case "RESETS":
          addReset(row)
          break
      }
      first = false
    })
  })

  await roomRepository.save(rooms)

  Object.keys(roomMap).forEach(importId => {
    if (roomDataMap[importId] === undefined || roomDataMap[importId].doors === undefined) {
      return
    }
    roomDataMap[importId].doors.forEach(async door => {
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
      if (roomMap[importId] && roomMap[door.vnum]) {
        await exitRepository.save(newExit(direction, roomMap[importId], roomMap[door.vnum]))
      }
    })
  })
})

function dice(rollData) {
  const parts = rollData.split("d")
  const count = parts[0]
  const secondPart = parts[1].split("+")
  const sides = secondPart[0]
  const bonus = secondPart[1]

  return roll(count, sides) + bonus
}

function addMob(mobData) {
  const vitals = newVitals(dice(mobData.hit), dice(mobData.mana), 1000)
  const mob = newMob(
    mobData.name,
    mobData.description,
    mobData.race,
    vitals,
    newStartingAttributes(vitals, mobData.level))
  mob.gold = mobData.wealth

  mobs.push(mob)
  mobMap[mobData.id] = mob
}

function addRoom(roomData) {
  const room = newRoom(roomData.title, roomData.description)
  room.importID = roomData.id
  roomDataMap[room.importID] = roomData
  roomMap[room.importID] = room
  rooms.push(room)
}

function addReset(resetData) {
  if (resetData.command === "M") {
    roomMap[resetData.args[2]].addMob(mobMap[resetData.args[0]])
  }
  return resetData
}
