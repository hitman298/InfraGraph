import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Code, 
  Copy, 
  Download, 
  FileText, 
  Settings, 
  CheckCircle,
  Terminal
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'

const CodePanel = ({ components }) => {
  const [activeFormat, setActiveFormat] = useState('terraform')
  const [generatedCode, setGeneratedCode] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const formats = [
    { id: 'terraform', label: 'Terraform', icon: FileText, color: 'text-purple-400' },
    { id: 'yaml', label: 'YAML', icon: Settings, color: 'text-blue-400' },
    { id: 'json', label: 'JSON', icon: Code, color: 'text-emerald-400' },
  ]

  useEffect(() => {
    generateCode()
  }, [components, activeFormat])

  const generateCode = async () => {
    setIsGenerating(true)
    
    // Simulate code generation delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let code = ''
    
    switch (activeFormat) {
      case 'terraform':
        code = generateTerraformCode(components)
        break
      case 'yaml':
        code = generateYAMLCode(components)
        break
      case 'json':
        code = generateJSONCode(components)
        break
      default:
        code = '# No components on canvas'
    }
    
    setGeneratedCode(code)
    setIsGenerating(false)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const downloadCode = () => {
    const extensions = {
      terraform: 'tf',
      yaml: 'yml',
      json: 'json'
    }
    
    const blob = new Blob([generatedCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `infrastructure.${extensions[activeFormat]}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const activeFormatData = formats.find(f => f.id === activeFormat)

  return (
    <div className="h-64 bg-zinc-900/50 border-t border-zinc-800 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-sm font-medium text-zinc-100 flex items-center font-mono">
            <Terminal className="w-4 h-4 mr-2 text-zinc-400" />
            Generated Code
          </h3>
          
          {/* Format Selector */}
          <div className="flex space-x-1 bg-zinc-800/50 rounded-lg p-1">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => setActiveFormat(format.id)}
                className={`
                  flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 font-mono
                  ${activeFormat === format.id
                    ? 'bg-zinc-700 text-zinc-100 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50'
                  }
                `}
              >
                <format.icon className="w-3.5 h-3.5" />
                <span>{format.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs text-zinc-500 font-mono">
            <div className={`w-2 h-2 rounded-full ${
              components.length > 0 ? 'bg-emerald-500' : 'bg-zinc-600'
            }`}></div>
            <span>{components.length} components</span>
          </div>
          
          <Button
            onClick={copyToClipboard}
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 font-mono"
            disabled={!generatedCode || isGenerating}
          >
            {copied ? (
              <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 mr-1.5" />
            )}
            <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
          </Button>
          
          <Button
            onClick={downloadCode}
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 font-mono"
            disabled={!generatedCode || isGenerating}
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span className="text-xs">Download</span>
          </Button>
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-zinc-900/50"
            >
              <div className="flex items-center space-x-3 text-zinc-500">
                <div className="w-4 h-4 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin"></div>
                <span className="text-xs font-mono">Generating {activeFormat} code...</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-0 overflow-auto custom-scrollbar"
            >
              <pre className="p-4 text-xs text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap">
                {generatedCode || '# No components on canvas\n# Drag components to generate code'}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Bar */}
      <div className="bg-zinc-800/30 px-4 py-2 border-t border-zinc-800">
        <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
          <div className="flex items-center space-x-4">
            <span className={`flex items-center space-x-1 ${activeFormatData?.color}`}>
              <activeFormatData.icon className="w-3 h-3" />
              <span>Format: {activeFormat.toUpperCase()}</span>
            </span>
            <span>Lines: {generatedCode.split('\n').length}</span>
            <span>Size: {new Blob([generatedCode]).size} bytes</span>
          </div>
          
          {components.length > 0 && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-500">Ready to deploy</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Code generation functions (simplified for brevity)
const generateTerraformCode = (components) => {
  if (components.length === 0) {
    return `# Terraform Configuration
# Add components to the canvas to generate infrastructure code

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}`
  }

  let code = `# Generated Terraform Configuration
# Infrastructure as Code for InfraGraph

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

`

  components.forEach((component, index) => {
    code += generateTerraformResource(component, index)
    code += '\n'
  })

  return code
}

const generateTerraformResource = (component, index) => {
  const resourceName = `${component.type}_${index + 1}`
  
  switch (component.type) {
    case 'server':
      return `resource "aws_instance" "${resourceName}" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "${component.properties?.instanceType || 't3.micro'}"
  
  root_block_device {
    volume_size = ${component.properties?.storage || 20}
    volume_type = "gp3"
  }
  
  tags = {
    Name        = "${component.name}"
    Environment = var.environment
    ManagedBy   = "InfraGraph"
  }
}`

    case 'database':
      return `resource "aws_db_instance" "${resourceName}" {
  identifier = "${component.name.toLowerCase().replace(/\s+/g, '-')}"
  engine     = "${component.properties?.engine || 'mysql'}"
  engine_version = "8.0"
  instance_class = "${component.properties?.instanceClass || 'db.t3.micro'}"
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type         = "gp3"
  storage_encrypted    = true
  
  multi_az = ${component.properties?.multiAZ || false}
  
  tags = {
    Name        = "${component.name}"
    Environment = var.environment
    ManagedBy   = "InfraGraph"
  }
}`

    default:
      return `# ${component.type} resource
# Configuration for ${component.name}
# Resource type: ${component.type}`
  }
}

const generateYAMLCode = (components) => {
  if (components.length === 0) {
    return `# Kubernetes Configuration
# Add components to the canvas to generate YAML manifests

apiVersion: v1
kind: Namespace
metadata:
  name: infragraph
  labels:
    managed-by: infragraph`
  }

  let code = `# Generated Kubernetes Configuration
# Infrastructure as Code for InfraGraph

apiVersion: v1
kind: Namespace
metadata:
  name: infragraph
  labels:
    managed-by: infragraph
---
`

  components.forEach((component, index) => {
    code += generateYAMLResource(component, index)
    code += '---\n'
  })

  return code
}

const generateYAMLResource = (component, index) => {
  const resourceName = `${component.type}-${index + 1}`
  
  switch (component.type) {
    case 'server':
      return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${resourceName}
  namespace: infragraph
  labels:
    app: ${component.name.toLowerCase().replace(/\s+/g, '-')}
    managed-by: infragraph
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ${component.name.toLowerCase().replace(/\s+/g, '-')}
  template:
    metadata:
      labels:
        app: ${component.name.toLowerCase().replace(/\s+/g, '-')}
    spec:
      containers:
      - name: ${component.name.toLowerCase().replace(/\s+/g, '-')}
        image: nginx:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
`

    default:
      return `# ${component.type} configuration
# Resource: ${component.name}
# Type: ${component.type}
apiVersion: v1
kind: ConfigMap
metadata:
  name: ${resourceName}-config
  namespace: infragraph
data:
  component-type: ${component.type}
  component-name: ${component.name}
`
  }
}

const generateJSONCode = (components) => {
  const config = {
    version: "1.0",
    metadata: {
      name: "InfraGraph Configuration",
      generatedAt: new Date().toISOString(),
      components: components.length
    },
    infrastructure: components.map((component, index) => ({
      id: component.id,
      name: component.name,
      type: component.type,
      position: {
        x: component.x,
        y: component.y
      },
      properties: component.properties || {},
      metadata: {
        createdAt: new Date().toISOString(),
        index: index + 1
      }
    }))
  }

  return JSON.stringify(config, null, 2)
}

export default CodePanel

