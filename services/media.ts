const MediaBlobUrl = "https://api.skillgap.co/api/media";

export class Media {
  static GetProfileImageUris = (userId: number) => {
    return {
      original: `${MediaBlobUrl}/profile_image_${userId}_original.jpg?t=${Date.now()}`,
      originalCached: `${MediaBlobUrl}/profile_image_${userId}_original.jpg`,
      small: `${MediaBlobUrl}/profile_image_${userId}_thumbnail_small.jpg?t=${Date.now()}`,
      medium: `${MediaBlobUrl}/profile_image_${userId}_thumbnail_medium.jpg?t=${Date.now()}`,
      large: `${MediaBlobUrl}/profile_image_${userId}_thumbnail_large.jpg?t=${Date.now()}`,
    };
  };

  static GetCoverImageUris = (userId: number) => {
    return {
      original: `${MediaBlobUrl}/cover_image_${userId}_original.jpg?t=${Date.now()}`,
      originalCached: `${MediaBlobUrl}/cover_image_${userId}_original.jpg`,
      small: `${MediaBlobUrl}/cover_image_${userId}_thumbnail_small.jpg?t=${Date.now()}`,
      medium: `${MediaBlobUrl}/cover_image_${userId}_thumbnail_medium.jpg?t=${Date.now()}`,
      large: `${MediaBlobUrl}/cover_image_${userId}_thumbnail_large.jpg?t=${Date.now()}`,
    };
  };

  static GetCategoryImageUris = (categoryId: number) => {
    return {
      original: `${MediaBlobUrl}/category_image_${categoryId}_original.jpg?t=${Date.now()}`,
      originalCached: `${MediaBlobUrl}/category_image_${categoryId}_original.jpg`,
      small: `${MediaBlobUrl}/category_image_${categoryId}_thumbnail_small.jpg?t=${Date.now()}`,
      medium: `${MediaBlobUrl}/category_image_${categoryId}_thumbnail_medium.jpg?t=${Date.now()}`,
      large: `${MediaBlobUrl}/category_image_${categoryId}_thumbnail_large.jpg?t=${Date.now()}`,
    };
  };
}
