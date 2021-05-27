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
	 * @param {Array<InteractionMessageAction>} actions
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
	 * @param {Discord.Client} client
	 * @returns {Discord.Button}
	 */
	static #convertActionToButton(action, client) {
		if (!action.id) {
			let id;
			if (action.url) id = action.url;
			else if (!action.id) id = InteractionMenu.nextID;
			else id = action.id;
			action.id = id;
		}
		/**
		 * @type {import("@amanda/discordtypings").ButtonData}
		 */
		const value = {};
		if (action.emoji) value["emoji"] = action.emoji;
		value["style"] = action.url ? 5 :
			action.style === "primary" ? 1 :
			action.style === "secondary" ? 2 :
			action.style === "success" ? 3 :
			action.style === "danger" ? 4 :
			action.style === "link" ? 5 : 1;
		if (action.label) value["label"] = action.label;
		if (action.url) value["url"] = action.url;
		if (!action.url) value["custom_id"] = action.id;
		value["type"] = 2;
		value["disabled"] = action.disabled || false;
		return new Discord.Button(value, client);
	}

	get nextID() {
		return `menu-${randomString}-${idSequence++}`;
	}

	static get nextID() {
		return `menu-${randomString}-${idSequence++}`;
	}

	/**
	 * Creates the menu with specified content and options.
	 * Do not include buttons in the message options. InteractionMenu will do this for you based on the actions you provided in the constructor.
	 * @param {Discord.StringResolvable} content
	 * @param {Discord.MessageOptions} [options]
	 */
	async create(content, options) {
		const buttons = [new Discord.ButtonRow(this.actions.map(i => InteractionMenu.#convertActionToButton(i, this.channel.client)))];
		const payload1 = await Discord.TextBasedChannel.transform(content, options);
		const payload2 = await Discord.TextBasedChannel.transform("", { buttons: buttons })
		const payload = Object.assign(payload2, payload1)
		const data = await this.channel.client._snow.channel.createMessage(this.channel.id, payload, { disableEveryone: options ? options.disableEveryone || false : this.channel.client.options.disableEveryone || false });
		const msg = new Discord.Message(data, this.channel.client);
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
			const ops = { buttons: [] };
			if (embed) Object.assign(ops, { embed: embed });
			await this.message.edit(content, ops);
		}
		menus.delete(this.message.id);
	}

	/**
	 * Handles data from interactions where it is a button and a menu that exists.
	 * You will need to pong or respond to the interaction on your own.
	 * @param {Discord.InteractionMessage} interaction
	 */
	static handle(interaction) {
		if (interaction.type !== "button" || !interaction.message) return;
		const menu = menus.get(interaction.message.id);
		if (!menu) return;
		const action = menu.actions.find(a => a.id === interaction.component.id);
		if (!action) return;
		if ((action.allowedUsers && !action.allowedUsers.includes(interaction.author.id)) || (action.deniedUsers && action.deniedUsers.includes(interaction.author.id))) return;

		if (action.actionType === "js") {
			action.actionData(interaction.message, interaction.author);
		}
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
				menu.destroy();
				break;
		}
		switch (action.remove) {
			case "that":
				const embed = interaction.message.embeds[0] ? interaction.message.embeds[0] : null;
				const content = interaction.message.content ? interaction.message.content : "";
				const ops = { buttons: [new Discord.ButtonRow(menu.actions.filter(a => a.id !== action.id).map(a => InteractionMenu.#convertActionToButton(a, interaction.client)))] };
				if (embed) Object.assign(ops, { embed: embed });
				interaction.message.edit(content, ops);
				menu.actions.splice(menu.actions.indexOf(action), 1);
				break;
			case "all":
				interaction.message.edit("", { buttons: [] });
				break;
			case "message":
				menu.destroy(false);
				interaction.message.delete();
				break;
		}
		if (action.disable === "that") {
			action.disabled = true;
			const embed = interaction.message.embeds[0] ? interaction.message.embeds[0] : null;
			const content = interaction.message.content ? interaction.message.content : "";
			const ops = { buttons: [new Discord.ButtonRow(menu.actions.map(a => InteractionMenu.#convertActionToButton(a, interaction.client)))] };
			if (embed) Object.assign(ops, { embed: embed });
			interaction.message.edit(content, ops);
		} else if (action.disable == "all") {
			menu.actions.forEach(a => a.disabled = true);
			const embed = interaction.message.embeds[0] ? interaction.message.embeds[0] : null;
			const content = interaction.message.content ? interaction.message.content : "";
			const ops = { buttons: [new Discord.ButtonRow(menu.actions.map(a => InteractionMenu.#convertActionToButton(a, interaction.client)))] };
			if (embed) Object.assign(ops, { embed: embed });
			interaction.message.edit(content, ops);
		}
	}

	/**
	 * Handles data from interactions where it is a button and a menu that exists.
	 * You will need to pong or respond to the interaction on your own.
	 * @param {Discord.InteractionMessage} interaction
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
 * @property {import("thunderstorm").Button["style"]} [style] The style of the button. It's not required for if a url is provided. If not, it defaults to "primary".
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
