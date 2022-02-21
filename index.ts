const getNumbers = (s: string) => s.replaceAll(/\D+/g, "");

// Generated using Lucas Trzesniewski's snippet from StackOverflow:
// https://stackoverflow.com/questions/22483214/regex-check-if-input-still-has-chances-to-become-matching/41580048#41580048
const partialFormattedPhoneRegex = /^((?:\+|$)(?:7|$)|(?:8|$)|$)(?: |$)(?:\(|$)(?:\d|$)(?:\d|$)(?:\d|$)(?:\)|$)(?: |$)(?:\d|$)(?:\d|$)(?:\d|$)(?:-|$)(?:\d|$)(?:\d|$)(?:-|$)(?:\d|$)(?:\d|$)$/;
const isPartialFormattedPhone = (s: string) => Boolean(
    s.match(partialFormattedPhoneRegex),
);

const stringNumbersPhoneRegex = /^[78]?\d{10}$/;
const isCompleteRussianPhone = (s: string) => Boolean(
    getNumbers(s).match(stringNumbersPhoneRegex),
);

const formatRussianPhoneNumber = (s: string): string => {
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

function formatInternationalPhone(value: string): string {
    if (value) {
        return "+" + getNumbers(value).slice(0, 16);
    }
    return "";
}

function handleRussianPhonePaste(event: ClipboardEvent) {
    const input = event.currentTarget as HTMLInputElement;
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedData = clipboardData.getData("Text");

    if (input && pastedData && isCompleteRussianPhone(pastedData)) {
        event.stopPropagation();
        event.preventDefault();

        // User pasted a complete and valid russian phone number, so
        // format it and update input value
        input.value = formatRussianPhoneNumber(pastedData);
    }

    // Otherwise, there will be a default behavior
}

function handleRussianPhoneInput(event: InputEvent) {
    const input = event.currentTarget as HTMLInputElement;

    const rawValue: string = input.value;
    const inputType = event.inputType as (string | undefined);

    const selStart = input.selectionStart || 0;

    if (!inputType || inputType.startsWith("insert")) {
        const completedValue = formatRussianPhoneNumber(rawValue);

        if (completedValue.length < rawValue.length && isPartialFormattedPhone(rawValue)) {
            // Keep value, if it is correct
            return;
        } else {
            input.value = completedValue;
        }

        if (!(selStart === rawValue.length)) {
            // Keep cursor position, if it wasn't in the end
            input.selectionStart = input.selectionEnd = selStart;
        }
    } else if (inputType.startsWith("delete")) {
        const firstDigit = getNumbers(rawValue)[0];

        if (firstDigit !== "7" && firstDigit !== "8") {
            input.value = "";
        } else if (!isPartialFormattedPhone(rawValue)) {
            input.value = formatRussianPhoneNumber(rawValue);
            input.selectionStart = input.selectionEnd = selStart;
        }
    } else {
        input.value = formatRussianPhoneNumber(rawValue)
    }
}

function handleInternationalPhoneInput(event: InputEvent) {
    const input = event.currentTarget as HTMLInputElement;
    input.value = formatInternationalPhone(input.value)
}

(function init() {
    const label = document.getElementById("phone-label") as HTMLLabelElement;
    const input = document.getElementById("phone-input") as HTMLInputElement;
    const button = document.getElementById("phone-button") as HTMLButtonElement;

    let isRussian = true

    const updateInputType = () => {
        if (isRussian) {
            label.innerHTML = "Phone number (RU)";
            button.innerHTML = "Change to international format";
            input.removeEventListener("input", handleInternationalPhoneInput as any);
            input.addEventListener("input", handleRussianPhoneInput as any);
            input.addEventListener("paste", handleRussianPhonePaste as any);
            input.value = formatRussianPhoneNumber(input.value);
        } else {
            label.innerHTML = "Phone number";
            button.innerHTML = "Change to russian format";
            input.removeEventListener("input", handleRussianPhoneInput as any);
            input.removeEventListener("paste", handleRussianPhonePaste as any);
            input.addEventListener("input", handleInternationalPhoneInput as any);
            input.value = formatInternationalPhone(input.value);
        }
    }

    button.addEventListener("click", () => {
        isRussian = !isRussian
        updateInputType()
    });

    updateInputType();
})();
