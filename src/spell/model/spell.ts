import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Mob } from "../../mob/model/mob"
import { SpellType } from "../../spell/spellType"

@Entity()
export class Spell {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  public spellType: SpellType

  @Column("integer")
  public level: number = 1

  @OneToMany((type) => Mob, (mob) => mob.spells)
  public mob: Mob
}
