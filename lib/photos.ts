// Every photo slot on the public site, in one place. A slot with
// `src: null` shows an empty placeholder frame until GoGMI supplies the
// photo. To fill one: put the file in /public/photos/ and set `src` to
// its path (e.g. '/photos/gogmi-office.jpg'), then write a short `alt`
// describing what the photo shows.
export type PhotoSlot = { src: string | null; alt: string; width: number; height: number }

export const photos = {
  // Home page, under "About the journal"
  homeAbout: { src: null, alt: '', width: 1200, height: 800 },
  // About page, between the journal description and "Scope"
  aboutInstitute: { src: null, alt: '', width: 1600, height: 900 },
  // Contact page, above the office address
  contactOffice: { src: null, alt: '', width: 1200, height: 800 },
} satisfies Record<string, PhotoSlot>
