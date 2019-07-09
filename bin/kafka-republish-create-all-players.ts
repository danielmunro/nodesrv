import {getConnection} from "typeorm"
import createAppContainer from "../src/app/factory/factory"
import {PlayerEntity} from "../src/player/entity/playerEntity"
import {initializeConnection} from "../src/support/db/connection"

initializeConnection().then(async () => {
  const app = await createAppContainer()
  const connection = getConnection()
  const playerRepository = connection.getRepository<PlayerEntity>(PlayerEntity)
  const players = await playerRepository.find()
  const kafkaService = app.getKafkaService()
  await Promise.all(players.map(async player => {
    await kafkaService.publishPlayer(player)
    console.log(`player sent -- ${player.uuid}`)
  }))
  process.exit(0)
})
