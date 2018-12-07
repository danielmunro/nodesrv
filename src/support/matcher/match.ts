export default function(thing: string, subject: string): boolean {
  const subjectToLower = subject.toLowerCase()
  return thing.toLowerCase().split(" ").some(word => word.startsWith(subjectToLower))
}
