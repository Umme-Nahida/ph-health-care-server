
// Node:: I didn't understand How is working the generic types in this function,, and also the partial utility type, how is working object.hasOwnProperty.call, and I have a lot of questions about this function, I need to ask my mentor about this function
export const pick =<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Partial<T> =>{

 let finalObject:Partial<T> = {} 

 for(const key of keys){
    if(obj && Object.hasOwnProperty.call(obj, key)){
        finalObject[key] = obj[key]
    }
 }
 
 return finalObject
}