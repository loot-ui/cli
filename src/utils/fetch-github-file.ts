export async function fetchGithubFile(url: string) {
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.blob();
        return data;
    } else {
        throw new Error(`Failed to fetch file ${url}`);
    }
}
