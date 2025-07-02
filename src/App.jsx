// src/App.jsx
import { useNodesState, useEdgesState } from 'react-flow-renderer';
import { useState, useRef, useCallback, useEffect } from 'react'; // Import useEffect
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from './components/ui/button.jsx';
import { Settings, Download, Bot } from 'lucide-react';
import ComponentLibrary from './components/ComponentLibrary';
import InfraCanvas from './components/InfraCanvas';
import PropertiesPanel from './components/PropertiesPanel';
import CodePanel from './components/CodePanel';
import SmartSuggestions from './components/SmartSuggestions';
import AIAssistant from './components/AIAssistant';
import './App.css';

function App() {
  // Load from localStorage on App Start
  // Load data from 'infraGraphData' in localStorage
  const saved = localStorage.getItem('infraGraphData');
  const parsed = saved ? JSON.parse(saved) : { nodes: [], edges: [] };
  const [nodes, setNodes, onNodesChange] = useNodesState(parsed.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(parsed.edges || []);

  const [selectedNode, setSelectedNode] = useState(null);
  const [message, setMessage] = useState(null); // State for message box

  const canvasRef = useRef(null); // Create a ref for the InfraCanvas component

  // Auto-save to localStorage on change
  // This useEffect hook will run whenever 'nodes' or 'edges' state changes,
  // saving the current state of the flow to localStorage under 'infraGraphData'.
  useEffect(() => {
    const saveData = {
      nodes,
      edges,
    };
    localStorage.setItem('infraGraphData', JSON.stringify(saveData));
  }, [nodes, edges]);

  // Effect for deleting node with keyboard Delete key
  // This useEffect hook listens for the 'keydown' event to enable deleting selected nodes
  useEffect(() => {
    const handleKeyDown = (e) => {
      // If the 'Delete' key is pressed and a node is currently selected
      if (e.key === 'Delete' && selectedNode) {
        // Filter out the selected node from the nodes array
        setNodes((prev) => prev.filter((node) => node.id !== selectedNode.id));
        // Deselect the node after deletion
        setSelectedNode(null);
        // Show a confirmation message
        showMessage('Component deleted');
      }
    };

    // Add the event listener when the component mounts
    window.addEventListener('keydown', handleKeyDown);
    // Remove the event listener when the component unmounts or selectedNode changes
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, setNodes]); // Dependencies: selectedNode and setNodes (to prevent stale closure)


  // Function to show a message in a custom message box
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000); // Hide after 3 seconds
  };

  // This makes editing properties work in UI and state
  const updateComponent = (nodeId, key, value) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                properties: {
                  ...node.data.properties,
                  [key]: value,
                },
              },
            }
          : node
      )
    );

    // Also update selected node so sidebar stays in sync
    if (selectedNode?.id === nodeId) {
      setSelectedNode((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          properties: {
            ...prev.data.properties,
            [key]: value,
          },
        },
      }));
    }
  };

  // Handler to export the current nodes as a JSON file
  const handleExport = () => {
    if (!nodes.length) {
      showMessage('No components to export.'); // Using custom message box
      return;
    }

    const data = {
      nodes: nodes.map((node) => ({
        id: node.id,
        position: node.position,
        type: node.type,
        data: {
          type: node.data.type,
          label: node.data.label,
          name: node.data.name,
          icon: node.data.icon?.name || null, // optional
          properties: node.data.properties,
        },
      })),
      edges: edges.map((edge) => ({ // Include edges in export
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: edge.type,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'infrastructure.json';
    a.click();
    URL.revokeObjectURL(url);
    showMessage('Diagram exported successfully!'); // Confirmation message
  };

  // Handler to import JSON file
  const handleJSONImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const { nodes, edges } = JSON.parse(event.target.result);

        if (!Array.isArray(nodes) || !Array.isArray(edges)) {
          throw new Error('Invalid JSON structure: missing nodes or edges array.');
        }

        setNodes(nodes);
        setEdges(edges);
        showMessage('Diagram imported successfully!');
      } catch (err) {
        console.error('❌ Failed to parse JSON:', err);
        showMessage(`Invalid JSON file: ${err.message}. Please ensure it contains 'nodes' and 'edges' arrays.`);
      }
    };
    reader.readAsText(file);
  };

  const handleGenerateArchitecture = (prompt) => {
    // This will be extended in future to handle AI-based generation
    showMessage(`AI received prompt: "${prompt}"`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden font-mono">
        {/* Header */}
        <header className="bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold font-mono">InfraGraph</h1>
            <div className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-md">v1.0.0</div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Hidden file input for JSON import */}
            <input
              type="file"
              accept="application/json"
              id="jsonUpload"
              style={{ display: 'none' }}
              onChange={handleJSONImport}
            />
            {/* Import JSON Button */}
            <Button variant="ghost" size="sm" onClick={() => document.getElementById('jsonUpload').click()}>
              📂 Import JSON
            </Button>
            {/* Export JSON Button */}
            <Button variant="ghost" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            {/* Export PNG Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (canvasRef.current?.exportCanvasImage) {
                  canvasRef.current.exportCanvasImage();
                  // Message will be shown by the exportCanvasImage function itself
                } else {
                  showMessage('Canvas not ready for image export.');
                }
              }}
            >
              <span role="img" aria-label="image export">🖼️</span> Export PNG
            </Button>
            {/* Clear Canvas Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setNodes([]);
                setEdges([]);
                localStorage.removeItem('infraGraphData'); // Changed from 'infra-flow'
                showMessage('Canvas cleared!');
              }}
            >
              🧹 Clear Canvas
            </Button>
            {/* Zoom to Fit Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Call zoomToFit method on InfraCanvas ref
                if (canvasRef.current?.zoomToFit) {
                  canvasRef.current.zoomToFit();
                }
              }}
            >
              🔍 Zoom to Fit
            </Button>
            <Button variant="ghost" size="sm">
              <Bot className="w-4 h-4 mr-2" />
              AI Assistant
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Custom Message Box */}
        {message && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg z-50">
            {message}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          <ComponentLibrary />

          <main className="flex-1 bg-zinc-950 relative overflow-hidden">
            <InfraCanvas
              nodes={nodes}
              setNodes={setNodes}
              onNodesChange={onNodesChange}
              edges={edges}
              setEdges={setEdges}
              onEdgesChange={onEdgesChange}
              onSelectNode={setSelectedNode}
              ref={canvasRef} // Pass the ref to InfraCanvas
            />
            {/* Quick Add Button */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  const newNode = {
                    id: `node-${Math.random().toString(36).substr(2, 9)}`,
                    position: { x: 300, y: 300 },
                    data: {
                      label: 'New Server',
                      type: 'server',
                      name: 'Server',
                      icon: null,
                      properties: {
                        instanceType: 't3.micro',
                        region: 'us-east-1',
                        storage: '20',
                      },
                    },
                    type: 'infra',
                  };
                  setNodes((prev) => [...prev, newNode]);
                  showMessage('Quick node added!');
                }}
              >
                ⚡ Quick Add Server
              </Button>
            </div>
          </main>

          <div className="w-96 border-l border-zinc-800 flex flex-col">
            <PropertiesPanel
              selectedComponent={selectedNode}
              onUpdateComponent={updateComponent}
            />
            <SmartSuggestions selectedComponent={selectedNode} />
            <AIAssistant onGenerate={handleGenerateArchitecture} />
          </div>
        </div>

        <CodePanel components={nodes} />
      </div>
    </DndProvider>
  );
}

export default App;
