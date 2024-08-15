import { confirm, isCancel, select } from '@clack/prompts';
import { addOption } from './add-option';
import { cancelOperation } from './cancel-operation';
import { Component } from './define-config';
import pc from 'picocolors';

export async function AddComponent(
    component: Component,
    githubBaseUrl: string
) {
    if (component.options.length === 1) {
        const option = component.options[0];

        const shouldContinue = await confirm({
            message: `For component ${pc.bold(
                component.name
            )} available only option ${pc.bold(
                option.name
            )}. Do you want to add it?`,
        });

        if (isCancel(shouldContinue)) {
            cancelOperation();
        }
        if (shouldContinue) {
            await addOption(option, githubBaseUrl, component);
        } else {
            cancelOperation();
        }
    } else {
        const option = await select({
            message: `Pick an option for ${component.name}`,
            options: component.options.map((option, index) => ({
                value: index,
                label: option.name,
            })),
        });

        if (isCancel(option)) {
            cancelOperation();
        }

        if (typeof option === 'number') {
            await addOption(
                component.options[option],
                githubBaseUrl,
                component
            );
        } else {
            cancelOperation();
        }
    }
}
