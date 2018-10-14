import { getRegionRepository } from "../../region/repository/region"
import { getTestRegion } from "../../test/region"
import { RegionWeather } from "./regionWeather"

describe("region weather server observer", () => {
  it("should update some regions", async () => {
    // setup
    const regionRepository = await getRegionRepository()
    const regions = [
      getTestRegion(),
      getTestRegion(),
      getTestRegion(),
      getTestRegion(),
      getTestRegion(),
      getTestRegion(),
      getTestRegion(),
      getTestRegion(),
      getTestRegion(),
      getTestRegion(),
    ]
    const savedRegions = await regionRepository.save(regions)

    // given
    const weather = regions.map((region) => region.weather)

    // when
    const regionWeather = new RegionWeather()
    await regionWeather.notify([])

    // then
    const loadedRegions = await regionRepository.findByIds(savedRegions.map((region) => region.id))
    const newWeatherPatterns = loadedRegions.map((region) => region.weather)
    expect(weather).not.toBe(newWeatherPatterns)
  }, 10000)
})
