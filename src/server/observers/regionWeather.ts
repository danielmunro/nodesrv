import { Client } from "../../client/client"
import roll from "../../random/dice"
import { Region } from "../../region/model/region"
import { getRegionRepository } from "../../region/repository/region"
import { getRandomWeather, getWeatherTransitionMessage } from "../../region/weather"
import { Observer } from "./observer"

export class RegionWeather implements Observer {
  public async notify(clients: Client[]): Promise<void> {
    const regionRepository = await getRegionRepository()
    const regions = await regionRepository.query(`SELECT * FROM region`)
    const regionsToUpdate = regions.filter(() => roll(1, 4) === 1)
    const clientsToUpdate = clients.filter((client) => client.isLoggedIn())

    regionsToUpdate.forEach((region) =>
      this.updateClientsOfRegionWeatherChange(
        clientsToUpdate.filter((client) =>
          client.getSessionMob().room.region.id === region.id), region))

    await regionRepository.save(regionsToUpdate)
  }

  private updateClientsOfRegionWeatherChange(clients: Client[], region: Region) {
    region.weather = getRandomWeather()
    const message = getWeatherTransitionMessage(region.weather)
    clients.forEach((client) => client.sendMessage(message))
  }
}
