declare module 'get-repository-url' {
    export default function getRepoUrl(
        repo: string,
        cb: (err: Error, url: string) => void
    ): void;
}
