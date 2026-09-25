import type { Element } from "@emdash-cms/blocks";

export const searchBoardFields = [
	{
		type: "text_input",
		action_id: "number",
		label: "Section number",
		placeholder: "LOC",
	},
	{
		type: "text_input",
		action_id: "kicker",
		label: "Kicker",
	},
	{
		type: "text_input",
		action_id: "title",
		label: "Title",
	},
	{
		type: "text_input",
		action_id: "intro",
		label: "Intro",
		multiline: true,
	},
	{
		type: "repeater",
		action_id: "links",
		label: "Links",
		item_label: "Link",
		fields: [
			{
				type: "text_input",
				action_id: "label",
				label: "Label",
			},
			{
				type: "text_input",
				action_id: "href",
				label: "Link URL",
			},
		],
	},
] satisfies Element[];
