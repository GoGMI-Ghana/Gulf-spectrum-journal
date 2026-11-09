// Every photo slot on the public site, in one place. A slot with
// `src: null` shows an empty placeholder frame until GoGMI supplies the
// photo. To fill one: put the file in /public/photos/ and set `src` to
// its path (e.g. '/photos/gogmi-office.jpg'), then write a short `alt`
// describing what the photo shows.
export type PhotoSlot = { src: string | null; alt: string; width: number; height: number }

export const photos = {
  // Home page, under "About the journal"
  homeAbout: {
    src: '/journal-about.png',
    alt: 'Researchers discussing papers around a meeting table, with a port and cargo ships visible through the window',
    width: 1672,
    height: 941,
  },
  // About page, between the journal description and "Scope"
  aboutInstitute: {
    src: '/journal-about.png',
    alt: 'Researchers discussing papers around a meeting table, with a port and cargo ships visible through the window',
    width: 1672,
    height: 941,
  },
  // Contact page, above the office address
  contactOffice: { src: null, alt: '', width: 1200, height: 800 },
} satisfies Record<string, PhotoSlot>
