import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export default class Ac {
  public static create(pierce: number, slash: number, bash: number, magic: number) {
    const ac = new Ac()
    ac.pierce = pierce
    ac.slash = slash
    ac.bash = bash
    ac.magic = magic
    return ac
  }

  @PrimaryGeneratedColumn()
  public id: number

  @Column("integer")
  public pierce: number = 0

  @Column("integer")
  public slash: number = 0

  @Column("integer")
  public bash: number = 0

  @Column("integer")
  public magic: number = 0
}
