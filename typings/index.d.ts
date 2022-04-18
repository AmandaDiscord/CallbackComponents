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
     * @param {import("discord-typings").Interaction} interaction
     */
    static handle(interaction: import("discord-typings").Interaction): void;
    /**
     * @param {import("discord-typings").Button | import("discord-typings").SelectMenu} info Do not include custom_id. The lib assigns it for you
     */
    constructor(info: import("discord-typings").Button | import("discord-typings").SelectMenu);
    info: import("discord-typings").Button | import("discord-typings").SelectMenu;
    /**
     * @type {string | null}
     */
    id: string | null;
    /**
     * @type {((interaction: import("discord-typings").Interaction, component: BetterComponent) => unknown) | null}
     */
    callback: (interaction: import("discord-typings").Interaction, component: BetterComponent) => unknown;
    /** @type {import("discord-typings").Button | import("discord-typings").SelectMenu} */
    component: import("discord-typings").Button | import("discord-typings").SelectMenu;
    toComponent(): import("discord-typings").Button | import("discord-typings").SelectMenu;
    /**
     * @param {(interaction: import("discord-typings").Interaction, component: BetterComponent) => unknown} fn
     */
    setCallback(fn: (interaction: import("discord-typings").Interaction, component: BetterComponent) => unknown): BetterComponent;
    destroy(): BetterComponent;
}
