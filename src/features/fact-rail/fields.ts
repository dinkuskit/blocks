import type { Element } from "@emdash-cms/blocks";

export const factRailFields = [
	{
		type: "text_input",
		action_id: "ariaLabel",
		label: "Accessible label",
		placeholder: "Quick facts",
	},
	{
		type: "repeater",
		action_id: "facts",
		label: "Facts",
		item_label: "Fact",
		fields: [
			{
				type: "text_input",
				action_id: "label",
				label: "Label",
			},
			{
				type: "text_input",
				action_id: "value",
				label: "Value",
			},
			{
				type: "text_input",
				action_id: "icon",
				label: "Icon slug",
			},
		],
	},
] satisfies Element[];
