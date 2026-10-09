// Digital Object Identifiers. An article's DOI is stored bare
// ("10.12345/gsj.2023.1.1"); wherever it is shown it is a full
// https://doi.org/ link, which is how Crossref requires members to
// display DOIs.

// Accepts what an editor might paste — a bare DOI, "doi:10.…", or a
// doi.org link — and returns the bare DOI, or '' if it isn't one.
export function normalizeDoi(input: string): string {
  const doi = input
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
    .replace(/^doi:\s*/i, '')
  return /^10\.\d{4,9}\/\S+$/.test(doi) ? doi : ''
}

export function doiUrl(doi: string): string {
  return `https://doi.org/${doi}`
}
