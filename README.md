# storedge-dashboard

The graphical user interface for managing the Storedge CMS. This dashboard is designed to provide a seamless administrative experience for e-commerce platforms. Built with the modern Vite.js build tool and React framework, dashboard integrates shadcn-ui components to create a simple yet effective user interface, refined from initial custom designs in Figma.

## Features

- **Intuitive Interface**: A clean and responsive UI based on shadcn-ui, focusing on user experience and ease of use.
- **Fast Development**: Leveraging Vite.js for an optimized development experience with fast rebuilds.
- **React Framework**: Utilizing the robust React ecosystem for reactive state management and component-based architecture.

# Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Dashboard](#running-the-dashboard)
  - [Building for Production](#building-for-production)
- [Architecture Overview](#architecture-overview)
- [Design Philosophy](#design-philosophy)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To get started with the Storedge-Dashboard, clone this repository and navigate into the directory:

```bash
git clone https://github.com/suiramdev/storedge-dashboard.git
cd storedge-dashboard
```

### Prerequisites

Before you start, make sure you have Node.js installed on your system (preferably the latest stable version).

### Installation

Install the necessary packages using `pnpm`:

```bash
pnpm install
```

### Running the Dashboard

Start the development server with:

```bash
pnpm dev
```

Your dashboard will be available at `http://localhost:3000`.

### Building for Production

To build the dashboard for production, run:

```bash
pnpm build
```

This will generate the production files in the `dist` folder.

## Architecture Overview

The dashboard is designed as a single-page application (SPA) with the following key parts:

- **Vite.js**: Employs Vite.js for bundling and development tooling to provide a fast and modern development experience.
- **React**: Built with React to take advantage of its efficient update and rendering system.
- **shadcn-ui**: Implements shadcn-ui for a standardized and accessible component library.

## Design Philosophy

The design of Storedge-Dashboard was initially conceptualized in Figma. However, to streamline the development process and maintain simplicity, we have adopted shadcn-ui. This ensures that we can provide consistent updates and support without the overhead of maintaining a custom UI library.

## Contributing

Contributions to the Storedge-Dashboard are welcome. Please read our CONTRIBUTING.md file for instructions on how to make contributions.

## License

Storedge-Dashboard is licensed under the MIT License. See the LICENSE.md file for full license text.
