import EventConsumer from "./eventConsumer"

export default interface EventChannels {
  [key: string]: EventConsumer[]
}
