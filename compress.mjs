import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const directory = './public/newarrivals';

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    if (file.match(/\.(jpg|jpeg|png)$/i)) {
      const filePath = path.join(directory, file);
      const tempPath = path.join(directory, `temp-${file}`);
      
      console.log(`Compressing ${file}...`);
      
      sharp(filePath)
        .resize({ width: 800, withoutEnlargement: true }) // resize to max 800px width
        .jpeg({ quality: 80 }) // compress
        .toFile(tempPath)
        .then(() => {
          // Replace original with compressed
          fs.renameSync(tempPath, filePath);
          console.log(`Successfully compressed ${file}`);
        })
        .catch(err => {
          console.error(`Error compressing ${file}:`, err);
        });
    }
  });
});
