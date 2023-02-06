export class BetterComponent {
    static get "__#1@#nextID"(): string;
    /**
     * @param {BetterComponent["info"]} info
     * @param {Record<string, any>} [extraEncodedInfo]
     */
    constructor(info: Omit<import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent, "custom_id">, extraEncodedInfo?: Record<string, any>);
    /** @type {Omit<import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent, "custom_id">} */
    info: Omit<import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent, "custom_id">;
    id: string;
    /** @type {import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent} */
    component: import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent;
    /** @type {null | ((interaction: import("discord-api-types/v10").APIMessageComponentInteraction, component: BetterComponent) => unknown)} */
    callback: (interaction: import("discord-api-types/v10").APIMessageComponentInteraction, component: {
        /** @type {Omit<import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent, "custom_id">} */
        info: Omit<import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent, "custom_id">;
        id: string;
        /** @type {import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent} */
        component: import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent;
        callback: any;
        /** @param {(interaction: import("discord-api-types/v10").APIMessageComponentInteraction, component: BetterComponent) => unknown} fn */
        setCallback(fn: (interaction: import("discord-api-types/v10").APIMessageComponentInteraction, component: any) => unknown): void;
        destroy(): any;
    }) => unknown;
    /** @param {(interaction: import("discord-api-types/v10").APIMessageComponentInteraction, component: BetterComponent) => unknown} fn */
    setCallback(fn: (interaction: import("discord-api-types/v10").APIMessageComponentInteraction, component: {
        /** @type {Omit<import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent, "custom_id">} */
        info: Omit<import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent, "custom_id">;
        id: string;
        /** @type {import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent} */
        component: import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent;
        /** @type {null | ((interaction: import("discord-api-types/v10").APIMessageComponentInteraction, component: BetterComponent) => unknown)} */
        callback: any;
        setCallback(fn: (interaction: import("discord-api-types/v10").APIMessageComponentInteraction, component: any) => unknown): void;
        destroy(): any;
    }) => unknown): void;
    destroy(): {
        /** @type {Omit<import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent, "custom_id">} */
        info: Omit<import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent, "custom_id">;
        id: string;
        /** @type {import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent} */
        component: import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent;
        /** @type {null | ((interaction: import("discord-api-types/v10").APIMessageComponentInteraction, component: BetterComponent) => unknown)} */
        callback: any;
        /** @param {(interaction: import("discord-api-types/v10").APIMessageComponentInteraction, component: BetterComponent) => unknown} fn */
        setCallback(fn: (interaction: import("discord-api-types/v10").APIMessageComponentInteraction, component: any) => unknown): void;
        destroy(): any;
    };
}
/**
 * @param {(button: import("discord-api-types/v10").APIMessageComponentInteractionData, user: import("discord-api-types/v10").APIUser) => string} router
 * @param {{ [route: string]: (button: import("discord-api-types/v10").APIMessageComponentInteractionData, user: import("discord-api-types/v10").APIUser) => unknown}} info
 */
export declare function setHandlers(router: (button: import("discord-api-types/v10").APIMessageComponentInteractionData, user: import("discord-api-types/v10").APIUser) => string, info: {
    [route: string]: (button: import("discord-api-types/v10").APIMessageComponentInteractionData, user: import("discord-api-types/v10").APIUser) => unknown;
}): void;
/**
 * A method to encode custom data into the custom_id while being very space efficient.
 * Keys or values cannot include the null (�) character
 * @param {Record<string, any>} info
 * @returns {string}
 */
export declare function encode(info: Record<string, any>): string;
/**
 * @template {"object" | "array"} T
 * @template {T extends "object" ? Record<string, any> : Array<any>} R
 * @param {string} str
 * @param {T} [type] The root type being passed. Should only be used internally
 * @returns {R}
 */
export declare function decode<T extends "object" | "array", R extends T extends "object" ? Record<string, any> : any[]>(str: string, type?: T): R;
/** @param {import("discord-api-types/v10").APIInteraction} interaction */
export declare function handle(interaction: import("discord-api-types/v10").APIInteraction): void;
