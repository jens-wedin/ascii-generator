# ASCII Art Studio

<img width="2358" height="1498" alt="image" src="https://github.com/user-attachments/assets/06c42b69-8185-416d-8a92-c7cb7616012e" />


A premium, web-based image-to-ASCII converter built with React and the HTML5 Canvas API.

## Project Overview

ASCII Art Studio allows users to upload any image and instantly transform it into detailed ASCII art. The tool provides a high degree of customization, allowing users to fine-tune the output's density, resolution, and aesthetic through custom colors and character mapping.

## Key Features

- **Luminance-Based Mapping**: Procedurally maps pixel luminance to character density for accurate representation.
- **Variable Density Levels**: 
  - Supports 2, 4, 8, 16, 32, and 64 levels of character density.
  - A dedicated "Blocks" mode for a solid-character look.
- **Image Enhancement**:
  - Real-time brightness and contrast adjustments for better ASCII clarity.
- **Custom Aesthetic**:
  - Independent color selection for text and background.
  - Invert option to switch the mapping polarity.
- **Flexible Export**:
  - Export as raw `.txt` file for terminal or text-editor use.
  - Export as high-resolution `.png` file with the selected colors preserved.
- **Premium UI**: Glassmorphism design with smooth CSS animations and responsiveness.

## How the Code Works

### 1. Image Processing (The Canvas API)
The core logic resides in the `generateAscii` function within `App.jsx`. 
- When an image is uploaded, it's drawn onto a hidden "buffer" canvas at a resolution specified by the user.
- The `getImageData` method is used to extract the raw pixel data (RGBA values).

### 2. Luminance Calculation
For every pixel/block in the image, the application calculates its perceived brightness (luminance) using the standard weighted formula:
`Luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B`

### 3. Procedural Character Selection
Instead of static character sets, the app uses a `getLevelSet` function:
- This function takes a master "ramp" of characters ordered from densest to sparsest.
- It procedurally extracts a subset of characters based on the requested level (e.g., Level 8 selects 8 evenly spaced characters).
- The calculated luminance is then used to index into this ramp to select the corresponding ASCII character.

### 4. Rendering & Export
- **Preview**: The ASCII art is rendered in a `<pre>` tag with **Roboto Mono** to ensure perfect character alignment.
- **PNG Export**: A dedicated export canvas is created, filled with the chosen background color, and then the ASCII string is manually "painted" onto it using standard text-drawing methods to ensure the exported image matches the preview.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
1. Clone the repository.
2. Run `npm install` to install dependencies.

### Development
Run the development server:
```bash
npm run dev
```

### Build
Generate a production-ready bundle:
```bash
npm run build
```
