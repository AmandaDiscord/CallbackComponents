/**
 * @type {Map<string, BetterComponent>}
 */
const components = new Map();
const randomString = Math.random().toString(36).substring(7); // This string is important to create truly random IDs across restarts as the sequencing may produce an identical ID.
let idSequence = 0;

class BetterComponent {
	/**
	 * @param {Omit<import("discord-typings").Button | import("discord-typings").SelectMenu, "custom_id">} info Do not include custom_id. The lib assigns it for you
	 */
	constructor(info) {
		this.info = info;
		/** @type {"btn" | "slct"} */
		let type = "btn";
		if (this.info.type === 3) type = "slct";
		if ((type === "btn" && !this.info.url) || type === "slct") {
			const id = BetterComponent.#nextID;
			/**
			 * @type {string | null}
			 */
			this.id = id;
			components.set(this.id, this);
		}
		else this.id = null;
		/**
		 * @type {((interaction: import("discord-typings").Interaction, component: BetterComponent) => unknown) | null}
		 */
		this.callback = null;
		const data = Object.assign({}, info, { custom_id: this.id || undefined });
		if (!this.id) delete data.custom_id;
		/** @type {import("discord-typings").Button | import("discord-typings").SelectMenu} */
		this.component = data;
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
	 * @param {(interaction: import("discord-typings").Interaction, component: BetterComponent) => unknown} fn
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
	 * @param {import("discord-typings").Interaction} interaction
	 */
	static handle(interaction) {
		if (interaction.type !== 3) return;
		const btn = components.get(interaction.data ? interaction.data.custom_id : undefined);
		if (!btn) return;
		if (!btn.callback) return;
		btn.callback(interaction, btn);
	}
}

module.exports.components = components;
module.exports.idSequence = idSequence;
module.exports.BetterComponent = BetterComponent;
