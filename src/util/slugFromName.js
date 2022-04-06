import slugify from 'slugify'

export const slugFromName = (string) => {
  return slugify(string, {
    replacement: '-',
    lower: true
  })
}
