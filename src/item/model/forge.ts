import {Column, Entity, Generated, JoinColumn, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import * as v4 from "uuid"
import Recipe from "./recipe"

@Entity()
export default class Forge {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @OneToMany(() => Recipe, recipe => recipe.forge)
  @JoinColumn()
  public recipes: Recipe[] = []
}
