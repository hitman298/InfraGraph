// src/utils/infraSchema.js
export const infraSchema = {
  EC2: {
    category: 'compute',
    suggestedNext: ['RDS', 'LoadBalancer'],
    defaultProps: {
      instanceType: 't3.micro',
      region: 'us-east-1',
    },
  },
  RDS: {
    category: 'database',
    suggestedNext: ['EC2'],
    defaultProps: {
      engine: 'PostgreSQL',
      multiAZ: false,
    },
  },
  LoadBalancer: {
    category: 'network',
    suggestedNext: ['EC2'],
    defaultProps: {
      type: 'application',
    },
  },
};
