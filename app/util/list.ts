export const usePossiblyUndefinedList = <T>(undefinedValue: T): [ convert: (val: T|undefined) => T, convertBack: (val: T) => T|undefined ] => {
 return [
     (val: T|undefined) => {
         if(val === undefined) return undefinedValue
         return val
     },
     (val: T) => {
         if(val === undefinedValue) return undefined
         return val
     }
 ]
}