import {getConnection} from "typeorm"
import {Environment} from "../src/app/enum/environment"
import createAppContainer from "../src/app/factory/factory"
import {PlayerEntity} from "../src/player/entity/playerEntity"
import {initializeConnection} from "../src/support/db/connection"

initializeConnection().then(async () => {
  const app = await createAppContainer(
    process.env.STRIPE_API_KEY as string,
    Environment.Development)
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
