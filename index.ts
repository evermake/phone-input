const getNumbers = (s: string) => s.replaceAll(/\D+/g, "");

// Generated using snippet from StackOverflow:
// https://stackoverflow.com/questions/22483214/regex-check-if-input-still-has-chances-to-become-matching/41580048#41580048
const partialFormattedPhoneRegex = /^((?:\+|$)(?:7|$)|(?:8|$)|$)(?: |$)(?:\(|$)(?:\d|$)(?:\d|$)(?:\d|$)(?:\)|$)(?: |$)(?:\d|$)(?:\d|$)(?:\d|$)(?:-|$)(?:\d|$)(?:\d|$)(?:-|$)(?:\d|$)(?:\d|$)$/;
const isPartialFormattedPhone = (s: string) => Boolean(
    s.match(partialFormattedPhoneRegex),
);

const stringNumbersPhoneRegex = /^[78]?\d{10}$/;
const areStringNumbersPhone = (s: string) => Boolean(
    getNumbers(s).match(stringNumbersPhoneRegex),
);

const completePhoneNumber = (s: string): string => {
    let numbers = getNumbers(s);
    let phone = "";

    let countryCode = numbers[0];

    if (!countryCode) return "";

    if (countryCode === "8") {
        phone += "8 (";
    } else {
        phone += "+7 (";
        if (countryCode !== "7") {
            numbers = "7" + numbers;
        }
    }

    const opCode = numbers.slice(1, 4);
    phone += opCode;
    if (opCode.length === 3) {
        phone += ") ";
    } else {
        return phone;
    }

    const number1 = numbers.slice(4, 7);
    phone += number1;
    if (number1.length === 3) {
        phone += "-";
    } else {
        return phone;
    }

    const number2 = numbers.slice(7, 9);
    phone += number2;
    if (number2.length === 2) {
        phone += "-";
    } else {
        return phone;
    }

    // number3
    phone += numbers.slice(9, 11);

    return phone;
};

let pastedData = "";

const handlePaste = (event: ClipboardEvent) => {
    pastedData = event.clipboardData?.getData("text") || "";
};

const handleInput = (event: InputEvent) => {
    const input = event.currentTarget as HTMLInputElement;

    if (pastedData && areStringNumbersPhone(pastedData)) {
        // User pasted a complete and valid phone number
        // Format it and set to input value
        input.value = completePhoneNumber(pastedData);
        pastedData = "";
        return;
    }

    const rawValue: string = input.value;
    const inputType = event.inputType as (string | undefined);

    const selStart = input.selectionStart || 0;

    if (!inputType || inputType.startsWith("insert")) {
        const completedValue = completePhoneNumber(rawValue);

        if (completedValue.length < rawValue.length && isPartialFormattedPhone(rawValue)) {
            // Keep value, if it is correct and phone completion
            return;
        } else {
            input.value = completedValue;
        }

        if (!(selStart == rawValue.length)) {
            // Keep cursor position, if it wasn't in the end
            input.selectionStart = input.selectionEnd = selStart;
        }
    } else if (inputType.startsWith("delete")) {
        const firstDigit = getNumbers(rawValue)[0];

        if (firstDigit !== "7" && firstDigit !== "8") {
            input.value = "";
        } else if (!isPartialFormattedPhone(rawValue)) {
            input.value = completePhoneNumber(rawValue);
            input.selectionStart = input.selectionEnd = selStart;
        }
    }
};

(function init() {
    document
        .querySelectorAll("input.phone-input")
        .forEach(input => {
            input.addEventListener("input", handleInput as any);
            input.addEventListener("paste", handlePaste as any);
        });
})();
