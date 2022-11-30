function joinUrl(...segments: string[]) {
    return segments.join("/")
}

export const PROJECT_REPO = joinUrl(APP_REPOSITORY_URL)
export const PROJECT_DOCS = joinUrl(PROJECT_REPO)
export const PROJECT_ISSUES = joinUrl(PROJECT_REPO, "issues")
export const PROJECT_RELEASES = joinUrl(PROJECT_REPO, "releases")