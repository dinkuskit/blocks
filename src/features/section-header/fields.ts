import type { Element } from "@emdash-cms/blocks";

export const sectionHeaderFields = [
	{
		type: "text_input",
		action_id: "number",
		label: "Section number",
		placeholder: "01",
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
] satisfies Element[];
