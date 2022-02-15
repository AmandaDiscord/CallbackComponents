const Discord = require("thunderstorm")

/**
 * @type {Map<string, BetterComponent>}
 */
const components = new Map();
const randomString = Math.random().toString(36).substring(7); // This string is important to create truly random IDs across restarts as the sequencing may produce an identical ID.
let idSequence = 0;

class BetterComponent {
	/**
	 * @param {import("thunderstorm").MessageButtonOptions | import("thunderstorm").MessageSelectMenuOptions} info Do not include customId. The lib assigns it for you
	 */
	constructor(info) {
		this.info = info;
		/** @type {"btn" | "slct"} */
		let type = "btn"
		if (this.info.type === "SELECT_MENU" || this.info.type === Discord.Constants.MessageComponentTypes.SELECT_MENU) type = "slct"
		if ((type === "btn" && !this.info.url) || type === "slct") {
			const id = BetterComponent.#nextID
			/**
			 * @type {string | null}
			 */
			this.id = id;
			components.set(this.id, this);
		}
		else this.id = null;
		/**
		 * @type {((interaction: import("thunderstorm").MessageComponentInteraction | import("thunderstorm").SelectMenuInteraction, component: BetterComponent) => unknown) | null}
		 */
		this.callback = null;
		const data = Object.assign({}, info, { customId: this.id || undefined })
		/** @type {import("thunderstorm").MessageButton | import("thunderstorm").MessageSelectMenu} */
		this.component = this.info.type === "BUTTON" ? new Discord.MessageButton(data) : new Discord.MessageSelectMenu(data);
	}

	/**
	 * @private
	 */
	static get #nextID() {
		return `menu-${randomString}-${idSequence++}`;
	}

	toComponent() {
		return this.component;
	}

	/**
	 * @param {(interaction: import("thunderstorm").MessageComponentInteraction | import("thunderstorm").SelectMenuInteraction, component: BetterComponent) => unknown} fn
	 */
	setCallback(fn) {
		this.callback = fn;
		return this
	}

	destroy() {
		if (this.id) components.delete(this.id);
		return this
	}

	/**
	 * Handles data from interactions where it is a component that exists.
	 * You will need to pong or respond to the interaction on your own.
	 * @param {import("thunderstorm").MessageComponentInteraction | import("thunderstorm").SelectMenuInteraction} interaction
	 */
	static handle(interaction) {
		if (!interaction.isMessageComponent()) return;
		const btn = components.get(interaction.customId);
		if (!btn) return;
		if (!btn.callback) return;
		btn.callback(interaction, btn);
	}
}

module.exports.components = components;
module.exports.idSequence = idSequence;
module.exports.BetterComponent = BetterComponent;
