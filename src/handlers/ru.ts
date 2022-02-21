import { getNumbers } from "../utils"


// Generated using Lucas Trzesniewski's snippet from StackOverflow:
// https://stackoverflow.com/questions/22483214/regex-check-if-input-still-has-chances-to-become-matching/41580048#41580048
const partialRussianFormattedPhoneRegex = /^((?:\+|$)(?:7|$)|(?:8|$)|$)(?: |$)(?:\(|$)(?:\d|$)(?:\d|$)(?:\d|$)(?:\)|$)(?: |$)(?:\d|$)(?:\d|$)(?:\d|$)(?:-|$)(?:\d|$)(?:\d|$)(?:-|$)(?:\d|$)(?:\d|$)$/
const isPartialFormattedRussianPhone = (s: string) => Boolean(
    s.match(partialRussianFormattedPhoneRegex),
)


const stringNumbersPhoneRegex = /^[78]?\d{10}$/
const isCompleteRussianPhone = (s: string) => Boolean(
    getNumbers(s).match(stringNumbersPhoneRegex),
)


const formatRussianPhoneNumber = (s: string): string => {
    let numbers = getNumbers(s)
    let phone = ""

    const countryCode = numbers[0]

    if (!countryCode) return ""

    if (countryCode === "8") {
        phone += "8 ("
    } else {
        phone += "+7 ("
        if (countryCode !== "7") {
            numbers = "7" + numbers
        }
    }

    const opCode = numbers.slice(1, 4)
    phone += opCode
    if (opCode.length === 3) {
        phone += ") "
    } else {
        return phone
    }

    const number1 = numbers.slice(4, 7)
    phone += number1
    if (number1.length === 3) {
        phone += "-"
    } else {
        return phone
    }

    const number2 = numbers.slice(7, 9)
    phone += number2
    if (number2.length === 2) {
        phone += "-"
    } else {
        return phone
    }

    // number3
    phone += numbers.slice(9, 11)

    return phone
}


function handleInput(event: InputEvent) {
    const input = event.currentTarget as HTMLInputElement

    const rawValue: string = input.value
    const inputType = event.inputType as (string | undefined)

    const selStart = input.selectionStart || 0

    if (!inputType || inputType.startsWith("insert")) {
        const completedValue = formatRussianPhoneNumber(rawValue)

        if (completedValue.length < rawValue.length && isPartialFormattedRussianPhone(rawValue)) {
            // Keep value, if it is correct
            return
        } else {
            input.value = completedValue
        }

        if (!(selStart === rawValue.length)) {
            // Keep cursor position, if it wasn't in the end
            input.selectionStart = input.selectionEnd = selStart
        }
    } else if (inputType.startsWith("delete")) {
        const firstDigit = getNumbers(rawValue)[0]

        if (firstDigit !== "7" && firstDigit !== "8") {
            input.value = ""
        } else if (!isPartialFormattedRussianPhone(rawValue)) {
            input.value = formatRussianPhoneNumber(rawValue)
            input.selectionStart = input.selectionEnd = selStart
        }
    } else {
        input.value = formatRussianPhoneNumber(rawValue)
    }
}


function handlePaste(event: ClipboardEvent) {
    const input = event.currentTarget as HTMLInputElement

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clipboardData = event.clipboardData || (window as any).clipboardData
    const pastedData = clipboardData.getData("Text")

    if (input && pastedData && isCompleteRussianPhone(pastedData)) {
        event.stopPropagation()
        event.preventDefault()

        // User pasted a complete and valid russian phone number, so
        // format it and update input value
        input.value = formatRussianPhoneNumber(pastedData)
    }

    // Otherwise, there will be a default behavior
}


export default {
    input: handleInput,
    paste: handlePaste,
} as HandlersMap
