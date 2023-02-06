// @ts-check

/**
 * @type {Map<string, BetterComponent>}
 */
const components = new Map();
const randomString = Math.random().toString(36).substring(7); // This string is important to create truly random IDs across restarts as the sequencing may produce an identical ID.
let idSequence = 0;

const selectTypes = [3, 5, 6, 7, 8];

class BetterComponent {
	/**
	 * @param {Omit<import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent, "custom_id">} info Do not include custom_id. The lib assigns it for you
	 */
	constructor(info) {
		/** @type {Omit<import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent, "custom_id">} */
		this.info = info;
		/** @type {"btn" | "slct"} */
		let type = "btn";
		if (selectTypes.includes(this.info.type)) type = "slct";
		const id = BetterComponent.#nextID;
		this.id = id;
		components.set(this.id, this);
		/**
		 * @type {((component: BetterComponent, user: string) => unknown) | null}
		 */
		this.callback = null;
		/** @type {import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent} */
		// @ts-ignore
		this.component = Object.assign({ custom_id: this.id }, info);
	}

	// @ts-ignore
	static get #nextID() {
		return `menu-${randomString}-${idSequence++}`;
	}

	toComponent() {
		return this.component;
	}

	/**
	 * @param {(component: BetterComponent, user: string) => unknown} fn
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
	 * @param {import("discord-api-types/v10").APIInteraction} interaction
	 */
	static handle(interaction) {
		if (interaction.type !== 3) return;
		const btn = components.get(interaction.data ? interaction.data.custom_id : undefined);
		if (!btn) return;
		if (!btn.callback) return;
		btn.callback(btn, interaction.user ? interaction.user.id : interaction.member.user.id);
	}
}

module.exports.components = components;
module.exports.idSequence = idSequence;
module.exports.BetterComponent = BetterComponent;
