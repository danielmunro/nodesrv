import { readFileSync } from "fs"
import { initializeConnection } from "../src/db/connection"
import { Direction } from "../src/room/constants"
import { newExit, newRoom } from "../src/room/factory"
import { Room } from "../src/room/model/room"
import { getExitRepository } from "../src/room/repository/exit"
import { getRoomRepository } from "../src/room/repository/room"

const content = readFileSync("fixtures/areas/midgaard.json").toString()
const data = JSON.parse(content)
const rooms: Room[] = []
const mobs = []
const roomMap = {}
const roomDataMap = {}

initializeConnection().then(async () => {
  const roomRepository = await getRoomRepository()
  const exitRepository = await getExitRepository()
  data.forEach(async section => {
    let first = true
    let header = ""
    section.forEach(async row => {
      // console.log(row)
      if (first) {
        header = row.header
      }
      switch (header) {
        case "MOBILES":
          break
        case "ROOMS":
          addRoom(row)
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

function addRoom(roomData) {
  const room = newRoom(roomData.title, roomData.description)
  room.importID = roomData.id
  roomDataMap[room.importID] = roomData
  roomMap[room.importID] = room
  rooms.push(room)
}
