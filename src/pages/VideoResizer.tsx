import React from 'react';
import ToolPage from './ToolPage';

const VideoResizer: React.FC = () => {
  return (
    <ToolPage 
      mode="resize-video"
      title="Video <span class='gradient-text'>Resizer</span>"
      description="Resize your videos to 1080p, 720p, or custom dimensions while keeping quality."
    />
  );
};

export default VideoResizer;
