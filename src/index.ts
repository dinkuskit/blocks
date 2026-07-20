import type { Element } from "@emdash-cms/blocks";
import {
	definePlugin,
	type PluginDescriptor,
	type PluginDefinition,
	type ResolvedPlugin,
} from "emdash";

export const DINKUS_BLOCKS_PLUGIN_ID = "dinkus-blocks";
export const CTA_BAND_BLOCK_TYPE = "dinkus.cta-band";

export const ctaBandFields = [
	{
		type: "text_input",
		action_id: "eyebrow",
		label: "Eyebrow",
	},
	{
		type: "text_input",
		action_id: "heading",
		label: "Heading",
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
] satisfies Element[];

const definition: PluginDefinition = {
	id: DINKUS_BLOCKS_PLUGIN_ID,
	version: "0.0.0",
	capabilities: [],
	admin: {
		portableTextBlocks: [
			{
				type: CTA_BAND_BLOCK_TYPE,
				label: "CTA Band",
				category: "Sections",
				description: "A focused call-to-action section",
				fields: ctaBandFields,
			},
		],
	},
};

export function dinkusBlocks(): PluginDescriptor {
	return {
		id: DINKUS_BLOCKS_PLUGIN_ID,
		version: definition.version,
		entrypoint: "@dinkuskit/blocks",
		componentsEntry: "@dinkuskit/blocks/astro",
	};
}

export function createPlugin(): ResolvedPlugin {
	return definePlugin(definition);
}

export default createPlugin;
