import { newTrainer, newTraveller } from "../../../mob/factory/inn"
import { newRoom } from "../../../room/factory"
import { Room } from "../../../room/model/room"
import AreaBuilder from "../../areaBuilder"
import DefaultSpec from "../../sectionSpec/defaultSpec"
import { SectionType } from "../../sectionType"

export async function newInn(outsideConnection: Room): Promise<AreaBuilder> {
  const areaBuilder = new AreaBuilder(outsideConnection)
  areaBuilder.addRoomTemplate(
    SectionType.Root,
    new DefaultSpec(newRoom("Inn at the lodge",
    "Flickering torches provide the only light in the large main mess hall. "
    + "The room is filled with the chatter of travellers preparing for the journey ahead.")))
  areaBuilder.addMobTemplate(
    SectionType.Root,
    newTraveller("an old traveller", "an old traveller sits at the bar, studying a small pamphlet"))
  areaBuilder.addMobTemplate(
    SectionType.Root,
    newTrainer())
  areaBuilder.addRoomTemplate(
    SectionType.Connection,
    new DefaultSpec(newRoom("A cozy room at the Inn", "Something about a room in the inn.")))
  areaBuilder.addMobTemplate(
    SectionType.Connection,
    newTraveller(
      "a fur trapper",
      "tall and slender, a middle-age man sits at a bench. " +
      "Intent on cleaning and cataloguing his tools, he barely notices your presence."),
    .75,
  )

  await areaBuilder.buildSection(SectionType.Root)
  await areaBuilder.buildSection(SectionType.Connection)
  await areaBuilder.buildSection(SectionType.Connection)
  await areaBuilder.buildSection(SectionType.Connection)

  return areaBuilder
}
