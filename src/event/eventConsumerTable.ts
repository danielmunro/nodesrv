import MobArrived from "../gameService/eventConsumer/mobArrived"
import MobLeft from "../gameService/eventConsumer/mobLeft"

export default [
  new MobArrived(),
  new MobLeft(),
]
