const Discord = require("thunderstorm")

/**
 * @type {Map<string, BetterComponent>}
 */
const components = new Map();
const randomString = Math.random().toString(36).substring(7); // This string is important to create truly random IDs across restarts as the sequencing may produce an identical ID.
let idSequence = 0;

class BetterComponent {
	/**
	 * @param {import("thunderstorm").MessageButtonOptions} info Do not include customId. The lib assigns it for you
	 */
	constructor(info) {
		this.info = info;
		if (!this.info.url) {
			const id = BetterComponent.#nextID
			/**
			 * @type {string | null}
			 */
			this.id = id;
			components.set(this.id, this);
		}
		else this.id = null;
		/**
		 * @type {((interaction: import("thunderstorm").MessageComponentInteraction, component: BetterComponent) => unknown) | null}
		 */
		this.callback = null;
		/** @type {import("thunderstorm").MessageButton} */
		this.component = new Discord.MessageButton(Object.assign({}, info, { customId: this.id || undefined }));
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
	 * @param {(interaction: import("thunderstorm").MessageComponentInteraction, component: BetterComponent) => unknown} fn
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
	 * @param {import("thunderstorm").MessageComponentInteraction} interaction
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
