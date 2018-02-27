function newModelSavePromise(model, data): Promise<object> {
  return new Promise((resolve, reject) =>
    model.save(data, (err, node) => {
      if (err) {
        reject(err)
        return
      }
      resolve(node)
    }))
}

export function saveDataSet(model, dataSet: Modellable[]): Promise<any> {
  return Promise.all(
    dataSet.map((data) =>
      newModelSavePromise(model, data.getModel())))
}

export interface Modellable {
  getModel(): object
}

export interface ModelHydrator {
  hydrate(data): Promise<Modellable>
}
