/** @type {{ [route: string]: (button: import("discord-typings").ButtonAsNotStyleLink | import("discord-typings").SelectMenu) => unknown}} */
let handlers = {};
/** @type {(button: import("discord-typings").ButtonAsNotStyleLink | import("discord-typings").SelectMenu) => string} */
let routeHandler = (button) => button.custom_id;

/**
 * @template {any} T
 * @param {T} item
 * @returns {T is Record<any, any>}
 */
const isObject = (item) => typeof item === "object" && !Array.isArray(item) && item !== null;

const delimiter = "�";
const forbiddenKeys = ["__proto__", "prototype"];

module.exports = {
	/**
	 * @param {(button: import("discord-typings").ButtonAsNotStyleLink | import("discord-typings").SelectMenu) => string} router
	 * @param {{ [route: string]: (button: import("discord-typings").ButtonAsNotStyleLink | import("discord-typings").SelectMenu) => unknown}} info
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
		/** @param {string} item */
		const push = (item) => {
			if (isObject(item)) rt += `{${BetterComponent.encode(item)}}`; // obj
			else if (Array.isArray(item)) rt += `[${item.map((i, ind, arr) => isObject(i) ? `{${BetterComponent.encode(i)}}` : `${BetterComponent.encode(i)}${ind !== arr.length - 1 ? delimiter : ""}`).join("")}]`; // array
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
	 * @param {string} str
	 * @param {T} [type] The root type being passed. Should only be used internally
	 * @returns {T extends "object" ? Record<string, any> : Array<any>}
	 */
	decode(str, type = "object") {
		/** @type {T extends "object" ? Record<string, any> : Array<any>} */
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
				actualValue = BetterComponent.decode(text.slice(1, closingIndex));
				text = text.slice(closingIndex + 1);
			} else if (text[0] === "[") {
				const closingIndex = findClosing(text, 0, "]");
				actualValue = BetterComponent.decode(text.slice(1, closingIndex), "array");
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

	/** @param {import("discord-typings").Interaction} interaction */
	handle(interaction) {
		if (interaction.type !== 3 || !interaction.data) return;
		const route = routeHandler(interaction.data);
		if (!handlers[route]) return;
		handlers[route](interaction.data);
	}
}

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
