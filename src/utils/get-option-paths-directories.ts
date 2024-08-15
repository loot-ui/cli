import path from 'path';
export function getOptionPathsDirectories(paths: string[]) {
    let base = '';
    let shortestPath: string[] = [];

    paths.forEach((path) => {
        const pathParts = path.split('/');
        if (shortestPath.length === 0) {
            shortestPath = pathParts;
        }
        if (pathParts.length < shortestPath.length) {
            shortestPath = pathParts;
        }
    });

    shortestPath.forEach((part) => {
        if (
            paths.map((i) => i.startsWith(base + part + '/')).filter(Boolean)
                .length === paths.length
        ) {
            base += part + '/';
        }
    });

    const pathsWithoutBase = paths.map((path) => path.slice(base.length));

    const emptyPath = pathsWithoutBase.find((path) => path === '');

    if (emptyPath) {
        throw new Error('Something wrong with package configuration');
    }

    return pathsWithoutBase.map((i) => path.dirname(i));
}
