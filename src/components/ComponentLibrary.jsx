// src/components/ComponentLibrary.jsx
import { motion } from 'framer-motion';
import {
  Server,
  Database,
  HardDrive,
  LoaderIcon as LoadBalancer,
  Network,
  Cloud,
  Shield,
  Cpu,
  Monitor,
  Globe,
  Lock,
  Layers,
} from 'lucide-react';
import { useDrag } from 'react-dnd';

function DraggableComponent({ icon: Icon, name, type, description }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'infra-component',
    item: { type, label: name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex items-center gap-2 p-2 rounded-md bg-zinc-800 text-sm text-zinc-100 border border-zinc-700 cursor-move transition ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <Icon className="w-4 h-4 text-blue-400" />
      <div className="flex flex-col">
        <span className="font-medium">{name}</span>
        <span className="text-xs text-zinc-400">{description}</span>
      </div>
    </div>
  );
}

const ComponentLibrary = () => {
  const componentCategories = [
    {
      title: 'Compute',
      components: [
        {
          icon: Server,
          name: 'EC2 Instance',
          type: 'server',
          description: 'Virtual server',
        },
        {
          icon: Cpu,
          name: 'Lambda',
          type: 'lambda',
          description: 'Serverless function',
        },
        {
          icon: LoadBalancer,
          name: 'Load Balancer',
          type: 'loadbalancer',
          description: 'Traffic distribution',
        },
      ],
    },
    {
      title: 'Storage',
      components: [
        {
          icon: Database,
          name: 'RDS Database',
          type: 'database',
          description: 'Managed database',
        },
        {
          icon: HardDrive,
          name: 'S3 Storage',
          type: 'storage',
          description: 'Object storage',
        },
      ],
    },
    {
      title: 'Network',
      components: [
        {
          icon: Network,
          name: 'VPC',
          type: 'vpc',
          description: 'Virtual network',
        },
        {
          icon: Globe,
          name: 'Internet Gateway',
          type: 'gateway',
          description: 'Internet access',
        },
        {
          icon: Cloud,
          name: 'CloudFront',
          type: 'cdn',
          description: 'Content delivery',
        },
        {
          icon: Shield,
          name: 'Security Group',
          type: 'security',
          description: 'Firewall rules',
        },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-zinc-900/50 border-r border-zinc-800 flex flex-col overflow-hidden">
      <div className="p-6 border-b border-zinc-800">
        <h2 className="text-sm font-medium text-zinc-100 flex items-center font-mono">
          <Layers className="w-4 h-4 mr-2 text-zinc-400" />
          Components
        </h2>
        <p className="text-xs text-zinc-500 mt-1 font-mono">Drag to canvas to build</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {componentCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <h3 className="text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wider font-mono">
              {category.title}
            </h3>
            <div className="space-y-2">
              {category.components.map((component, index) => (
                <motion.div
                  key={component.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
                >
                  <DraggableComponent {...component} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Component Stats */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
        <div className="text-xs text-zinc-500 space-y-1 font-mono">
          <div className="flex justify-between">
            <span>Total Components</span>
            <span className="text-zinc-400 font-medium">10</span>
          </div>
          <div className="flex justify-between">
            <span>Categories</span>
            <span className="text-zinc-400 font-medium">3</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ComponentLibrary;