function createHealthMap(amount: number, message: string) {
  return { amount, message }
}

export default [
  createHealthMap(1, "is in excellent condition"),
  createHealthMap(0.9, "has a few scratches"),
  createHealthMap(0.75, "has some small wounds and bruises"),
  createHealthMap(0.5, "has quite a few wounds"),
  createHealthMap(0.3, "has some big nasty wounds and scratches"),
  createHealthMap(0.15, "looks pretty hurt"),
  createHealthMap(0, "is in awful condition"),
]
