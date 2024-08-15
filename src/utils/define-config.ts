export interface LootOption {
    name: string;
    paths: string[];
    dependencies?: string[];
    devDependencies?: string[];
}

export interface Component {
    name: string;
    options: LootOption[];
}

export interface Config {
    components: Component[];
}
export function defineConfig(config: Config) {
    return undefined;
}
