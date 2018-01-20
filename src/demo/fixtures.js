import { save as roomSave } from 'room/model'
import { Player } from 'player/model'
import { generateName } from 'room'
import fs from 'fs'
import { db } from 'db'

const room1 = generateName()
const room2 = generateName()
const room3 = generateName()
const player = generateName()

db.query('MATCH (n) DETACH DELETE n', () => {
  roomSave(
    [
      {
        name: room1,
        brief: 'Inn at the Lodge',
        description: 'Flickering torches provide the only light in the large main messhall. The room is filled with the chatter of travellers, eating, drinking, and preparing for their journeys ahead.',
        north: room2,
        south: room3
      },
      {
        name: room2,
        brief: 'A cozy room at the Inn',
        description: 'Something cool.',
        south: room1
      },
      {
        name: room3,
        brief: 'At the crossroads',
        description: 'Something cool.',
        north: room1
      }
    ]
  )

  Player.save({
    name: player,
    room: room1
  })

  function getModelJSON () {
    return JSON.stringify({
      player,
      room1,
      room2,
      room3
    }, null, 2)
  }

  const modelJSON = getModelJSON()

  fs.writeFile(
    process.argv[2] + '/fixture-ids.txt',
    modelJSON,
    () => console.log(modelJSON)
  )
})
