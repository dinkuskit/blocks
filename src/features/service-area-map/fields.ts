import type { Element } from "@emdash-cms/blocks";

export const serviceAreaMapFields = [
	{
		type: "media_picker",
		action_id: "image",
		label: "Map image",
	},
	{
		type: "text_input",
		action_id: "imageAlt",
		label: "Map image alt text",
	},
	{
		type: "text_input",
		action_id: "caption",
		label: "Caption",
		multiline: true,
	},
	{
		type: "repeater",
		action_id: "legend",
		label: "Legend",
		item_label: "Legend entry",
		fields: [
			{
				type: "text_input",
				action_id: "label",
				label: "Label",
			},
			{
				type: "text_input",
				action_id: "icon",
				label: "Icon slug",
			},
		],
	},
] satisfies Element[];
