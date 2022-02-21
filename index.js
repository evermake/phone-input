"use strict";
const getNumbers = (s) => s.replaceAll(/\D+/g, "");
// Generated using Lucas Trzesniewski's snippet from StackOverflow:
// https://stackoverflow.com/questions/22483214/regex-check-if-input-still-has-chances-to-become-matching/41580048#41580048
const partialFormattedPhoneRegex = /^((?:\+|$)(?:7|$)|(?:8|$)|$)(?: |$)(?:\(|$)(?:\d|$)(?:\d|$)(?:\d|$)(?:\)|$)(?: |$)(?:\d|$)(?:\d|$)(?:\d|$)(?:-|$)(?:\d|$)(?:\d|$)(?:-|$)(?:\d|$)(?:\d|$)$/;
const isPartialFormattedPhone = (s) => Boolean(s.match(partialFormattedPhoneRegex));
const stringNumbersPhoneRegex = /^[78]?\d{10}$/;
const isCompleteRussianPhone = (s) => Boolean(getNumbers(s).match(stringNumbersPhoneRegex));
const formatRussianPhoneNumber = (s) => {
    let numbers = getNumbers(s);
    let phone = "";
    let countryCode = numbers[0];
    if (!countryCode)
        return "";
    if (countryCode === "8") {
        phone += "8 (";
    }
    else {
        phone += "+7 (";
        if (countryCode !== "7") {
            numbers = "7" + numbers;
        }
    }
    const opCode = numbers.slice(1, 4);
    phone += opCode;
    if (opCode.length === 3) {
        phone += ") ";
    }
    else {
        return phone;
    }
    const number1 = numbers.slice(4, 7);
    phone += number1;
    if (number1.length === 3) {
        phone += "-";
    }
    else {
        return phone;
    }
    const number2 = numbers.slice(7, 9);
    phone += number2;
    if (number2.length === 2) {
        phone += "-";
    }
    else {
        return phone;
    }
    // number3
    phone += numbers.slice(9, 11);
    return phone;
};
function formatInternationalPhone(value) {
    if (value) {
        return "+" + getNumbers(value).slice(0, 16);
    }
    return "";
}
function handleRussianPhonePaste(event) {
    const input = event.currentTarget;
    const clipboardData = event.clipboardData || window.clipboardData;
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
function handleRussianPhoneInput(event) {
    const input = event.currentTarget;
    const rawValue = input.value;
    const inputType = event.inputType;
    const selStart = input.selectionStart || 0;
    if (!inputType || inputType.startsWith("insert")) {
        const completedValue = formatRussianPhoneNumber(rawValue);
        if (completedValue.length < rawValue.length && isPartialFormattedPhone(rawValue)) {
            // Keep value, if it is correct
            return;
        }
        else {
            input.value = completedValue;
        }
        if (!(selStart === rawValue.length)) {
            // Keep cursor position, if it wasn't in the end
            input.selectionStart = input.selectionEnd = selStart;
        }
    }
    else if (inputType.startsWith("delete")) {
        const firstDigit = getNumbers(rawValue)[0];
        if (firstDigit !== "7" && firstDigit !== "8") {
            input.value = "";
        }
        else if (!isPartialFormattedPhone(rawValue)) {
            input.value = formatRussianPhoneNumber(rawValue);
            input.selectionStart = input.selectionEnd = selStart;
        }
    }
    else {
        input.value = formatRussianPhoneNumber(rawValue);
    }
}
function handleInternationalPhoneInput(event) {
    const input = event.currentTarget;
    input.value = formatInternationalPhone(input.value);
}
(function init() {
    const label = document.getElementById("phone-label");
    const input = document.getElementById("phone-input");
    const button = document.getElementById("phone-button");
    let isRussian = true;
    const updateInputType = () => {
        if (isRussian) {
            label.innerHTML = "Phone number (RU)";
            button.innerHTML = "Change to international format";
            input.removeEventListener("input", handleInternationalPhoneInput);
            input.addEventListener("input", handleRussianPhoneInput);
            input.addEventListener("paste", handleRussianPhonePaste);
            input.value = formatRussianPhoneNumber(input.value);
        }
        else {
            label.innerHTML = "Phone number";
            button.innerHTML = "Change to russian format";
            input.removeEventListener("input", handleRussianPhoneInput);
            input.removeEventListener("paste", handleRussianPhonePaste);
            input.addEventListener("input", handleInternationalPhoneInput);
            input.value = formatInternationalPhone(input.value);
        }
    };
    button.addEventListener("click", () => {
        isRussian = !isRussian;
        updateInputType();
    });
    updateInputType();
})();
