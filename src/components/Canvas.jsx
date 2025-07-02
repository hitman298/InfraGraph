import { useDrop } from 'react-dnd'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef } from 'react'
import CanvasComponent from './CanvasComponent'

const Canvas = ({ components, setComponents, selectedComponent, setSelectedComponent }) => {
  const canvasRef = useRef(null)
  const [connections, setConnections] = useState([])

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset()
      const canvasRect = canvasRef.current.getBoundingClientRect()
      
      // Snap to grid (20px grid)
      const gridSize = 20
      const x = Math.round((offset.x - canvasRect.left - 60) / gridSize) * gridSize
      const y = Math.round((offset.y - canvasRect.top - 40) / gridSize) * gridSize
      
      const newComponent = {
        id: Date.now(),
        type: item.type,
        name: item.name,
        icon: item.icon,
        x: Math.max(0, Math.min(x, canvasRect.width - 120)),
        y: Math.max(0, Math.min(y, canvasRect.height - 80)),
        properties: getDefaultProperties(item.type)
      }
      
      setComponents(prev => [...prev, newComponent])
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  const getDefaultProperties = (type) => {
    const defaults = {
      server: {
        instanceType: 't3.micro',
        region: 'us-east-1',
        storage: '20GB',
        vpc: 'default'
      },
      database: {
        engine: 'mysql',
        instanceClass: 'db.t3.micro',
        storage: '20GB',
        multiAZ: false
      },
      storage: {
        storageClass: 'Standard',
        versioning: false,
        encryption: true,
        size: '100GB'
      },
      loadbalancer: {
        type: 'Application',
        scheme: 'internet-facing',
        ipAddressType: 'ipv4'
      },
      vpc: {
        cidr: '10.0.0.0/16',
        enableDnsHostnames: true,
        enableDnsSupport: true
      }
    }
    return defaults[type] || {}
  }

  const moveComponent = (id, x, y) => {
    // Snap to grid when moving
    const gridSize = 20
    const snappedX = Math.round(x / gridSize) * gridSize
    const snappedY = Math.round(y / gridSize) * gridSize
    
    setComponents(prev => 
      prev.map(comp => 
        comp.id === id ? { ...comp, x: snappedX, y: snappedY } : comp
      )
    )
  }

  const selectComponent = (component) => {
    setSelectedComponent(component)
  }

  const deleteComponent = (id) => {
    setComponents(prev => prev.filter(comp => comp.id !== id))
    if (selectedComponent && selectedComponent.id === id) {
      setSelectedComponent(null)
    }
  }

  return (
    <div className="w-full h-full relative flex flex-col">
      {/* Canvas Header with Stats */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/30">
        <h2 className="text-sm font-medium text-zinc-100 font-mono">Canvas</h2>
        <div className="flex items-center space-x-4 text-xs text-zinc-500 font-mono">
          <span>Components: {components.length}</span>
          <span>Connections: {connections.length}</span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div 
        ref={(node) => {
          drop(node)
          canvasRef.current = node
        }}
        className={`flex-1 relative transition-all duration-300 ${
          isOver && canDrop 
            ? 'bg-blue-950/20' 
            : 'bg-zinc-950'
        }`}
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(113, 113, 122, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      >
        {/* Drop zone indicator */}
        <AnimatePresence>
          {isOver && canDrop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-4 border-2 border-dashed border-blue-500/50 rounded-xl flex items-center justify-center bg-blue-950/10 backdrop-blur-sm"
            >
              <div className="text-center text-blue-400">
                <div className="text-lg font-medium mb-2 font-mono">Drop Component Here</div>
                <div className="text-sm opacity-75 font-mono">Release to add to canvas</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Canvas components */}
        <AnimatePresence>
          {components.map((component) => (
            <CanvasComponent
              key={component.id}
              component={component}
              isSelected={selectedComponent?.id === component.id}
              onMove={moveComponent}
              onSelect={selectComponent}
              onDelete={deleteComponent}
            />
          ))}
        </AnimatePresence>

        {/* Connection lines (SVG overlay) */}
        {connections.length > 0 && (
          <svg className="absolute inset-0 pointer-events-none">
            {connections.map((connection, index) => (
              <line
                key={index}
                x1={connection.from.x}
                y1={connection.from.y}
                x2={connection.to.x}
                y2={connection.to.y}
                stroke="rgb(59 130 246 / 0.6)"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            ))}
          </svg>
        )}

        {/* Empty state */}
        {components.length === 0 && !isOver && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center text-zinc-500">
              <motion.div 
                className="text-xl font-medium mb-3 font-mono"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Start Building Your Infrastructure
              </motion.div>
              <div className="text-sm font-mono opacity-75">
                Drag components from the sidebar to begin designing
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Canvas

