import {Client} from '@modelcontextprotocol/sdk/client/index.js'
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js'

export function MCPClient(){
  const client = new Client({name: 'mcp-client-cli', version: '1.0.0'})
  let transport: StdioClientTransport
  let tools: any[] = []
  const connectToServer = async(serverScriptPath: string) => {
    try{
      const isJs = serverScriptPath.endsWith('.js') || serverScriptPath.endsWith('.mjs')
      
      const isPy = serverScriptPath.endsWith('.py')
      if(!isJs && !isPy){
        throw new Error('Server script must be a .js or .py file')
      }
      const command = isPy ? process.platform === 'win32' ? 'python' : 'python3' : process.execPath
      transport = new StdioClientTransport({
        command,
        args: [serverScriptPath]
      })
      client.connect(transport)

      const toolsResult = await client.listTools()
      tools = toolsResult.tools.map((tool) => {
        return {
          name: tool.name,
          description: tool.description,
          input_schema: tool.inputSchema
        }
      })
      console.log('Connected to server with tools:', tools.map(({name})=> name))
    }catch(e) {
      console.error('Failed to connect to MCP server:', e)
      throw e
    }
  }

  const getTools = () => {
    return tools
  }

  return {
    connectToServer,
    getTools
  }
}