# 📸 PNG Export Guide for Krawl Logo

This guide provides step-by-step instructions for exporting PNG files from SVG logos using free tools.

---

## 🎯 Required PNG Sizes

### Standard Logo Sizes
- **512x512px** - High-resolution web use
- **256x256px** - Standard web use
- **128x128px** - Small web use
- **64x64px** - Thumbnail size

### Favicon Sizes
- **32x32px** - Standard favicon
- **16x16px** - Browser favicon (legacy)
- **180x180px** - Apple Touch Icon
- **192x192px** - Android icon
- **512x512px** - Android icon (high-res)

---

## 🛠️ Method 1: Using Inkscape (Recommended)

### Installation
1. Download Inkscape: https://inkscape.org/release/
2. Install (free, open-source)

### Export Steps

1. **Open SVG file** in Inkscape
2. **Select the logo** (Ctrl+A or click and drag)
3. **File → Export PNG Image** (Shift+Ctrl+E)
4. **Set export settings:**
   - Width: 512px (or desired size)
   - Height: 512px (maintains aspect ratio)
   - DPI: 96 (web) or 300 (print)
5. **Click Export**
6. **Save with naming:** `krawl-logo-full-color-512.png`

### Batch Export Script (Inkscape Command Line)

Create a batch file (`export-pngs.bat` for Windows or `export-pngs.sh` for Mac/Linux):

**Windows (export-pngs.bat):**
```batch
@echo off
set INKSCAPE="C:\Program Files\Inkscape\bin\inkscape.exe"

%INKSCAPE% --export-type=png --export-filename=krawl-logo-full-color-512.png --export-width=512 krawl-logo-full-color.svg
%INKSCAPE% --export-type=png --export-filename=krawl-logo-full-color-256.png --export-width=256 krawl-logo-full-color.svg
%INKSCAPE% --export-type=png --export-filename=krawl-logo-full-color-128.png --export-width=128 krawl-logo-full-color.svg

%INKSCAPE% --export-type=png --export-filename=krawl-logo-black-white-512.png --export-width=512 krawl-logo-black-white.svg
%INKSCAPE% --export-type=png --export-filename=krawl-logo-white-512.png --export-width=512 krawl-logo-white.svg
%INKSCAPE% --export-type=png --export-filename=krawl-logo-monochrome-green-512.png --export-width=512 krawl-logo-monochrome-green.svg

%INKSCAPE% --export-type=png --export-filename=favicon-32.png --export-width=32 krawl-favicon.svg
%INKSCAPE% --export-type=png --export-filename=favicon-16.png --export-width=16 krawl-favicon.svg
%INKSCAPE% --export-type=png --export-filename=apple-touch-icon.png --export-width=180 krawl-favicon.svg

echo PNG export complete!
pause
```

**Mac/Linux (export-pngs.sh):**
```bash
#!/bin/bash
INKSCAPE="/Applications/Inkscape.app/Contents/MacOS/inkscape"

# Full Color Logo
$INKSCAPE --export-type=png --export-filename=krawl-logo-full-color-512.png --export-width=512 krawl-logo-full-color.svg
$INKSCAPE --export-type=png --export-filename=krawl-logo-full-color-256.png --export-width=256 krawl-logo-full-color.svg
$INKSCAPE --export-type=png --export-filename=krawl-logo-full-color-128.png --export-width=128 krawl-logo-full-color.svg

# Black & White Logo
$INKSCAPE --export-type=png --export-filename=krawl-logo-black-white-512.png --export-width=512 krawl-logo-black-white.svg

# White Logo
$INKSCAPE --export-type=png --export-filename=krawl-logo-white-512.png --export-width=512 krawl-logo-white.svg

# Monochrome Green Logo
$INKSCAPE --export-type=png --export-filename=krawl-logo-monochrome-green-512.png --export-width=512 krawl-logo-monochrome-green.svg

# Favicon
$INKSCAPE --export-type=png --export-filename=favicon-32.png --export-width=32 krawl-favicon.svg
$INKSCAPE --export-type=png --export-filename=favicon-16.png --export-width=16 krawl-favicon.svg
$INKSCAPE --export-type=png --export-filename=apple-touch-icon.png --export-width=180 krawl-favicon.svg

echo "PNG export complete!"
```

**To run:**
- Windows: Double-click `export-pngs.bat`
- Mac/Linux: `chmod +x export-pngs.sh && ./export-pngs.sh`

---

## 🌐 Method 2: Using Online Converters

### CloudConvert (Free Tier: 25 conversions/day)

1. Go to: https://cloudconvert.com/svg-to-png
2. **Upload SVG file**
3. **Set options:**
   - Width: 512px
   - Height: 512px
   - Quality: 100%
4. **Convert**
5. **Download PNG**

### Convertio (Free Tier: 10 files/day)

1. Go to: https://convertio.co/svg-png/
2. **Upload SVG**
3. **Set size:** 512x512px
4. **Convert and download**

### Online-Convert (Free)

1. Go to: https://www.online-convert.com/
2. **Choose:** SVG to PNG
3. **Upload file**
4. **Set dimensions:** 512x512px
5. **Convert**

---

## 🎨 Method 3: Using Figma (Free Tier)

### Steps

1. **Create account:** https://www.figma.com/ (free)
2. **Create new file**
3. **Import SVG:**
   - File → Import → Select SVG file
   - Or paste SVG code directly
4. **Select logo**
5. **Right-click → Export**
6. **Choose:**
   - Format: PNG
   - Scale: 1x (512px), 2x (1024px), 3x (1536px)
7. **Export**

---

## 📱 Method 4: Favicon Generation

### Favicon.io (Free)

1. Go to: https://favicon.io/favicon-converter/
2. **Upload:** `krawl-favicon.svg` or any PNG (512x512px)
3. **Generate**
4. **Download package** includes:
   - favicon.ico
   - favicon-16x16.png
   - favicon-32x32.png
   - apple-touch-icon.png
   - android-chrome-192x192.png
   - android-chrome-512x512.png

### RealFaviconGenerator (Free)

1. Go to: https://realfavicongenerator.net/
2. **Upload:** PNG or SVG favicon
3. **Configure options:**
   - iOS options
   - Android options
   - Windows tiles
4. **Generate**
5. **Download package**

---

## 📋 Complete PNG File Checklist

After export, you should have:

### Logo Files
- [ ] `krawl-logo-full-color-512.png`
- [ ] `krawl-logo-full-color-256.png`
- [ ] `krawl-logo-full-color-128.png`
- [ ] `krawl-logo-black-white-512.png`
- [ ] `krawl-logo-white-512.png`
- [ ] `krawl-logo-monochrome-green-512.png`

### Favicon Files
- [ ] `favicon.ico` (multi-size ICO file)
- [ ] `favicon-16x16.png`
- [ ] `favicon-32x32.png`
- [ ] `apple-touch-icon.png` (180x180px)
- [ ] `android-chrome-192x192.png`
- [ ] `android-chrome-512x512.png`

---

## 💡 Tips

1. **Always export from SVG** for best quality
2. **Use 2x resolution** for retina displays (1024x1024px for 512px display)
3. **Test favicons** in different browsers
4. **Optimize PNG files** using tools like TinyPNG (free tier available)
5. **Keep originals** - always keep SVG files as source

---

## 🔧 Troubleshooting

### Issue: PNG looks blurry
**Solution:** Export at higher resolution (2x or 3x), then scale down

### Issue: Colors look different
**Solution:** Ensure color profile is sRGB for web use

### Issue: File size too large
**Solution:** Use PNG optimization tools (TinyPNG, ImageOptim)

### Issue: Favicon not showing
**Solution:** Clear browser cache, check file path, verify HTML code

---

**Need help?** Refer to `LOGO_GUIDELINES.md` for complete usage guidelines.

