import { Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { Room } from "../../room/model/room"
import { Terrain } from "../terrain"
import { Weather } from "../weather"

@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @Column("text", { nullable: true })
  public name: string

  @Column("integer")
  public weather: Weather = Weather.Clear

  @Column("integer")
  public terrain: Terrain = Terrain.Plains

  @OneToMany((type) => Room, (room) => room.region)
  public rooms: Room[] = []

  public outsideConnectionCandidates: Room[] = []

  public addRooms(rooms: Room[]) {
    this.rooms.push(...rooms)
    rooms.forEach((room) => room.region = this)
  }
}
