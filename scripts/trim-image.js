const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const input = path.join(__dirname, '..', 'public', 'images', 'image2.png');
    const tmp = input + '.tmp.png';

    await sharp(input)
      .trim()
      .toFile(tmp);

    fs.renameSync(tmp, input);
    console.log('Trim successful:', input);
  } catch (err) {
    console.error('Trim failed:', err);
    process.exit(1);
  }
})();
