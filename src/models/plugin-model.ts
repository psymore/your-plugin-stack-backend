export interface Plugin {
  id: number;
  pluginName: string;
  pluginDescription?: string;
  pluginVersion?: string;
  pluginAuthor?: string;
  pluginLicense?: string;
  pluginRepository?: string;
  pluginHomepage?: string;
  pluginBugs?: string;
  pluginKeywords?: string;
  pluginEngines?: string;
  pluginOs?: string;
}
