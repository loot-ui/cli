import { spinner as s, confirm, isCancel } from '@clack/prompts';
import { execa } from 'execa';
import { detect } from 'detect-package-manager';
import { Component, LootOption } from './define-config';
import { addOptionFiles } from './add-option-files';
import pc from 'picocolors';
import { cancelOperation } from './cancel-operation';
export async function addOption(
    option: LootOption,
    githubBaseUrl: string,
    component: Component
) {
    const spinner = s();
    spinner.start(`Copying files`);
    await addOptionFiles(option, githubBaseUrl, component.name);
    spinner.stop(pc.green(`Files were copied successfully.`));
    if (option.dependencies || option.devDependencies) {
        const shouldInstallDependencies = await confirm({
            message: `Should we install dependencies?`,
        });
        if (shouldInstallDependencies) {
            const packageManager = await detect();
            if (option.dependencies?.length) {
                await execa(
                    packageManager,
                    [
                        packageManager === 'npm' ? 'install' : 'add',
                        ...option.dependencies,
                    ],
                    {
                        cwd: process.cwd(),
                    }
                );
            }

            if (option.devDependencies?.length) {
                await execa(
                    packageManager,
                    [
                        packageManager === 'npm' ? 'install' : 'add',
                        '-D',
                        ...option.devDependencies,
                    ],
                    {
                        cwd: process.cwd(),
                    }
                );
            }

            if (isCancel(shouldInstallDependencies)) {
                cancelOperation();
            }
        }
    }
}
