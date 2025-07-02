// src/lib/infraSchema.js

// Defines rules and default properties for different infrastructure components.
export const infraRules = {
  compute: {
    suggestedNext: ['load-balancer', 'database'],
    defaultProperties: { instanceType: 't3.micro' },
  },
  loadBalancer: {
    suggestedNext: ['compute'],
    defaultProperties: { protocol: 'HTTP' },
  },
  database: {
    suggestedNext: [],
    defaultProperties: { engine: 'PostgreSQL' },
  },
  // Add other component types as needed
  lambda: { // Added lambda to infraRules for consistency, if it's a component
    suggestedNext: ['api-gateway', 'dynamodb'], // Example suggestions for lambda
    defaultProperties: { runtime: 'nodejs14.x', memorySize: 128 },
  },
};

// Defines a map for suggested next components based on the current component type.
// This is used for AI-powered suggestions or workflow guidance.
export const infraSuggestionMap = {
  lambda: ["APIGateway", "DynamoDB"],
  server: ["LoadBalancer", "Database"], // 'server' maps to 'compute' in infraRules
  loadbalancer: ["EC2 Instance"], // 'loadbalancer' maps to 'loadBalancer' in infraRules
  // Note: Ensure the string values here match the 'type' or 'name' of your actual components
  // For example, "EC2 Instance" should correspond to the 'name' of your 'server' component.
};
