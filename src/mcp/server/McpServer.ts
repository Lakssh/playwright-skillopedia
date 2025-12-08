/**
 * MCP Server for Playwright Test Automation
 * Provides AI-assisted tools for test generation and analysis
 */

export interface McpTool {
  name: string;
  description: string;
  execute: (params: unknown) => Promise<unknown>;
}

export class McpServer {
  private tools: Map<string, McpTool> = new Map();

  /**
   * Register a new tool
   * @param tool - Tool to register
   */
  registerTool(tool: McpTool): void {
    this.tools.set(tool.name, tool);
  }

  /**
   * Execute a tool
   * @param toolName - Name of the tool to execute
   * @param params - Parameters for the tool
   */
  async executeTool(toolName: string, params: unknown): Promise<unknown> {
    const tool = this.tools.get(toolName);
    
    if (!tool) {
      throw new Error(`Tool '${toolName}' not found`);
    }

    return await tool.execute(params);
  }

  /**
   * Get all registered tools
   */
  getTools(): McpTool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get tool by name
   * @param name - Tool name
   */
  getTool(name: string): McpTool | undefined {
    return this.tools.get(name);
  }
}
