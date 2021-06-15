const Discord = require("thunderstorm");

/**
 * @type {Map<string, InteractionMenu>}
 */
const menus = new Map();
const randomString = Math.random().toString(36).substring(7); // This string is important to create truly random IDs across restarts as the sequencing may produce an identical ID.
let idSequence = 0;

class InteractionMenu {
	/**
	 * @param {Discord.PartialChannel} channel
	 * @param {Array<InteractionMessageAction>} actions An Array of 5 max actions
	 */
	constructor(channel, actions) {
		this.menus = menus;
		this.channel = channel;
		this.actions = actions;
		this.idSequence = idSequence;
		/**
		 * @type {Discord.Message}
		 */
		this.message = null;
	}

	/**
	 * @param {InteractionMessageAction} action
	 */
	static #convertActionToButton(action) {
		if (!action.id) {
			let id;
			if (action.url) id = action.url;
			else if (!action.id) id = InteractionMenu.nextID;
			else id = action.id;
			action.id = id;
		}
		/**
		 * @type {import("thunderstorm").MessageActionRowComponentResolvable}
		 */
		const value = {};
		// @ts-ignore
		if (action.emoji) value["emoji"] = action.emoji;
		value["style"] = action.url ? "LINK" : action.style
		if (action.label) value["label"] = action.label;
		if (action.url) value["url"] = action.url;
		if (!action.url) value["custom_id"] = action.id;
		value["type"] = 2;
		value["disabled"] = action.disabled || false;
		return value;
	}

	get nextID() {
		return `menu-${randomString}-${idSequence++}`;
	}

	static get nextID() {
		return `menu-${randomString}-${idSequence++}`;
	}

	/**
	 * Creates the menu with specified options.
	 * Do not include components in the message options. InteractionMenu will do this for you based on the actions you provided in the constructor.
	 * @param {Discord.MessageOptions} [options]
	 */
	async create(options) {
		const buttons = new Discord.MessageActionRow({ type: "ACTION_ROW" }).addComponents(this.actions.map(i => InteractionMenu.#convertActionToButton(i)));
		const msg = await this.channel.send({ components: [buttons], ...options })
		menus.set(msg.id, this);
		this.message = msg;
		return this.message;
	}

	/**
	 * Remove the menu from storage and optionally delete its buttons.
	 */
	async destroy(remove = true) {
		if (!this.message) return;
		if (remove) {
			const embed = this.message.embeds[0] ? this.message.embeds[0] : null;
			const content = this.message.content ? this.message.content : "";
			const ops = { components: [], content, embed };
			await this.message.edit(ops).catch(() => void 0);
		}
		menus.delete(this.message.id);
	}

	/**
	 * Handles data from interactions where it is a button and a menu that exists.
	 * You will need to pong or respond to the interaction on your own.
	 * @param {Discord.MessageComponentInteraction} interaction
	 */
	static async handle(interaction) {
		if (!interaction.isMessageComponent() || !interaction.message) return;
		const menu = menus.get(interaction.message.id);
		if (!menu) return;
		const action = menu.actions.find(a => a.id === interaction.customID);
		if (!action) return;
		if ((action.allowedUsers && !action.allowedUsers.includes(interaction.user.id)) || (action.deniedUsers && action.deniedUsers.includes(interaction.user.id))) return;

		switch (action.ignore) {
			case "that":
				action.actionType = "none";
				break;
			case "thatTotal":
				menu.actions.splice(menu.actions.indexOf(action), 1);
				break;
			case "all":
				menu.actions.forEach(a => a.actionType = "none");
				break;
			case "total":
				await menu.destroy();
				break;
		}
		switch (action.remove) {
			case "that":
				const embed1 = interaction.message.embeds[0] ? interaction.message.embeds[0] : null;
				const content1 = interaction.message.content ? interaction.message.content : "";
				const ops = { content: content1, embed: embed1, components: [new Discord.MessageActionRow({ type: "ACTION_ROW" }).addComponents(menu.actions.filter(a => a.id !== action.id).map(a => InteractionMenu.#convertActionToButton(a)))] };
				await interaction.message.edit(ops);
				menu.actions.splice(menu.actions.indexOf(action), 1);
				break;
			case "all":
				const embed2 = interaction.message.embeds[0] ? interaction.message.embeds[0] : null;
				const content2 = interaction.message.content ? interaction.message.content : "";
				await interaction.message.edit({ content: content2, embed: embed2, components: [] });
				break;
			case "message":
				await menu.destroy(false);
				await interaction.message.delete();
				break;
		}
		if (action.disable === "that") {
			action.disabled = true;
			const embed = interaction.message.embeds[0] ? interaction.message.embeds[0] : null;
			const content = interaction.message.content ? interaction.message.content : "";
			const ops = { content, embed, components: [new Discord.MessageActionRow({ type: "ACTION_ROW" }).addComponents(menu.actions.map(a => InteractionMenu.#convertActionToButton(a)))] };
			await interaction.message.edit(ops);
		} else if (action.disable == "all") {
			menu.actions.forEach(a => a.disabled = true);
			const embed = interaction.message.embeds[0] ? interaction.message.embeds[0] : null;
			const content = interaction.message.content ? interaction.message.content : "";
			const ops = { content, embed, components: [new Discord.MessageActionRow({ type: "ACTION_ROW" }).addComponents(menu.actions.map(a => InteractionMenu.#convertActionToButton(a)))] };
			await interaction.message.edit(ops);
		}

		if (action.actionType === "js") {
			action.actionData(interaction.message, interaction.user);
		}
	}

	/**
	 * Handles data from interactions where it is a button and a menu that exists.
	 * You will need to pong or respond to the interaction on your own.
	 * @param {Discord.MessageComponentInteraction} interaction
	 */
	handle(interaction) {
		return InteractionMenu.handle(interaction);
	}
}

InteractionMenu.menus = menus;
InteractionMenu.idSequence = idSequence;

module.exports = InteractionMenu;

/**
 * @typedef {Object} InteractionMessageAction
 * @property {{ id: string | null, name: string, animated?: boolean }} [emoji]
 * @property {import("thunderstorm").MessageButtonStyle} [style] The style of the button. It's not required for if a url is provided. If not, it defaults to "primary".
 * @property {string} [label]
 * @property {string} [url] If URL is available, all other properties are ignored as no press event is sent.
 * @property {Array<string>} [allowedUsers]
 * @property {Array<string>} [deniedUsers]
 * @property {"that" | "thatTotal" | "all" | "total"} [ignore]
 * @property {"that" | "all" | "message"} [remove]
 * @property {"that" | "all"} [disable]
 * @property {"js" | "none"} [actionType]
 * @property {ActionCallback} [actionData]
 *
 * @property {string} [id] assigned at runtime. Do not manually assign without knowing what you're doing.
 * @property {boolean} [disabled] assigned at runtime. Do not manually assign without knowing what you're doing.
 */

/**
 * @callback ActionCallback
 * @param {Discord.Message} message
 * @param {Discord.User} user
 */
