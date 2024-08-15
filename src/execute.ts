#!/usr/bin/env node
import {
    intro,
    isCancel,
    multiselect,
    outro,
    spinner as s,
    select,
} from '@clack/prompts';
import { getConfig } from './utils/get-config';
import { AddComponent } from './utils/add-component';
import pc from 'picocolors';
import { cancelOperation } from './utils/cancel-operation';

const packageName = process.argv[2];

async function loadPackage(packageName: string) {
    const spinner = s();
    intro(pc.bgMagenta(pc.yellow('Loot ui!')));
    spinner.start(
        `Looking for the package ${pc.bgGreen(
            pc.bold(packageName)
        )} loot config`
    );

    const { config, githubBaseUrl } = await getConfig(packageName);

    spinner.stop(pc.green('Config was found'));

    if (config.components.length === 1) {
        const component = config.components[0];
        await AddComponent(component, githubBaseUrl);
    } else {
        const components = await multiselect({
            message: `Pick components`,
            options: config.components.map((component, index) => ({
                value: index,
                label: component.name,
            })),
        });

        if (isCancel(components)) {
            cancelOperation();
        }

        if (Array.isArray(components)) {
            for (const componentIndex of components) {
                if (typeof componentIndex === 'number') {
                    const component = config.components[componentIndex];
                    await AddComponent(component, githubBaseUrl);
                }
            }
        }
    }

    outro(pc.green(`You're all set!`));
}

if (packageName) {
    loadPackage(packageName);
} else {
    outro(pc.red('package name was not provided'));
}
