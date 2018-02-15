import { Client } from "../../client/client"

export interface Observer {
  notify(clients: Client[]): void
}