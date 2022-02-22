"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function formatInternationalPhone(value) {
    if (value) {
        return "+" + (0, utils_1.getNumbers)(value).slice(0, 16);
    }
    return "";
}
function handleInput(event) {
    const input = event.currentTarget;
    input.value = formatInternationalPhone(input.value);
}
exports.default = {
    input: handleInput,
};
