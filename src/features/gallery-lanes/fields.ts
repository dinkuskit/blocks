import type { Element } from "@emdash-cms/blocks";

export const galleryLanesFields = [
	{
		type: "repeater",
		action_id: "lanes",
		label: "Lanes",
		item_label: "Lane",
		fields: [
			{
				type: "text_input",
				action_id: "label",
				label: "Label",
			},
			{
				type: "text_input",
				action_id: "meta",
				label: "Meta",
			},
			{
				type: "text_input",
				action_id: "href",
				label: "Link URL",
			},
			{
				type: "text_input",
				action_id: "image",
				label: "Image URL",
			},
		],
	},
] satisfies Element[];
