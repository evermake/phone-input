"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumbers = void 0;
const getNumbers = (s) => s.replaceAll(/\D+/g, "");
exports.getNumbers = getNumbers;
