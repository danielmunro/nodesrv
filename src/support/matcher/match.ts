export default function(thing: string, subject: string): boolean {
  const lowerSubject = subject.toLowerCase()
  return thing.toLowerCase().split(" ").some(word => word.startsWith(lowerSubject))
}
