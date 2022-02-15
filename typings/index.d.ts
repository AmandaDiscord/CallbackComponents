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
     * @param {import("thunderstorm").MessageComponentInteraction | import("thunderstorm").SelectMenuInteraction} interaction
     */
    static handle(interaction: import("thunderstorm/src/structures/MessageComponentInteraction") | import("thunderstorm/src/structures/SelectMenuInteraction")): void;
    /**
     * @param {import("thunderstorm").MessageButtonOptions | import("thunderstorm").MessageSelectMenuOptions} info Do not include customId. The lib assigns it for you
     */
    constructor(info: import("thunderstorm").MessageButtonOptions | import("thunderstorm").MessageSelectMenuOptions);
    info: Discord.MessageButtonOptions | Discord.MessageSelectMenuOptions;
    /**
     * @type {string | null}
     */
    id: string | null;
    /**
     * @type {((interaction: import("thunderstorm").MessageComponentInteraction | import("thunderstorm").SelectMenuInteraction, component: BetterComponent) => unknown) | null}
     */
    callback: (interaction: import("thunderstorm/src/structures/MessageComponentInteraction") | import("thunderstorm/src/structures/SelectMenuInteraction"), component: BetterComponent) => unknown;
    /** @type {import("thunderstorm").MessageButton | import("thunderstorm").MessageSelectMenu} */
    component: import("thunderstorm/src/structures/MessageButton") | import("thunderstorm/src/structures/MessageSelectMenu");
    toComponent(): import("thunderstorm/src/structures/MessageButton") | import("thunderstorm/src/structures/MessageSelectMenu");
    /**
     * @param {(interaction: import("thunderstorm").MessageComponentInteraction | import("thunderstorm").SelectMenuInteraction, component: BetterComponent) => unknown} fn
     */
    setCallback(fn: (interaction: import("thunderstorm/src/structures/MessageComponentInteraction") | import("thunderstorm/src/structures/SelectMenuInteraction"), component: BetterComponent) => unknown): BetterComponent;
    destroy(): BetterComponent;
}
import Discord = require("thunderstorm");
