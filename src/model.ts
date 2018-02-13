function newModelSavePromise(model, data) {
  console.log("data", data)
  return new Promise((resolve, reject) =>
    model.save(data, (err, node) => {
      if (err) {
        reject(err)
      }
      resolve(node)
    })
  )
}

function saveAllModels(model, dataSet) {
  return dataSet.map((data) => newModelSavePromise(model, data))
}

export function saveModels(model, dataSet, callback): void {
  const promise = Promise.all(saveAllModels(model, dataSet))
  if (callback) {
    promise.then(callback)
  }
}