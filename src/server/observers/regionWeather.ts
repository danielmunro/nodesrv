import { Client } from "../../client/client"
import LocationService from "../../mob/locationService"
import roll from "../../random/dice"
import { getRandomWeather} from "../../region/constants"
import {getWeatherTransitionMessage} from "../../region/constants"
import { Region } from "../../region/model/region"
import { getRegionRepository } from "../../region/repository/region"
import { Observer } from "./observer"

export class RegionWeather implements Observer {
  constructor(public readonly locationService: LocationService) {}

  public async notify(clients: Client[]): Promise<void> {
    const regionRepository = await getRegionRepository()
    const regions = await regionRepository.query(`SELECT * FROM region`)
    const regionsToUpdate = regions.filter(() => roll(1, 4) === 1)
    const clientsToUpdate = clients.filter(client => client.isLoggedIn())
    regionsToUpdate.forEach(region => this.updateClientsOfRegionWeatherChange(clientsToUpdate, region))

    await regionRepository.save(regionsToUpdate)
  }

  private updateClientsOfRegionWeatherChange(clients: Client[], region: Region) {
    const clientsToUpdate = clients.filter(client =>
      this.locationService.getLocationForMob(client.getSessionMob()).room.region === region)
    region.weather = getRandomWeather()
    const message = getWeatherTransitionMessage(region.weather)
    clientsToUpdate.forEach(client => client.sendMessage(message))
  }
}
