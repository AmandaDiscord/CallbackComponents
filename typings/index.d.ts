/**
 * @type {Map<string, BetterComponent>}
 */
export const components: Map<string, BetterComponent>;
export let idSequence: number;
export class BetterComponent {
    static get "__#1@#nextID"(): string;
    /**
     * Handles data from interactions where it is a component that exists.
     * You will need to pong or respond to the interaction on your own.
     * @param {import("discord-api-types/v10").APIInteraction} interaction
     */
    static handle(interaction: import("discord-api-types/v10").APIInteraction): void;
    /**
     * @param {Omit<import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent, "custom_id">} info Do not include custom_id. The lib assigns it for you
     */
    constructor(info: Omit<import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent, "custom_id">);
    /** @type {Omit<import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent, "custom_id">} */
    info: Omit<import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent, "custom_id">;
    id: string;
    /**
     * @type {((component: BetterComponent, user: string) => unknown) | null}
     */
    callback: (component: BetterComponent, user: string) => unknown;
    /** @type {import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent} */
    component: import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent;
    toComponent(): import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent;
    /**
     * @param {(component: BetterComponent, user: string) => unknown} fn
     */
    setCallback(fn: (component: BetterComponent, user: string) => unknown): BetterComponent;
    destroy(): BetterComponent;
}
