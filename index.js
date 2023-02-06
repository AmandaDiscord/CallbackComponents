// @ts-check

/** @type {{ [route: string]: (button: import("discord-api-types/v10").APIMessageComponentInteractionData, user: import("discord-api-types/v10").APIUser) => unknown}} */
let handlers = {};
/** @type {(button: import("discord-api-types/v10").APIMessageComponentInteractionData, user: import("discord-api-types/v10").APIUser) => string} */
let routeHandler = (button, _) => button.custom_id;

/** @type {Map<string, typeof cc.BetterComponent["prototype"]>} */
const components = new Map();
const randomString = Math.random().toString(36).substring(7); // This string is important to create truly random IDs across restarts as the sequencing may produce an identical ID.
let idSequence = 0;
/** @type {[2, 3, 5, 6, 7, 8]} */
const bcAcceptableTypes = [2, 3, 5, 6, 7, 8];

/**
 * @template {any} T
 * @param {T} item
 * @returns {T is Record<any, any>}
 */
const isObject = (item) => typeof item === "object" && !Array.isArray(item) && item !== null;

const delimiter = "�";
const forbiddenKeys = ["__proto__", "prototype"];

const cc = {
	/**
	 * @param {(button: import("discord-api-types/v10").APIMessageComponentInteractionData, user: import("discord-api-types/v10").APIUser) => string} router
	 * @param {{ [route: string]: (button: import("discord-api-types/v10").APIMessageComponentInteractionData, user: import("discord-api-types/v10").APIUser) => unknown}} info
	 */
	setHandlers(router, info) {
		routeHandler = router;
		handlers = info;
	},

	/**
	 * A method to encode custom data into the custom_id while being very space efficient.
	 * Keys or values cannot include the null (�) character
	 * @param {Record<string, any>} info
	 * @returns {string}
	 */
	encode(info) {
		let rt = "";
		/** @param {any} item */
		const push = (item) => {
			if (isObject(item)) rt += `{${cc.encode(item)}}`; // obj
			else if (Array.isArray(item)) rt += `[${item.map((i, ind, arr) => isObject(i) ? `{${cc.encode(i)}}` : `${cc.encode(i)}${ind !== arr.length - 1 ? delimiter : ""}`).join("")}]`; // array
			else if (item === null) rt += "n"; // nil
			else if (typeof item === "bigint") rt += `b${item}`; // bigint
			else if (typeof item === "undefined") rt += "v"; // void
			else if (typeof item === "string") rt += `"${item}`; // strings
			else if (typeof item === "boolean") rt += item ? "t" : "f"; // booleans
			else if (typeof item === "number") rt += String(item);
			else throw new Error(`Don't know how to encode ${typeof item}: ${require("util").inspect(item)}`);
		}
		if (!isObject(info)) push(info);
		else {
			const keys = Object.keys(info);
			for (let index = 0; index < keys.length; index++) {
				const key = keys[index];
				if (forbiddenKeys.includes(key)) continue;
				rt += `${key}:`;
				push(info[key]);
				if ((index !== keys.length - 1) && !isObject(info[key]) && !Array.isArray(info[key])) rt += delimiter; // They have their own endings, so space can be saved
			}
		}
		return rt;
	},

	/**
	 * @template {"object" | "array"} T
	 * @template {T extends "object" ? Record<string, any> : Array<any>} R
	 * @param {string} str
	 * @param {T} [type] The root type being passed. Should only be used internally
	 * @returns {R}
	 */
	// @ts-ignore
	decode(str, type = "object") {
		/** @type {R} */
		// @ts-ignore
		const rt = type === "object" ? {} : [];
		let text = str;
		while (text.length) {
			let key = void 0;
			let ignore = false;
			if (type === "object") {
				const firstColon = text.indexOf(":");
				key = text.slice(0, firstColon);
				if (forbiddenKeys.includes(key)) ignore = true;
				text = text.slice(firstColon + 1);
			}

			const nextDelimiter = text.indexOf(delimiter);
			const endToUse = nextDelimiter === -1 ? text.length : nextDelimiter;

			let actualValue = void 0;
			if (text[0] === "\"") {
				actualValue = text.slice(1, endToUse);
				text = text.slice(endToUse + 1);
			} else if (text[0] === "{") {
				const closingIndex = findClosing(text, 0, "}");
				actualValue = cc.decode(text.slice(1, closingIndex));
				text = text.slice(closingIndex + 1);
			} else if (text[0] === "[") {
				const closingIndex = findClosing(text, 0, "]");
				actualValue = cc.decode(text.slice(1, closingIndex), "array");
				text = text.slice(closingIndex + 1);
			} else if (text[0] === "t") {
				actualValue = true;
				text = text.slice(endToUse + 1);
			} else if (text[0] === "f") {
				actualValue = false;
				text = text.slice(endToUse + 1);
			} else if (text[0] === "v") {
				actualValue = void 0;
				text = text.slice(endToUse + 1);
			} else if (text[0] === "n") {
				actualValue = null;
				text = text.slice(endToUse + 1);
			} else if (text[0] === "b") {
				actualValue = BigInt(text.slice(1, endToUse));
				text = text.slice(endToUse + 1);
			} else {
				actualValue = Number(text.slice(0, endToUse));
				text = text.slice(endToUse + 1);
			}
			if (ignore) continue;
			if (type === "object") rt[key] = actualValue;
			else rt.push(actualValue);
		}

		return rt;
	},

	/** @param {import("discord-api-types/v10").APIInteraction} interaction */
	handle(interaction) {
		if (interaction.type !== 3 || !interaction.data) return;
		if (bcAcceptableTypes.includes(interaction.data.component_type)) {
			const decoded = cc.decode(interaction.data.custom_id, "object");
			const btn = components.get(decoded?.mid ?? interaction.data.custom_id);
			if (btn && btn.callback) btn.callback(interaction, btn);
		}
		const route = routeHandler(interaction.data, interaction.user ? interaction.user : interaction.member.user);
		if (handlers[route]) handlers[route](interaction.data, interaction.user ? interaction.user : interaction.member.user);
	},

	BetterComponent: class BetterComponent {
		/**
		 * @param {import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APIBaseSelectMenuComponent} info
		 * @param {Record<string, any>} [extraEncodedInfo]
		 */
		constructor(info, extraEncodedInfo) {
			/** @type {import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APIBaseSelectMenuComponent} */
			this.info = info;
			this.id = BetterComponent.#nextID;
			components.set(this.id, this);
			/** @type {import("discord-api-types/v10").APIButtonComponentWithCustomId | import("discord-api-types/v10").APIBaseSelectMenuComponent} */
			this.component = Object.assign({ custom_id: cc.encode({ mid: this.id, ...(extraEncodedInfo || {}) }) }, this.info)
			/** @type {null | ((interaction: import("discord-api-types/v10").APIMessageComponentInteraction, component: BetterComponent) => unknown)} */
			this.callback = null
		}

		static get #nextID() {
			return `menu-${randomString}-${idSequence++}`;
		}

		/** @param {(interaction: import("discord-api-types/v10").APIMessageComponentInteraction, component: BetterComponent) => unknown} fn */
		setCallback(fn) {
			this.callback = fn
		}

		destroy() {
			components.delete(this.id);
			return this
		}
	}
}

module.exports = cc

/**
 * @param {string} text
 * @param {number} openPos
 * @param {"}" | "]"} expecting
 * @returns {number}
 */
function findClosing(text, openPos, expecting) {
	let closePos = openPos;
	let counter = 1;
	const opener = expecting === "]" ? "[" : "{";
	while (counter > 0) {
		if (text.length === closePos) throw new Error(`Unbalanced ${expecting}`)
		const c = text[++closePos];
		if (c === opener) counter++;
		else if (c === expecting) counter--;
	}
	return closePos;
}
