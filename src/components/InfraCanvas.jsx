// src/components/InfraCanvas.jsx
import React, { useRef, useCallback, useEffect, forwardRef, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useEdgesState,
  ReactFlowProvider,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow, // ✅ Import useReactFlow
} from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';
import { useDrop } from 'react-dnd';
import * as domtoimage from 'dom-to-image-more';
import InfraNode from './InfraNode';
import { getComponentProperties } from './PropertiesPanel';
import { ItemTypes } from '../utils/ItemTypes'; // ✅ Fixed import: '=>' changed to 'from'

// Generate a random node ID
function generateUUID() {
  return 'node-' + Math.random().toString(36).substring(2, 10);
}

// 🧠 Inner canvas component (now simpler, no longer handles drop logic or useZoomPanHelper directly)
const FlowCanvasContent = ({
  nodes,
  setNodes, // Still needed for onNodesChange
  onNodesChange,
  edges,
  setEdges, // Still needed for onEdgesChange and onConnect
  onEdgesChange,
  onConnect,
  onNodeClick,
  exposeRef, // ✅ Accept exposeRef as a prop
}) => {
  // ✅ Memoize nodeTypes inside the component
  const memoizedNodeTypes = useMemo(() => ({ infra: InfraNode }), []);
  const { fitView } = useReactFlow(); // ✅ Get fitView from useReactFlow

  // ✅ Expose fitView to the parent component via the forwarded ref
  useEffect(() => {
    if (exposeRef && exposeRef.current) {
      // Assign the fitView function directly to a property on the ref
      exposeRef.current.zoomToFit = () => fitView({ padding: 0.2 });
    }
  }, [fitView, exposeRef]); // Dependencies: fitView and exposeRef

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      nodeTypes={memoizedNodeTypes} // Use the memoized nodeTypes
      fitView // This prop makes it fit view on initial load
    >
      {/* Add className to hide MiniMap and Controls during export */}
      <MiniMap className="hide-during-export" />
      <Controls className="hide-during-export" />
      <Background gap={16} size={1} color="#444" />
    </ReactFlow>
  );
};

// 🧩 Main Component - now wrapped with forwardRef
const InfraCanvas = forwardRef(({ nodes, setNodes, onSelectNode }, exposeRef) => {
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const dropRef = useRef(null); // ✅ New ref for the DOM element for drag-drop

  // useDrop hook for handling drag-and-drop logic, now directly in InfraCanvas
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.COMPONENT,
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      // Use dropRef.current for DOM element access
      if (!dropRef.current || !clientOffset) return;

      const bounds = dropRef.current.getBoundingClientRect();
      // Position calculation using plain math
      const position = {
        x: clientOffset.x - bounds.left,
        y: clientOffset.y - bounds.top,
      };

      const newNode = {
        id: generateUUID(),
        position,
        data: {
          label: item.label,
          type: item.type,
          name: item.name,
          icon: item.icon,
          properties: Object.fromEntries(
            getComponentProperties(item.type).map((prop) => [prop.key, prop.default || ''])
          ),
        },
        type: 'infra',
      };

      setNodes((prev) => [...prev, newNode]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  // Assign the drop handler to the main div using dropRef
  useEffect(() => {
    if (dropRef.current) {
      drop(dropRef.current);
    }
  }, [dropRef, drop]); // Dependency on 'dropRef'

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const handleNodeClick = useCallback(
    (e, node) => {
      onSelectNode(node);
    },
    [onSelectNode]
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // 🔁 Image Export Logic exposed via forwarded ref (exposeRef)
  useEffect(() => {
    // Ensure the exposeRef object is available before assigning properties
    if (!exposeRef) return;

    // Assign methods to exposeRef.current
    exposeRef.current = {
      ...exposeRef.current, // Preserve existing properties if any
      exportCanvasImage: () => {
        const canvasContainer = document.querySelector('.react-flow');
        if (!canvasContainer) {
          console.error('React Flow container not found.');
          return;
        }

        // STEP 1: Open new window immediately (this avoids popup blocking)
        const newWindow = window.open('', '_blank');
        if (!newWindow) {
          alert('Popup blocked. Please enable popups for this site to export the image.');
          return;
        }

        // Write a temporary loading state
        newWindow.document.write(`
          <html>
            <head><title>Generating Image...</title></head>
            <body style="background:#0c0c0c; color:white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh;">
              <h2>Generating snapshot...</h2>
            </body>
          </html>
        `);

        // STEP 2: Take screenshot using dom-to-image-more
        domtoimage.toPng(canvasContainer, {
          filter: (node) => !node.classList?.contains('hide-during-export'), // Filter out elements with 'hide-during-export' class
          bgcolor: '#0c0c0c',     // background fallback
        })
          .then((dataUrl) => {
            // Replace newWindow content with image and download
            newWindow.document.body.innerHTML = `
              <h2 style="color:white; font-family:sans-serif;">InfraGraph Snapshot</h2>
              <img src="${dataUrl}" alt="Canvas" style="max-width:100%; height:auto;"/>
              <br/>
              <a href="${dataUrl}" download="infra-canvas.png"
                  style="font-size:18px; padding:10px 20px; background:#444; color:white; text-decoration:none; border-radius:6px; display:inline-block;">
                ⬇️ Download PNG
              </a>
            `;
          })
          .catch((err) => {
            console.error('❌ dom-to-image export failed:', err);
            newWindow.document.body.innerHTML = '<h2 style="color:red;">❌ Failed to generate image.</h2>';
          })
          .finally(() => {
            // No style restoration needed as no styles were temporarily injected
          });
      },
      // The zoomToFit method is now set directly by FlowCanvasContent
      // so we don't need to define it here.
      // The parent component (App.jsx) will directly call exposeRef.current.zoomToFit()
      // which is set by FlowCanvasContent.
    };
  }, [exposeRef]);

  return (
    <div className="w-full h-full" ref={dropRef}>
      <ReactFlowProvider>
        <FlowCanvasContent
          nodes={nodes}
          setNodes={setNodes}
          onNodesChange={onNodesChange}
          edges={edges}
          setEdges={setEdges}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          // Pass the exposeRef down to FlowCanvasContent so it can set fitView
          exposeRef={exposeRef} // ✅ Ensure exposeRef is passed as a prop
        />
      </ReactFlowProvider>
    </div>
  );
});

export default InfraCanvas;
