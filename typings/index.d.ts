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
     * Handles data from interactions where it is a component that exists.
     * You will need to pong or respond to the interaction on your own.
     * @param {import("thunderstorm").MessageComponentInteraction} interaction
     */
    static handle(interaction: import("thunderstorm/src/structures/MessageComponentInteraction")): void;
    /**
     * @param {import("thunderstorm").MessageButtonOptions} info Do not include customId. The lib assigns it for you
     */
    constructor(info: import("thunderstorm").MessageButtonOptions);
    info: Discord.MessageButtonOptions;
    /**
     * @type {string | null}
     */
    id: string | null;
    /**
     * @type {((interaction: import("thunderstorm").MessageComponentInteraction, component: BetterComponent) => unknown) | null}
     */
    callback: (interaction: import("thunderstorm/src/structures/MessageComponentInteraction"), component: BetterComponent) => unknown;
    /** @type {import("thunderstorm").MessageButton} */
    component: import("thunderstorm/src/structures/MessageButton");
    toComponent(): import("thunderstorm/src/structures/MessageButton");
    /**
     * @param {(interaction: import("thunderstorm").MessageComponentInteraction, component: BetterComponent) => unknown} fn
     */
    setCallback(fn: (interaction: import("thunderstorm/src/structures/MessageComponentInteraction"), component: BetterComponent) => unknown): BetterComponent;
    destroy(): BetterComponent;
}
import Discord = require("thunderstorm");
