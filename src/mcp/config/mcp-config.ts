/**
 * MCP Server Configuration
 */

export const mcpConfig = {
  serverName: 'Playwright SkillSprig MCP Server',
  version: '1.0.0',
  description: 'AI-assisted tools for Playwright test automation',
  
  tools: [
    {
      name: 'test-generator',
      enabled: true,
    },
    {
      name: 'selector-finder',
      enabled: true,
    },
    {
      name: 'test-analyzer',
      enabled: true,
    },
    {
      name: 'data-suggester',
      enabled: true,
    },
  ],
};
