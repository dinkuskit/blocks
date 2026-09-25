import type { Element } from "@emdash-cms/blocks";

export const ledgerCardsFields = [
	{
		type: "repeater",
		action_id: "cards",
		label: "Cards",
		item_label: "Card",
		fields: [
			{
				type: "text_input",
				action_id: "code",
				label: "Record code",
			},
			{
				type: "text_input",
				action_id: "title",
				label: "Title",
			},
			{
				type: "text_input",
				action_id: "body",
				label: "Body",
				multiline: true,
			},
			{
				type: "text_input",
				action_id: "ctaLabel",
				label: "CTA label",
			},
			{
				type: "text_input",
				action_id: "ctaHref",
				label: "CTA URL",
			},
		],
	},
] satisfies Element[];
