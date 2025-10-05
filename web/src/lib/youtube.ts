interface YouTubeVideo {
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  publishedAt: string;
}

export async function fetchYouTubeVideos(): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch(
      'https://www.youtube.com/feeds/videos.xml?channel_id=UCQgkI83Fwlh4ncl_4tK6dSg'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch YouTube feed');
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    const entries = xmlDoc.querySelectorAll('entry');
    const videos: YouTubeVideo[] = [];

    entries.forEach((entry) => {
      const title = entry.querySelector('title')?.textContent || '';
      const link = entry.querySelector('link')?.getAttribute('href') || '';
      const mediaGroup = entry.querySelector('group');
      const description = mediaGroup?.querySelector('description')?.textContent || '';
      const thumbnail = mediaGroup?.querySelector('thumbnail')?.getAttribute('url') || '';
      const published = entry.querySelector('published')?.textContent || '';

      videos.push({
        title,
        description,
        thumbnail,
        url: link,
        publishedAt: published,
      });
    });

    return videos;
  } catch (error) {
    console.error('Error fetching YouTube feed:', error);
    return [];
  }
}
