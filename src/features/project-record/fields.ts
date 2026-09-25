import type { Element } from "@emdash-cms/blocks";

export const projectRecordFields = [
	{
		type: "text_input",
		action_id: "recordId",
		label: "Record ID",
		placeholder: "project-slug",
	},
	{
		type: "text_input",
		action_id: "category",
		label: "Category",
	},
	{
		type: "text_input",
		action_id: "title",
		label: "Title",
	},
	{
		type: "text_input",
		action_id: "summary",
		label: "Summary",
		multiline: true,
	},
	{
		type: "media_picker",
		action_id: "identityImage",
		label: "Identity artwork",
	},
	{
		type: "text_input",
		action_id: "identityAlt",
		label: "Identity artwork alt text",
	},
	{
		type: "text_input",
		action_id: "statusKicker",
		label: "Status kicker",
	},
	{
		type: "text_input",
		action_id: "status",
		label: "Status",
	},
	{
		type: "text_input",
		action_id: "roleKicker",
		label: "Role kicker",
	},
	{
		type: "text_input",
		action_id: "roleHeadline",
		label: "Role headline",
	},
	{
		type: "text_input",
		action_id: "roleBody",
		label: "Role body",
		multiline: true,
	},
	{
		type: "text_input",
		action_id: "evidenceKicker",
		label: "Evidence kicker",
	},
	{
		type: "text_input",
		action_id: "proofHeadline",
		label: "Proof headline",
	},
	{
		type: "text_input",
		action_id: "evidence",
		label: "Evidence",
		multiline: true,
	},
	{
		type: "repeater",
		action_id: "links",
		label: "Evidence links",
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
				label: "URL",
			},
		],
	},
	{
		type: "text_input",
		action_id: "nextKicker",
		label: "Next-project kicker",
	},
	{
		type: "text_input",
		action_id: "nextTitle",
		label: "Next-project title",
	},
	{
		type: "text_input",
		action_id: "nextHref",
		label: "Next-project URL",
	},
] satisfies Element[];
