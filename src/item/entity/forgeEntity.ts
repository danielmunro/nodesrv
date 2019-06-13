import {Column, Entity, Generated, JoinColumn, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import * as v4 from "uuid"
import RecipeEntity from "./recipeEntity"

@Entity()
export default class ForgeEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @OneToMany(() => RecipeEntity, recipe => recipe.forge, { cascade: true, eager: true })
  @JoinColumn()
  public recipes: RecipeEntity[]
}
