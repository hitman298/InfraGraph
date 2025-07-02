# InfraGraph

**InfraGraph** is a modern, interactive cloud architecture diagramming tool built with React Flow, Framer Motion, and Vite. It allows you to visually design infrastructure components, edit properties, estimate costs, and export your entire layout.

Live Demo: [https://hitman298.github.io/InfraGraph](https://hitman298.github.io/InfraGraph)

---

## 🧪 Usage Guide

* 🟩 **Drag components** (Server, DB, Lambda, etc.) to the canvas from the sidebar
* 🔧 **Click a component** to edit its properties in the right sidebar (e.g. instance type, region)
* 🔗 **Draw connections** between components to represent relationships
* 🗑️ **Delete nodes** using the `Delete` key on your keyboard
* ➕ **Quick Add Button** appears below the canvas for fast component creation
* 🎯 **Zoom to Fit** button centers your entire canvas automatically
* 📥 **Import JSON** to load a saved infrastructure diagram
* 📤 **Export JSON** to save your architecture layout
* 🖼️ **Export PNG** to download a screenshot of your diagram
* 💾 **Auto-Save**: your canvas is saved to Local Storage automatically

---

## ✨ Features

* 🔄 Drag-and-drop node creation
* 🛠️ Dynamic Properties Panel with Tabs (Properties, Cost, AI)
* 🤖 AI Insights for optimization suggestions
* 🧠 Smart Suggestions panel for contextual tips
* 📦 JSON import/export support
* 📷 Image export with `dom-to-image-more`
* 🗑️ Node deletion with keyboard
* 💾 Local Storage persistence
* 🔍 Zoom to Fit functionality

---

## 🧱 Built With

* [React](https://react.dev/)
* [React Flow](https://reactflow.dev/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Framer Motion](https://www.framer.com/motion/)
* [Lucide Icons](https://lucide.dev/)
* [dom-to-image-more](https://www.npmjs.com/package/dom-to-image-more)

---

## 🚀 Getting Started

```bash
# Clone the repo
https://github.com/hitman298/InfraGraph.git

# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

---

## 📦 Build & Deploy

```bash
# Build the app
pnpm build

# Deploy to GitHub Pages
pnpm deploy
```

Make sure your `package.json` includes:

```json
"homepage": "https://hitman298.github.io/InfraGraph"
```

---

## 👤 Author

* **Lohith Ratan** — [@hitman298](https://github.com/hitman298)

---

## 📄 License

MIT License. Feel free to fork and enhance this project!
