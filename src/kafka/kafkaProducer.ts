import {Kafka, Producer} from "kafkajs"

export default async function(clientId: string, brokers: string[]): Promise<Producer> {
  const kafka = new Kafka({
    brokers,
    clientId,
  })
  const producer = kafka.producer()
  await producer.connect()
  return producer
}
