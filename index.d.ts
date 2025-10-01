import { APIMessageComponentInteractionData, APIUser, APIInteraction, APIButtonComponentWithCustomId, APISelectMenuComponent, APIMessageComponentInteraction } from 'discord-api-types/v10';

declare class BetterComponent {
	readonly info: Omit<APIButtonComponentWithCustomId | APISelectMenuComponent, "custom_id">;
	callback: ((interaction: APIMessageComponentInteraction, component: BetterComponent) => unknown) | null;
	readonly id: string;
	component: APIButtonComponentWithCustomId | APISelectMenuComponent;

	constructor(info: Omit<APIButtonComponentWithCustomId | APISelectMenuComponent, "custom_id">, extraEncodedInfo: Record<string, any>);

	setCallback(fn: (interaction: APIMessageComponentInteraction, component: BetterComponent) => unknown): this;
	destroy(): this;
}

declare const cc: {
	setHandlers(router: (button: APIMessageComponentInteractionData, user: APIUser) => string, info: {
		[route: string]: (button: APIMessageComponentInteractionData, user: APIUser) => unknown;
	}): void;
	handle(interaction: APIInteraction): void;
	BetterComponent: typeof BetterComponent;
};

export = cc;
