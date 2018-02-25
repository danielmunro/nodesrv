function newModelSavePromise(model, data): Promise<object> {
  return new Promise((resolve, reject) =>
    model.save(data, (err, node) => {
      if (err) {
        reject(err)
        return
      }
      resolve(node)
    }),
  )
}

export function saveDataSet(model, dataSet: Modellable[], callback = null): void {
  const promise = Promise.all(
    dataSet.map((data) =>
      newModelSavePromise(model, data.getModel())))

  if (callback) {
    promise.then(callback)
  }
}

export interface Modellable {
  getModel(): object
}

export interface ModelHydrator {
  hydrate(data): Modellable
}
