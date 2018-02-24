import * as model from "seraph-model"
import { db } from "./../db/db"
import { Modellable, saveDataSet } from "./../db/model"
import { Domain } from "./../domain"

export const Mob = model(db, Domain.Mob)
