'use client';

interface VideoPlayerProps {
  url: string;
  title: string;
}

export const VideoPlayer = ({ url, title }: VideoPlayerProps) => {
  // Extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // If not YouTube, return the URL as-is (could be direct video URL)
    return url;
  };

  const embedUrl = getYouTubeEmbedUrl(url);

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
      <iframe
        width="100%"
        height="100%"
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0"
      />
    </div>
  );
};
