import { ELanguageCode, ETimeOfDayCode } from "~/models/locales";

export function getTimeOfDay(timeOfDayCode: ETimeOfDayCode, languageCode: ELanguageCode) {
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
