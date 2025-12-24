mkdir -p dist/extension/dist
cp example/* dist/extension
cp dist/index.js dist/extension/dist
cat dist/extension/styles-extension.css | tee -a dist/extension/styles.css
cat dist/extension/script-extension.js | tee -a dist/extension/script.js