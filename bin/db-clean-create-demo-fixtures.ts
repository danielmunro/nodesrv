import * as fs from "fs"
import { db, generateName } from "./../src/db"
import Player from "./../src/player/model"
import { saveModels } from "./../src/room/model"

const room1 = generateName()
const room2 = generateName()
const room3 = generateName()
const player = generateName()

db.query("MATCH (n) DETACH DELETE n", () => {
  saveModels([
    {
      brief: "Inn at the Lodge",
      description: "Flickering torches provide the only light in the large main messhall. "
      + "The room is filled with the chatter of travellers, eating, drinking, and preparing for the journey ahead.",
      name: room1,
      north: room2,
      south: room3,
    },
    {
      brief: "A cozy room at the Inn",
      description: "Something cool.",
      name: room2,
      south: room1,
    },
    {
      brief: "At the crossroads",
      description: "Something cool.",
      name: room3,
      north: room1,
    },
  ])

  Player.save({
    name: player,
    room: room1,
  })

  function getModelJSON() {
    return JSON.stringify({
      player,
      room1,
      room2,
      room3,
    }, null, 2)
  }

  const modelJSON = getModelJSON()

  fs.writeFile(
    `${process.argv[2]}/fixture-ids.txt`,
    modelJSON,
    () => console.log(modelJSON),
  )
})
