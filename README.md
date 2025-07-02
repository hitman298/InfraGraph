InfraGraph
InfraGraph is a modern, interactive tool for designing cloud architecture diagrams. It is built using React Flow, Framer Motion, and Vite. The application enables users to visually design infrastructure components, modify their properties, estimate costs, and export the complete layout.

Live Demo: https://hitman298.github.io/InfraGraph

Usage Guide
Drag components (e.g., Server, Database, Lambda) from the sidebar onto the canvas.

Click a component to access and modify its properties in the right sidebar (e.g., instance type, region).

Draw connections between components to define relationships.

Delete nodes by selecting a component and pressing the Delete key.

A Quick Add Button is available below the canvas for rapid component creation.

The Zoom to Fit button automatically centers the entire canvas view.

Import JSON to load previously saved infrastructure diagrams.

Export JSON to save your architecture layout.

Export PNG to download a screenshot of your diagram.

Auto-Save: The canvas state is automatically saved to Local Storage.

Features
Drag-and-drop functionality for node creation.

Dynamic Properties Panel with categorized tabs (Properties, Cost, AI).

AI-driven insights for optimization suggestions.

Smart Suggestions panel providing contextual tips.

JSON import and export capabilities.

Image export using dom-to-image-more.

Node deletion via keyboard input.

Automatic persistence of data to Local Storage.

Zoom to Fit view functionality.

Built With
React

React Flow

Tailwind CSS

Framer Motion

Lucide Icons

dom-to-image-more

Getting Started
To set up the project for local development:

# Clone the repository
git clone https://github.com/hitman298/InfraGraph.git

# Navigate into the project directory
cd InfraGraph

# Install dependencies
pnpm install

# Start the development server
pnpm dev

Build & Deploy
To build the application for production and deploy to GitHub Pages:

# Build the application
pnpm build

# Deploy to GitHub Pages
pnpm deploy

Ensure your package.json includes the following homepage entry for GitHub Pages deployment:

"homepage": "https://hitman298.github.io/InfraGraph"

Author
Lohith Ratan — @hitman298

This project is a solo endeavor developed to expand knowledge in infrastructure design, React Flow, and public tool-building. Contributions and enhancements are welcome.

License
MIT License.
