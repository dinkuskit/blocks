import type { Element } from "@emdash-cms/blocks";

export const dispatchFields = [
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
		placeholder: "/contact",
	},
	{
		type: "text_input",
		action_id: "phone",
		label: "Phone",
		placeholder: "tel:+15551234567",
	},
	{
		type: "text_input",
		action_id: "email",
		label: "Email",
		placeholder: "mailto:hello@example.com",
	},
] satisfies Element[];
