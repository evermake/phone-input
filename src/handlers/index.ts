import internationalHandlers from "./int"
import russianHandlers from "./ru"

export default {
    int: internationalHandlers,
    ru: russianHandlers,
} as { [key: string]: HandlersMap }
