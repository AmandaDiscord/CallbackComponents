// @ts-check

const encoding = require("@amanda/scratch")

/** @type {{ [route: string]: (button: import("discord-api-types/v10").APIMessageComponentInteractionData, user: import("discord-api-types/v10").APIUser) => unknown }} */
let handlers = {}
/** @type {(button: import("discord-api-types/v10").APIMessageComponentInteractionData, user: import("discord-api-types/v10").APIUser) => string} */
let routeHandler = (button, user) => button.custom_id

/** @type {Map<string, typeof cc.BetterComponent["prototype"]>} */
const components = new Map()
// This string is important to create truly random IDs across restarts as the sequencing may produce an identical ID.
const randomString = Math.random().toString(36).substring(7)
let idSequence = BigInt(0)
/** @type {[2, 3, 5, 6, 7, 8]} */
const bcAcceptableTypes = [2, 3, 5, 6, 7, 8]

class BetterComponent {
	info
	/** @type {((interaction: import("discord-api-types/v10").APIMessageComponentInteraction, component: BetterComponent) => unknown) | null} */
	callback = null
	id = BetterComponent.#nextID
	/** @type {import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent} */
	component

	/**
	 * @param {Omit<import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APISelectMenuComponent, "custom_id">} info
	 * @param {Record<string, any>} [extraEncodedInfo]
	 */
	constructor(info, extraEncodedInfo) {
		this.info = info
		components.set(this.id, this)
		// @ts-expect-error It's fine!
		this.component = { custom_id: encoding.encode({ mid: this.id, ...(extraEncodedInfo || {}) }), ...this.info }
	}

	/** @returns {string} */
	static get #nextID() {
		return `menu-${randomString}-${idSequence++}`
	}

	/**
	 * @param {(interaction: import("discord-api-types/v10").APIMessageComponentInteraction, component: BetterComponent) => unknown} fn
	 * @returns {this}
	 */
	setCallback(fn) {
		this.callback = fn
		return this
	}

	/** @returns {this} */
	destroy() {
		components.delete(this.id)
		return this
	}
}

const cc = {
	/**
	 * @param {(button: import("discord-api-types/v10").APIMessageComponentInteractionData, user: import("discord-api-types/v10").APIUser) => string} router
	 * @param {{ [route: string]: (button: import("discord-api-types/v10").APIMessageComponentInteractionData, user: import("discord-api-types/v10").APIUser) => unknown }} info
	 */
	setHandlers(router, info) {
		routeHandler = router
		handlers = info
	},

	/**
	 * @param {import("discord-api-types/v10").APIInteraction} interaction
	 * @returns {void}
	 */
	handle(interaction) {
		if (interaction.type !== 3 || !interaction.data) return

		if (bcAcceptableTypes.includes(interaction.data.component_type)) {
			const decoded = encoding.decode(interaction.data.custom_id)
			const btn = components.get(decoded?.mid ?? interaction.data.custom_id)
			if (btn) {
				btn.callback?.(interaction, btn)
				return
			}
		}

		// @ts-expect-error interaction.user will be there
		const route = routeHandler(interaction.data, interaction.member?.user ?? interaction.user)
		// @ts-expect-error interaction.user will be there
		if (handlers[route]) handlers[route](interaction.data, interaction.member?.user ?? interaction.user)
	},

	BetterComponent
}

module.exports = cc
