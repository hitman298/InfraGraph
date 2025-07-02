import { useDrag } from 'react-dnd'
import { motion } from 'framer-motion'

const DraggableComponent = ({ icon: Icon, name, type, description }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type, name, icon: Icon },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return (
    <motion.div
      ref={drag}
      className={`group relative cursor-pointer transition-all duration-200 ${
        isDragging 
          ? 'opacity-50 scale-95' 
          : 'opacity-100 hover:scale-[1.02]'
      }`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`
        bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4
        hover:bg-zinc-800/70 hover:border-zinc-600/50 hover:shadow-lg hover:shadow-zinc-900/20
        transition-all duration-200 backdrop-blur-sm
        ${isDragging ? 'ring-2 ring-blue-500/30' : ''}
      `}>
        <div className="flex items-start space-x-3">
          <div className={`
            flex-shrink-0 p-2 rounded-lg transition-colors duration-200
            ${getComponentColor(type)}
            group-hover:scale-110 group-hover:shadow-md
          `}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-zinc-100 truncate font-mono">
              {name}
            </div>
            <div className="text-xs text-zinc-500 truncate font-mono mt-0.5">
              {description}
            </div>
          </div>
        </div>
        
        {/* Subtle drag indicator */}
        <div className={`
          absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-zinc-600
          transition-all duration-200
          ${isDragging ? 'bg-blue-400 scale-125' : 'group-hover:bg-zinc-500'}
        `} />
      </div>
    </motion.div>
  )
}

const getComponentColor = (type) => {
  const colors = {
    server: 'bg-blue-600 hover:bg-blue-500',
    database: 'bg-emerald-600 hover:bg-emerald-500',
    storage: 'bg-amber-600 hover:bg-amber-500',
    loadbalancer: 'bg-purple-600 hover:bg-purple-500',
    vpc: 'bg-indigo-600 hover:bg-indigo-500',
    cdn: 'bg-pink-600 hover:bg-pink-500',
    security: 'bg-red-600 hover:bg-red-500',
    lambda: 'bg-orange-600 hover:bg-orange-500',
    monitoring: 'bg-teal-600 hover:bg-teal-500',
    gateway: 'bg-cyan-600 hover:bg-cyan-500',
    iam: 'bg-slate-600 hover:bg-slate-500',
  }
  return colors[type] || 'bg-zinc-600 hover:bg-zinc-500'
}

export default DraggableComponent

