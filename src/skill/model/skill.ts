import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Mob } from "../../mob/model/mob"
import { SkillType } from "../skillType"

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  public skillType: SkillType

  @Column("integer")
  public level: number = 1

  @OneToMany((type) => Mob, (mob) => mob.skills)
  public mob: Mob
}
