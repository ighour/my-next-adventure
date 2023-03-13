import { ECurrencyCode, ELanguageCode, ETimeOfDayCode } from "~/enums";

export function getLocalizedTimeOfDay(timeOfDayCode: ETimeOfDayCode, languageCode: ELanguageCode) {
    switch(timeOfDayCode) {
        case ETimeOfDayCode.ANY:
            switch(languageCode) {
                case ELanguageCode.PT: return "QUALQUER";
                default: return "ANY";
            }
        case ETimeOfDayCode.MORNING:
            switch(languageCode) {
                case ELanguageCode.PT: return "MANHÃ";
                default: return "ANY";
            }
        case ETimeOfDayCode.AFTERNOON:
            switch(languageCode) {
                case ELanguageCode.PT: return "TARDE";
                default: return "ANY";
            }
        case ETimeOfDayCode.EVENING:
            switch(languageCode) {
                case ELanguageCode.PT: return "NOITE";
                default: return "ANY";
            }
        case ETimeOfDayCode.NIGHT:
            switch(languageCode) {
                case ELanguageCode.PT: return "MADRUGADA";
                default: return "ANY";
            }
        default: throw new Error("Missing time of day code"); 
    }
}

export function getLocalizedCost(currencyCode: ECurrencyCode, languageCode: ELanguageCode) {
    switch(currencyCode) {
        case ECurrencyCode.FREE:
            switch(languageCode) {
                case ELanguageCode.PT: return "GRÁTIS";
                default: return "FREE";
            }
        case ECurrencyCode.LOW:
            switch(languageCode) {
                case ELanguageCode.PT: return "BAIXO";
                default: return "LOW";
            }
        case ECurrencyCode.MEDIUM:
            switch(languageCode) {
                case ELanguageCode.PT: return "MÉDIO";
                default: return "MEDIUM";
            }
        case ECurrencyCode.HIGH:
            switch(languageCode) {
                case ELanguageCode.PT: return "ALTO";
                default: return "HIGH";
            }
        default: throw new Error("Missing cost code"); 
    }
}
