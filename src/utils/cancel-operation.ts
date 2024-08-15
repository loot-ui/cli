import { cancel } from '@clack/prompts';
export function cancelOperation() {
    cancel('Operation cancelled.');
    process.exit(0);
}
