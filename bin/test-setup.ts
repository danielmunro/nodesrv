import { getConnection, initializeConnection } from "../src/support/db/connection"

beforeAll(async () => {
  await initializeConnection()
})

afterAll(async () => {
  await (await getConnection()).close()
})
