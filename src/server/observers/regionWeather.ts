import {inject, injectable} from "inversify"
import { Client } from "../../client/client"
import LocationService from "../../mob/service/locationService"
import { getRandomWeather} from "../../region/constants"
import {getWeatherTransitionMessage} from "../../region/constants"
import { RegionEntity } from "../../region/entity/regionEntity"
import WeatherService from "../../region/service/weatherService"
import {Types} from "../../support/types"
import { Observer } from "./observer"

@injectable()
export class RegionWeather implements Observer {
  constructor(
    @inject(Types.LocationService) private readonly locationService: LocationService,
    @inject(Types.WeatherService) private readonly weatherService: WeatherService,
    private readonly regions: RegionEntity[] = []) {}

  public async notify(clients: Client[]): Promise<void> {
    const clientsToUpdate = clients.filter(client => client.isLoggedIn())
    this.regions.forEach(region =>
      this.updateClientsOfRegionWeatherChange(clientsToUpdate, region))
  }

  private updateClientsOfRegionWeatherChange(clients: Client[], region: RegionEntity) {
    const clientsToUpdate = clients.filter(client =>
      this.locationService.getLocationForMob(client.getSessionMob()).room.region === region)
    const newWeather = getRandomWeather()
    this.weatherService.updateRegionWeather(region, getRandomWeather())
    const message = getWeatherTransitionMessage(newWeather)
    clientsToUpdate.forEach(client => client.sendMessage(message))
  }
}
