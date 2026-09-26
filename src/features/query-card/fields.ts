import type { Element } from "@emdash-cms/blocks";

export const queryCardFields = [
	{
		type: "text_input",
		action_id: "source",
		label: "Source",
		placeholder: "notices",
	},
	{
		type: "text_input",
		action_id: "limit",
		label: "Limit",
		placeholder: "6",
	},
] satisfies Element[];
