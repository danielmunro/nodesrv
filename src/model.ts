function newModelSavePromise(model, data) {
  return new Promise((resolve, reject) =>
    model.save(data, (err, node) => {
      if (err) {
        reject(err)
        return
      }
      resolve(node)
    })
  )
}

function saveAllModels(model, dataSet: Modellable[]) {
  return dataSet.map((data) => newModelSavePromise(model, data.getModel()))
}

export function saveModels(model, dataSet: Modellable[], callback = null): void {
  const promise = Promise.all(saveAllModels(model, dataSet))
  if (callback) {
    promise.then(callback)
  }
}

export interface Modellable {
  getModel(): object
}