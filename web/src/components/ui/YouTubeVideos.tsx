'use client';
import { useEffect, useState } from 'react';

interface YouTubeVideo {
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  publishedAt: string;
}

interface YouTubeVideosProps {
  blogLink?: {
    text: string;
    url: string;
  };
}

export default function YouTubeVideos({ blogLink }: YouTubeVideosProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        // Use our API endpoint to bypass CORS
        const response = await fetch('/api/youtube');

        if (!response.ok) {
          throw new Error('Failed to fetch YouTube feed');
        }

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        const entries = xmlDoc.querySelectorAll('entry');
        const fetchedVideos: YouTubeVideo[] = [];

        entries.forEach((entry) => {
          const title = entry.querySelector('title')?.textContent || '';
          const link = entry.querySelector('link')?.getAttribute('href') || '';
          const mediaGroup = entry.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'group')[0];
          const description = mediaGroup?.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'description')[0]?.textContent || '';
          const thumbnail = mediaGroup?.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'thumbnail')[0]?.getAttribute('url') || '';
          const published = entry.querySelector('published')?.textContent || '';

          fetchedVideos.push({
            title,
            description,
            thumbnail,
            url: link,
            publishedAt: published,
          });
        });

        setVideos(fetchedVideos);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching YouTube feed:', err);
        setError('Failed to load videos');
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="product-transition__scrollable">
        {blogLink && (
          <div className="product-transition__blog-link">
            <a href={blogLink.url} target="_blank" rel="noopener noreferrer">
              {blogLink.text} →
            </a>
          </div>
        )}
        <div className="product-transition__loading">Loading videos...</div>
      </div>
    );
  }

  if (error || videos.length === 0) {
    return (
      <div className="product-transition__scrollable">
        {blogLink && (
          <div className="product-transition__blog-link">
            <a href={blogLink.url} target="_blank" rel="noopener noreferrer">
              {blogLink.text} →
            </a>
          </div>
        )}
        <div className="product-transition__error">
          Unable to load videos. Please visit our{' '}
          <a
            href="https://www.youtube.com/channel/UCQgkI83Fwlh4ncl_4tK6dSg"
            target="_blank"
            rel="noopener noreferrer"
          >
            YouTube channel
          </a>
          .
        </div>
      </div>
    );
  }

  return (
    <div className="product-transition__scrollable">
      {blogLink && (
        <div className="product-transition__blog-link">
          <a href={blogLink.url} target="_blank" rel="noopener noreferrer">
            {blogLink.text} →
          </a>
        </div>
      )}
      <div className="product-transition__video-scroll">
        {videos.map((video, idx) => (
          <a
            key={idx}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="product-transition__video-card"
          >
            <div className="product-transition__video-thumbnail">
              <img src={video.thumbnail} alt={video.title} />
            </div>
            <h4 className="product-transition__video-title">{video.title}</h4>
            <p className="product-transition__video-description">
              {video.description.length > 100
                ? `${video.description.substring(0, 100)}...`
                : video.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
