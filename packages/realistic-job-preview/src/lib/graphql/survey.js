export const list = `
  query realisticJobPreviews(
    $localeKey: String
  ) {
    realisticJobPreviews(
      localeKey: $localeKey
    ) {
      description
      descriptionTranslations {
        locale
        value
      }
      id
      name
      nameTranslations {
        locale
        value
      }
    }
  }
`;

export const path = "/realistic-job-previews/graphql";
