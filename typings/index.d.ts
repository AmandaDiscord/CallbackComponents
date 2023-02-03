/**
 * @param {(button: import("discord-typings").ButtonAsNotStyleLink | import("discord-typings").SelectMenu) => string} router
 * @param {{ [route: string]: (button: import("discord-typings").ButtonAsNotStyleLink | import("discord-typings").SelectMenu) => unknown}} info
 */
export function setHandlers(router: (button: import("discord-typings").ButtonAsNotStyleLink | import("discord-typings").SelectMenu) => string, info: {
    [route: string]: (button: import("discord-typings").ButtonAsNotStyleLink | import("discord-typings").SelectMenu) => unknown;
}): void;
/**
 * A method to encode custom data into the custom_id while being very space efficient.
 * Keys or values cannot include the null (�) character
 * @param {Record<string, any>} info
 * @returns {string}
 */
export function encode(info: Record<string, any>): string;
/**
 * @template {"object" | "array"} T
 * @param {string} str
 * @param {T} [type] The root type being passed. Should only be used internally
 * @returns {T extends "object" ? Record<string, any> : Array<any>}
 */
export function decode<T extends "object" | "array">(str: string, type?: T): T extends "object" ? Record<string, any> : any[];
/** @param {import("discord-typings").Interaction} interaction */
export function handle(interaction: import("discord-typings").Interaction): void;
