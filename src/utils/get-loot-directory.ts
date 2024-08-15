import fs from 'fs';

export function getLootDirectory() {
    let lootDirectory = '';

    const srcExist = fs.existsSync('src');
    if (srcExist) {
        lootDirectory += 'src/';
    }

    lootDirectory += 'components/lootui';

    if (!fs.existsSync(lootDirectory)) {
        fs.mkdirSync(lootDirectory, { recursive: true });
    }

    return lootDirectory;
}
