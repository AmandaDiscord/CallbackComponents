/**
 * @param {(button: import("discord-api-types/v10").APIMessageComponentInteractionData) => string} router
 * @param {{ [route: string]: (button: import("discord-api-types/v10").APIMessageComponentInteractionData) => unknown}} info
 */
export function setHandlers(router: (button: import("discord-api-types/v10").APIMessageComponentInteractionData) => string, info: {
    [route: string]: (button: import("discord-api-types/v10").APIMessageComponentInteractionData) => unknown;
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
 * @template {T extends "object" ? Record<string, any> : Array<any>} R
 * @param {string} str
 * @param {T} [type] The root type being passed. Should only be used internally
 * @returns {R}
 */
export function decode<T extends "object" | "array", R extends T extends "object" ? Record<string, any> : any[]>(str: string, type?: T): R;
/** @param {import("discord-api-types/v10").APIInteraction} interaction */
export function handle(interaction: import("discord-api-types/v10").APIInteraction): void;
