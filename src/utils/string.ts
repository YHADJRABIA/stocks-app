export const capitaliseFirstLetter = (string: string) => {
  string ? string[0].toUpperCase() + string.slice(1) : string
}
