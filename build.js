const ejs = require('ejs');
const fs = require('fs-extra');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

function processEJSFiles(dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const relativePath = path.relative(srcDir, fullPath);
        const outputPath = path.join(distDir, relativePath.replace('.ejs', '.html'));

        // Handle subdirectories recursively
        if (fs.statSync(fullPath).isDirectory()) {
            fs.ensureDirSync(outputPath);
            processEJSFiles(fullPath);
        } else if (file.endsWith('.ejs') && !file.startsWith('_')) {
            const output = ejs.render(fs.readFileSync(fullPath, 'utf-8'), {
                filename: fullPath,
                root: srcDir
            });

            fs.writeFileSync(outputPath, output);
            console.log(`Built: ${relativePath.replace('.ejs', '.html')}`);
        }
    });
}


fs.ensureDirSync(distDir);
processEJSFiles(srcDir);

// This already handles subdirectories :)
fs.copySync(srcDir, distDir, {
    filter: (file) => {
        // We've already processed these files
        return !file.endsWith('.ejs') || file.startsWith('_');
    }
});

console.log('Build completed successfully.');
