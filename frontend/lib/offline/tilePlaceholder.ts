/**
 * Tile Placeholder Generator
 * 
 * Creates placeholder tiles for missing map tiles
 */

/**
 * Generate a placeholder tile as a data URL
 */
export function generatePlaceholderTile(
  width: number = 256,
  height: number = 256,
  text: string = "Offline"
): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return "";
  }

  // Fill with light gray background
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, width, height);

  // Add grid pattern
  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 1;
  const gridSize = 32;
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Add text
  ctx.fillStyle = "#999";
  ctx.font = "14px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);

  return canvas.toDataURL();
}

/**
 * Create a placeholder tile blob URL
 */
export async function createPlaceholderTileBlob(
  width: number = 256,
  height: number = 256,
  text: string = "Offline"
): Promise<string> {
  const dataUrl = generatePlaceholderTile(width, height, text);
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}




