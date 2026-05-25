const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'src', 'input.css');
const outputFile = path.join(__dirname, 'css', 'tailwind-output.css');

async function buildCSS() {
  const css = fs.readFileSync(inputFile, 'utf8');
  
  const result = await postcss([
    tailwindcss('./tailwind.config.js'),
    autoprefixer,
  ]).process(css, { from: inputFile, to: outputFile });
  
  fs.writeFileSync(outputFile, result.css);
  console.log('CSS generated successfully!');
}

buildCSS().catch(err => {
  console.error(err);
  process.exit(1);
});