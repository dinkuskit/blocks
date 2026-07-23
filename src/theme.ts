export const DINKUS_THEME_TOKENS = {
	sectionSpacing: "--dinkus-section-spacing",
	contentGap: "--dinkus-content-gap",
	itemGap: "--dinkus-item-gap",
	panelPadding: "--dinkus-panel-padding",
	panelBorder: "--dinkus-panel-border",
	panelRadius: "--dinkus-panel-radius",
	panelSurface: "--dinkus-panel-surface",
	copyMaxWidth: "--dinkus-copy-max-width",
	titleSize: "--dinkus-title-size",
	titleLineHeight: "--dinkus-title-line-height",
	actionBackground: "--dinkus-action-background",
	actionColor: "--dinkus-action-color",
	actionRadius: "--dinkus-action-radius",
	mutedOpacity: "--dinkus-muted-opacity",
} as const;

export type DinkusThemeToken =
	(typeof DINKUS_THEME_TOKENS)[keyof typeof DINKUS_THEME_TOKENS];
