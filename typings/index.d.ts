export type TheCord = typeof import("thunderstorm") | typeof import("discord.js");
/**
 * @typedef {typeof import("thunderstorm") | typeof import("discord.js")} TheCord
 */
/**
 * @type {Map<string, BetterComponent>}
 */
export const components: Map<string, BetterComponent>;
export let idSequence: number;
export class BetterComponent {
    /**
     * @private
     */
    private static get "__#1@#nextID"();
    /**
     * Handles data from interactions where it is a button that exists.
     * You will need to pong or respond to the interaction on your own.
     * @param {TheCord["MessageComponentInteraction"]["prototype"]} interaction
     */
    static handle(interaction: TheCord["MessageComponentInteraction"]["prototype"]): void;
    /**
     * @param {ConstructorParameters<TheCord["MessageButton"]>["0"]} info Do not include customId. The lib assigns it for you
     */
    constructor(info: ConstructorParameters<TheCord["MessageButton"]>["0"]);
    info: import("discord.js").MessageButton | import("discord-typings").MessageComponentData | import("thunderstorm").MessageButtonOptions | import("discord.js").MessageButtonOptions | import("discord-api-types").APIButtonComponent;
    /**
     * @type {string | null}
     */
    id: string | null;
    /**
     * @type {((interaction: TheCord["MessageComponentInteraction"]["prototype"], component: BetterComponent) => unknown) | null}
     */
    callback: (interaction: TheCord["MessageComponentInteraction"]["prototype"], component: BetterComponent) => unknown;
    /** @type {TheCord["MessageButton"]["prototype"]} */
    component: TheCord["MessageButton"]["prototype"];
    toComponent(): import("thunderstorm/src/structures/MessageButton") | import("discord.js").MessageButton;
    /**
     * @param {(interaction: TheCord["MessageComponentInteraction"]["prototype"], component: BetterComponent) => unknown} fn
     */
    setCallback(fn: (interaction: TheCord["MessageComponentInteraction"]["prototype"], component: BetterComponent) => unknown): BetterComponent;
    destroy(): BetterComponent;
}
