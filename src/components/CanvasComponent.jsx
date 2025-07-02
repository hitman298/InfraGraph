import { useDrag } from 'react-dnd'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { X, MoreHorizontal } from 'lucide-react'

const CanvasComponent = ({ component, isSelected, onMove, onSelect, onDelete }) => {
  const [isDragging, setIsDragging] = useState(false)
  
  const [{ isDragging: dragMonitor }, drag] = useDrag(() => ({
    type: 'canvas-component',
    item: { id: component.id, x: component.x, y: component.y },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        const delta = monitor.getDifferenceFromInitialOffset()
        const newX = Math.max(0, item.x + delta.x)
        const newY = Math.max(0, item.y + delta.y)
        onMove(item.id, newX, newY)
      }
      setIsDragging(false)
    },
  }))

  const handleClick = (e) => {
    e.stopPropagation()
    onSelect(component)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete(component.id)
  }

  const Icon = component.icon

  return (
    <motion.div
      ref={drag}
      className={`absolute cursor-move select-none transition-all duration-200 ${
        isDragging || dragMonitor ? 'z-50' : 'z-10'
      }`}
      style={{
        left: component.x,
        top: component.y,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05, rotate: 1 }}
      onClick={handleClick}
    >
      <div
        className={`
          group relative bg-zinc-800/90 backdrop-blur-sm border rounded-xl p-4 min-w-[140px] min-h-[80px]
          transition-all duration-200 shadow-lg
          ${isSelected 
            ? 'border-blue-500/50 shadow-blue-500/20 ring-1 ring-blue-500/30' 
            : 'border-zinc-700/50 hover:border-zinc-600/50'
          }
          ${isDragging || dragMonitor ? 'shadow-2xl shadow-zinc-900/50' : ''}
        `}
      >
        {/* Component content */}
        <div className="flex items-start space-x-3">
          <div className={`flex-shrink-0 p-2 rounded-lg ${getComponentColor(component.type)}`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-zinc-100 truncate font-mono">
              {component.name}
            </div>
            <div className="text-xs text-zinc-500 truncate font-mono mt-0.5">
              {getComponentSubtitle(component)}
            </div>
          </div>
        </div>

        {/* Component actions */}
        <div className={`
          absolute -top-2 -right-2 flex space-x-1 transition-all duration-200
          ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}>
          <button
            onClick={handleDelete}
            className="w-6 h-6 bg-red-500/90 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>

        {/* Connection points */}
        {isSelected && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Top */}
            <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-zinc-800"></div>
            {/* Right */}
            <div className="absolute top-1/2 -right-1.5 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-zinc-800"></div>
            {/* Bottom */}
            <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-zinc-800"></div>
            {/* Left */}
            <div className="absolute top-1/2 -left-1.5 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-zinc-800"></div>
          </div>
        )}

        {/* Status indicator */}
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-800"></div>
      </div>
    </motion.div>
  )
}

const getComponentColor = (type) => {
  const colors = {
    server: 'bg-blue-600',
    database: 'bg-emerald-600',
    storage: 'bg-amber-600',
    loadbalancer: 'bg-purple-600',
    vpc: 'bg-indigo-600',
    cdn: 'bg-pink-600',
    security: 'bg-red-600',
    lambda: 'bg-orange-600',
    monitoring: 'bg-teal-600',
    gateway: 'bg-cyan-600',
    iam: 'bg-slate-600',
  }
  return colors[type] || 'bg-zinc-600'
}

const getComponentSubtitle = (component) => {
  const subtitles = {
    server: component.properties?.instanceType || 't3.micro',
    database: component.properties?.engine || 'MySQL',
    storage: component.properties?.storageClass || 'Standard',
    loadbalancer: component.properties?.type || 'Application',
    vpc: component.properties?.cidr || '10.0.0.0/16',
    cdn: 'Global CDN',
    security: 'Firewall',
    lambda: 'Function',
    monitoring: 'Metrics',
    gateway: 'Internet',
    iam: 'Access Control',
  }
  return subtitles[component.type] || 'Resource'
}

export default CanvasComponent

