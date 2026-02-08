import React, { useState, useRef, useEffect } from 'react';

const CHAR_SETS = {
  level2: '# ',
  level4: '@#-. ',
  level8: '@%#*+=-. ',
  // 16-level ramp
  level16: '@%#*+=-:.       ',
  // 32-level ramp (Extended density)
  level32: 'SHNDWM#*&8%O0QLCJUYXzcvunxrjft:. ',
  // For 64+, use a procedural approach or ANSI colors
  blocks: '█▓▒░ '
};

function App() {
  const [image, setImage] = useState(null);
  const [ascii, setAscii] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#000000');
  const [charSet, setCharSet] = useState('level16');
  const [resolution, setResolution] = useState(100);
  const [isExporting, setIsExporting] = useState(false);

  const [invert, setInvert] = useState(false);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          generateAscii(img);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAscii = (img) => {
    if (!img) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Calculate dimensions
    const aspectRatio = img.height / img.width;
    const width = resolution;
    const height = Math.floor(width * aspectRatio * 0.55);

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    let asciiArt = '';
    const chars = CHAR_SETS[charSet];

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const index = (i * width + j) * 4;
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];

        // Luminance calculation
        let luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        if (invert) luminance = 1 - luminance;

        // Map 0 (dark) to first chars (dense), 1 (light) to last chars (sparse)
        const charIndex = Math.floor(luminance * (chars.length - 1));
        asciiArt += chars[charIndex];
      }
      asciiArt += '\n';
    }

    setAscii(asciiArt);
  };

  useEffect(() => {
    if (image) {
      generateAscii(image);
    }
  }, [resolution, charSet, invert]);

  const exportAsTxt = () => {
    const blob = new Blob([ascii], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ascii-art.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAsPng = () => {
    const lines = ascii.split('\n');
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    // Estimate size
    const fontSize = 12;
    const charWidth = fontSize * 0.6;
    const charHeight = fontSize;

    const canvasWidth = lines[0].length * charWidth + 40;
    const canvasHeight = lines.length * charHeight + 40;

    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;

    // Background
    tempCtx.fillStyle = bgColor;
    tempCtx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Text
    tempCtx.fillStyle = textColor;
    tempCtx.font = `${fontSize}px "Roboto Mono"`;
    tempCtx.textBaseline = 'top';

    lines.forEach((line, i) => {
      tempCtx.fillText(line, 20, 20 + i * charHeight);
    });

    const url = tempCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ascii-art.png';
    link.click();
  };

  return (
    <div className="container">
      <h1>ASCII Art Studio</h1>

      <div className="glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Upload Image</label>
            <button className="btn-primary" onClick={() => fileInputRef.current.click()} style={{ width: '100%' }}>
              Select Photo
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Characters</label>
            <select
              value={charSet}
              onChange={(e) => setCharSet(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: '#1e293b', color: 'white', width: '100%' }}
            >
              <option value="level2">Level 2 (# )</option>
              <option value="level4">Level 4 (@#..)</option>
              <option value="level8">Level 8 (@%#..)</option>
              <option value="level16">Level 16 (@%#..)</option>
              <option value="level32">Level 32 (Extended)</option>
              <option value="blocks">Blocks (█▓..)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Resolution ({resolution})</label>
            <input
              type="range"
              min="20"
              max="256"
              value={resolution}
              onChange={(e) => setResolution(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Text Color</label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              style={{ width: '100%', height: '40px', padding: '2px', borderRadius: '8px', border: 'none', background: 'none', cursor: 'pointer' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Bg Color</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              style={{ width: '100%', height: '40px', padding: '2px', borderRadius: '8px', border: 'none', background: 'none', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '10px' }}>
            <input
              type="checkbox"
              id="invert"
              checked={invert}
              onChange={(e) => setInvert(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
            />
            <label htmlFor="invert" style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Invert Mapping</label>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn-primary" onClick={exportAsTxt} disabled={!ascii}>Export .txt</button>
          <button className="btn-primary" onClick={exportAsPng} disabled={!ascii} style={{ background: 'var(--accent)' }}>Export .png</button>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {ascii && (
        <div className="glass" style={{ background: bgColor }}>
          <div
            className="ascii-preview"
            style={{ color: textColor }}
            ref={previewRef}
          >
            {ascii}
          </div>
        </div>
      )}

      {!ascii && (
        <div className="glass" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>Upload an image to start generating ASCII art</p>
        </div>
      )}
    </div>
  );
}

export default App;
