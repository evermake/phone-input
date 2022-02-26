import { getNumbers } from "../utils"

function formatInternationalPhone(value: string): string {
  if (value) {
    return "+" + getNumbers(value).slice(0, 16)
  }
  return ""
}

function handleInput(event: InputEvent) {
  const input = event.currentTarget as HTMLInputElement
  input.value = formatInternationalPhone(input.value)
}

export default {
  input: handleInput,
} as HandlersMap
