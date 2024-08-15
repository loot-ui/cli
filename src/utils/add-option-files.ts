import { LootOption } from './define-config';
import { fetchGithubFile } from './fetch-github-file';
import fs from 'fs';
import path from 'path';
import { getLootDirectory } from './get-loot-directory';
import { getOptionPathsDirectories } from './get-option-paths-directories';

async function createLootFile(file: Blob, directory: string, fileName: string) {
    const filePath = path.join(directory, fileName);

    const arrayBuffer = await file.arrayBuffer();

    fs.writeFileSync(filePath, Buffer.from(new Uint8Array(arrayBuffer)));
}

export async function addOptionFiles(
    option: LootOption,
    githubBaseUrl: string,
    componentName: string
) {
    const lootDirectory = getLootDirectory();
    const filePromises = Promise.all(
        option.paths.map((path) => {
            return fetchGithubFile(githubBaseUrl + path);
        })
    );

    const files = await filePromises;

    if (files.length === 1) {
        const theOnlyFile = files[0];
        const fileName = path.basename(option.paths[0]);

        await createLootFile(theOnlyFile, lootDirectory, fileName);
    } else {
        const directories = getOptionPathsDirectories(option.paths);

        files.forEach((file, index) => {
            const fileName = path.basename(option.paths[index]);
            const directory =
                lootDirectory + '/' + componentName + '/' + directories[index];
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory, {
                    recursive: true,
                });
            }
            createLootFile(file, directory, fileName);
        });
    }
}
