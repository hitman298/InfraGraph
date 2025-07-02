// src/components/PropertiesPanel.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, DollarSign, Bot, Package, TrendingUp, Zap, Shield, AlertTriangle, Info } from 'lucide-react';
// Assuming Button component exists in a sensible path, e.g., for shadcn/ui
// If you don't have a Button component, you'll need to define a simple one or remove it.
import { Button } from './ui/button'; // Adjust this path based on your project structure

const PropertiesPanel = ({ selectedComponent, onUpdateComponent }) => {
  const [activeTab, setActiveTab] = useState('properties');
  const [costEstimate, setCostEstimate] = useState(null);

  useEffect(() => {
    if (selectedComponent?.data) {
      const baseCost = getBaseCost(
        selectedComponent.data.type,
        selectedComponent.data.properties
      );
      setCostEstimate(baseCost);
    }
  }, [selectedComponent]);

  const tabs = [
    { id: 'properties', label: 'Properties', icon: Settings },
    { id: 'cost', label: 'Cost', icon: DollarSign },
    { id: 'ai', label: 'AI Insights', icon: Bot }
  ];

  return (
    <aside className="w-80 bg-zinc-900/50 border-l border-zinc-800 flex flex-col">
      {/* Tabs */}
      <div className="border-b border-zinc-800 p-4">
        <div className="flex space-x-1 bg-zinc-800/50 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 font-mono
                ${activeTab === tab.id
                  ? 'bg-zinc-700 text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50'}
              `}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'properties' && (
            <motion.div
              key="properties"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              <ComponentProperties
                component={selectedComponent}
                onUpdate={onUpdateComponent}
              />
            </motion.div>
          )}

          {activeTab === 'cost' && (
            <motion.div
              key="cost"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              <CostEstimation
                component={selectedComponent}
                estimate={costEstimate}
              />
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 overflow-y-auto max-h-[300px]" // Applied scroll fix here
            >
              <AIInsights component={selectedComponent} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};

const ComponentProperties = ({ component, onUpdate }) => {
  if (!component) {
    return (
      <div className="text-center py-16">
        <Package className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
        <h3 className="text-sm font-medium text-zinc-400 mb-2 font-mono">
          No Component Selected
        </h3>
        <p className="text-xs text-zinc-600 font-mono">
          Select a component on the canvas to view properties
        </p>
      </div>
    );
  }

  const properties = getComponentProperties(component.data.type);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-800">
        <div className={`p-2.5 rounded-lg ${getComponentColor(component.data.type)}`}>
          {component.data.icon && (
            <component.data.icon className="w-4 h-4 text-white" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-zinc-100 font-mono">
            {component.data.name || component.data.label || 'Unnamed'}
          </h3>
          <p className="text-xs text-zinc-500 font-mono">
            {getComponentDescription(component.data.type)}
          </p>
        </div>
      </div>

      {/* Dynamic Property Fields */}
      <div className="space-y-4">
        {properties.map((property) => (
          <PropertyField
            key={property.key}
            property={property}
            value={component.data.properties?.[property.key] || property.default}
            onChange={(newValue) => onUpdate(component.id, property.key, newValue)}
          />
        ))}
      </div>
    </div>
  );
};


const PropertyField = ({ property, value, onChange }) => {
  const handleChange = (e) => {
    const newValue = property.type === 'boolean' ? e.target.checked : e.target.value;
    onChange?.(newValue);
  };

  return (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-2 font-mono">
        {property.label}
        {property.required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {property.type === 'select' ? (
        <select
          value={value}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 font-mono"
        >
          {property.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : property.type === 'boolean' ? (
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={value}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-600 rounded focus:ring-blue-500/50"
          />
          <span className="text-xs text-zinc-400 font-mono">{property.description}</span>
        </label>
      ) : (
        <input
          type={property.type}
          value={value}
          onChange={handleChange}
          placeholder={property.placeholder}
          className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 font-mono"
        />
      )}

      {property.description && property.type !== 'boolean' && (
        <p className="text-xs text-zinc-600 mt-1 font-mono">{property.description}</p>
      )}
    </div>
  );
};

const CostEstimation = ({ component, estimate }) => {
  if (!component) {
    return (
      <div className="text-center py-16">
        <DollarSign className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
        <h3 className="text-sm font-medium text-zinc-400 mb-2 font-mono">Cost Analysis</h3>
        <p className="text-xs text-zinc-600 font-mono">Select a component to view cost estimates</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-zinc-100 mb-4 font-mono">Cost Estimation</h3>

        {/* Monthly Cost */}
        <div className="bg-gradient-to-r from-emerald-950/30 to-blue-950/30 rounded-xl p-4 border border-emerald-800/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-emerald-400 font-mono">
                ${estimate?.monthly || '0.00'}
              </div>
              <div className="text-xs text-zinc-500 font-mono">per month</div>
            </div>
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="mt-4 space-y-3">
          <h4 className="text-xs font-medium text-zinc-400 font-mono">Cost Breakdown</h4>
          {estimate?.breakdown?.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-b-0">
              <span className="text-xs text-zinc-500 font-mono">{item.name}</span>
              <span className="text-xs font-medium text-zinc-300 font-mono">${item.cost}</span>
            </div>
          ))}
        </div>

        {/* Optimization Tips */}
        <div className="mt-6 p-4 bg-blue-950/20 border border-blue-800/30 rounded-xl">
          <h4 className="text-xs font-medium text-blue-400 mb-2 flex items-center font-mono">
            <Zap className="w-3.5 h-3.5 mr-2" />
            Optimization Tips
          </h4>
          <ul className="text-xs text-zinc-400 space-y-1 font-mono">
            <li>• Use Spot Instances for 70% savings</li>
            <li>• Enable auto-scaling for efficiency</li>
            <li>• Consider Reserved Instances</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const AIInsights = ({ component }) => {
  const insights = getAIInsights(component);

  if (!component) {
    return (
      <div className="text-center py-16">
        <Bot className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
        <h3 className="text-sm font-medium text-zinc-400 mb-2 font-mono">AI Assistant</h3>
        <p className="text-xs text-zinc-600 font-mono">Select a component to get AI-powered insights</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium text-zinc-100 font-mono">AI Insights</h3>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border ${getInsightStyle(insight.type)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-medium mb-1 font-mono">{insight.title}</h4>
                <p className="text-xs opacity-90 font-mono">{insight.description}</p>
                {insight.action && (
                  <Button size="sm" variant="outline" className="mt-2 h-7 text-xs font-mono">
                    {insight.action}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Helper functions remain the same but with updated styling
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
  };
  return colors[type] || 'bg-zinc-600';
};

const getComponentDescription = (type) => {
  const descriptions = {
    server: 'Virtual compute instance',
    database: 'Managed database service',
    storage: 'Object storage service',
    loadbalancer: 'Traffic distribution service',
    vpc: 'Virtual private cloud',
    cdn: 'Content delivery network',
    security: 'Network security rules',
    lambda: 'Serverless compute function',
    monitoring: 'Observability service',
    gateway: 'Network gateway',
    iam: 'Identity and access management',
  };
  return descriptions[type] || 'Cloud service';
};

const getComponentProperties = (type) => {
  const properties = {
    server: [
      {
        key: 'instanceType',
        label: 'Instance Type',
        type: 'select',
        options: [
          { value: 't3.micro', label: 't3.micro (1 vCPU, 1 GB RAM)' },
          { value: 't3.small', label: 't3.small (2 vCPU, 2 GB RAM)' },
          { value: 't3.medium', label: 't3.medium (2 vCPU, 4 GB RAM)' },
          { value: 't3.large', label: 't3.large (2 vCPU, 8 GB RAM)' },
        ],
        default: 't3.micro',
        required: true
      },
      {
        key: 'region',
        label: 'Region',
        type: 'select',
        options: [
          { value: 'us-east-1', label: 'US East (N. Virginia)' },
          { value: 'us-west-2', label: 'US West (Oregon)' },
          { value: 'eu-west-1', label: 'Europe (Ireland)' },
          { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
        ],
        default: 'us-east-1'
      },
      {
        key: 'storage',
        label: 'Storage (GB)',
        type: 'number',
        default: '20',
        description: 'Root volume size in GB'
      }
    ],
    database: [
      {
        key: 'engine',
        label: 'Database Engine',
        type: 'select',
        options: [
          { value: 'mysql', label: 'MySQL' },
          { value: 'postgres', label: 'PostgreSQL' },
          { value: 'mariadb', label: 'MariaDB' },
          { value: 'oracle', label: 'Oracle' },
        ],
        default: 'mysql'
      },
      {
        key: 'instanceClass',
        label: 'Instance Class',
        type: 'select',
        options: [
          { value: 'db.t3.micro', label: 'db.t3.micro' },
          { value: 'db.t3.small', label: 'db.t3.small' },
          { value: 'db.t3.medium', label: 'db.t3.medium' },
        ],
        default: 'db.t3.micro'
      },
      {
        key: 'multiAZ',
        label: 'Multi-AZ Deployment',
        type: 'boolean',
        default: false,
        description: 'Enable for high availability'
      }
    ],
    lambda: [
      {
        key: 'runtime',
        label: 'Runtime',
        type: 'select',
        options: [
          { value: 'nodejs14.x', label: 'nodejs14.x' },
          { value: 'python3.9', label: 'python3.9' }
        ],
        default: 'nodejs14.x'
      },
      {
        key: 'memorySize',
        label: 'Memory Size (MB)',
        type: 'number', // Changed to number for numerical input
        default: '128'
      }
    ]
  };
  return properties[type] || [];
};

const getBaseCost = (type, properties) => {
  const baseCosts = {
    server: { monthly: 8.50, breakdown: [{ name: 'EC2 Instance', cost: '8.50' }] },
    database: { monthly: 15.30, breakdown: [{ name: 'RDS Instance', cost: '15.30' }] },
    storage: { monthly: 2.30, breakdown: [{ name: 'S3 Storage', cost: '2.30' }] },
    loadbalancer: { monthly: 22.50, breakdown: [{ name: 'Application Load Balancer', cost: '22.50' }] },
    vpc: { monthly: 0.00, breakdown: [{ name: 'VPC (Free)', cost: '0.00' }] },
  };
  return baseCosts[type] || { monthly: 0.00, breakdown: [] };
};

const getAIInsights = (component) => {
  if (!component) return [];

  const insights = {
    server: [
      {
        type: 'optimization',
        title: 'Right-sizing Opportunity',
        description: 'Consider t3.nano for dev workloads to save 50% on costs.',
        action: 'Apply Suggestion'
      },
      {
        type: 'security',
        title: 'Security Enhancement',
        description: 'Add a security group to restrict inbound traffic.',
        action: 'Add Security Group'
      }
    ],
    database: [
      {
        type: 'performance',
        title: 'Performance Optimization',
        description: 'Enable Multi-AZ deployment for better availability.',
        action: 'Enable Multi-AZ'
      },
      {
        type: 'security',
        title: 'Backup Configuration',
        description: 'Configure automated backups with 7-day retention.',
        action: 'Configure Backups'
      }
    ]
  };

  // Corrected to use component.data.type
  return insights[component.data.type] || [
    {
      type: 'info',
      title: 'Configuration Complete',
      description: 'This component is properly configured.'
    }
  ];
};

const getInsightStyle = (type) => {
  const styles = {
    optimization: 'bg-blue-950/30 border-blue-800/30 text-blue-400',
    security: 'bg-red-950/30 border-red-800/30 text-red-400',
    performance: 'bg-emerald-950/30 border-emerald-800/30 text-emerald-400',
    warning: 'bg-amber-950/30 border-amber-800/30 text-amber-400',
    info: 'bg-zinc-800/30 border-zinc-700/30 text-zinc-400'
  };
  return styles[type] || styles.info;
};

const getInsightIcon = (type) => {
  const icons = {
    optimization: <Zap className="w-3.5 h-3.5" />,
    security: <Shield className="w-3.5 h-3.5" />,
    performance: <TrendingUp className="w-3.5 h-3.5" />,
    warning: <AlertTriangle className="w-3.5 h-3.5" />,
    info: <Info className="w-3.5 h-3.5" />
  };
  return icons[type] || icons.info;
};

export { getComponentProperties };
export default PropertiesPanel;

// A simple Button component if you don't have shadcn/ui or similar
// src/components/ui/button.jsx
// This is a minimal example; you would typically have a more robust Button component.
/*
export const Button = ({ children, onClick, size, variant, className }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const sizeStyles = {
    sm: "h-8 px-3 py-1",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 py-3",
  };

  const variantStyles = {
    outline: "border border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:text-zinc-100",
    // Add other variants as needed
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || ''} ${className}`}
    >
      {children}
    </button>
  );
};
*/
