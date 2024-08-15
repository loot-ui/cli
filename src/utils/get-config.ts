import fetch from 'node-fetch';
import getRepoUrl from 'get-repository-url';
import * as parser from '@typescript-eslint/parser';
import { traverse, utils as estreeUtils } from 'estree-toolkit';
import { Config } from './define-config';
import { fetchGithubFile } from './fetch-github-file';

export async function getConfig(packageName: string) {
    const urlPromise = new Promise<string>((resolve, reject) => {
        getRepoUrl(packageName, async (err, url) => {
            if (err) {
                reject(err);
            } else {
                const urlWithoutGithub = url.replace('https://github.com/', '');
                try {
                    const response = await fetch(
                        'https://api.github.com/repos/' + urlWithoutGithub
                    );
                    const data = await (response.json() as Promise<{
                        default_branch: string;
                    }>);

                    const defaultBranch = data.default_branch;
                    resolve(
                        'https://raw.githubusercontent.com/' +
                            urlWithoutGithub +
                            '/' +
                            defaultBranch +
                            '/'
                    );
                } catch (error) {
                    reject(error);
                }
            }
        });
    });

    const githubBaseUrl = await urlPromise;
    const lootConfigUrl = githubBaseUrl + 'lootui.config.ts';

    const lootConfigFile = fetchGithubFile(lootConfigUrl);

    const data = await (await lootConfigFile).text();

    const ast = parser.parse(data);

    const configPromise = new Promise<Config>((resolve, reject) => {
        traverse(ast, {
            ObjectExpression(path) {
                const configObject = estreeUtils.evaluate(path);

                if (
                    configObject &&
                    configObject.value &&
                    typeof configObject.value === 'object' &&
                    'components' in configObject.value
                ) {
                    resolve(configObject.value as Config);
                } else {
                    reject(new Error('Invalid configuration format'));
                }
                this.stop();
            },
        });
    });

    const config = await configPromise;

    return { config, githubBaseUrl };
}
