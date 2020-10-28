export * from "./auth";
export * from './user';

/**
 * 
 * @param details Any key value object that needs to be encoded
 */
export function encodeData(details: any): string {
    var formBody: string[] = [];
    for(var property in details) {
        var encodeKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(`${encodeKey}=${encodedValue}`);
    }
    return formBody.join('&');
}