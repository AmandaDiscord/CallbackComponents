import Discord from "thunderstorm";

declare class InteractionMenu {
	public menus: Map<string, InteractionMenu>;
	public static menus: Map<string, InteractionMenu>;
	public channel: Discord.PartialChannel;
	public actions: Array<InteractionMessageAction>;
	public idSequence: number;
	public static idSequence: number;
	public message: Discord.Message | null;

	public constructor(channel: Discord.PartialChannel, actions: Array<InteractionMessageAction>);

	private static #convertActionToButton(action: InteractionMessageAction, client: Discord.Client): Discord.Button;

	public get nextID(): string;
	public static get nextID(): string;

	/**
	 * Creates the menu with specified content and options.
	 * Do not include buttons in the message options. InteractionMenu will do this for you based on the actions you provided in the constructor.
	 */
	public create(content: Discord.StringResolvable, options?: Discord.MessageOptions): Promise<Discord.Message>;
	/**
	 * Remove the menu from storage and optionally delete its buttons.
	 */
	public destroy(remove?: boolean): Promise<void>;
	/**
	 * Handles data from interactions where it is a button and a menu that exists.
	 * You will need to pong or respond to the interaction on your own.
	 */
	public static handle(interaction: Discord.InteractionMessage): void;
	/**
	 * Handles data from interactions where it is a button and a menu that exists.
	 * You will need to pong or respond to the interaction on your own.
	 */
	public handle(interaction: Discord.InteractionMessage): void;
}

type InteractionMessageAction = {
	emoji?: {
		id: string | null;
		name: string;
		animated?: boolean;
	};
	/**
	 * The style of the button. It's not required for if a url is provided. If not, it defaults to "primary".
	 */
	style?: import("thunderstorm").Button["style"];
	label?: string;
	/**
	 * If URL is available, all other properties are ignored as no press event is sent.
	 */
	url?: string;
	allowedUsers?: Array<string>;
	deniedUsers?: Array<string>;
	ignore?: "that" | "thatTotal" | "all" | "total";
	remove?: "that" | "all" | "message";
	disable?: "that" | "all";
	actionType?: "js" | "none";
	actionData?(message?: Discord.Message, user?: Discord.User): any;
}

export = InteractionMenu;
