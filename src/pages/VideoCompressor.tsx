import React from 'react';
import ToolPage from './ToolPage';

const VideoCompressor: React.FC = () => {
  return (
    <ToolPage 
      mode="compress-video"
      title="Video <span class='gradient-text'>Compressor</span>"
      description="Reduce video file size without losing quality. Perfect for sharing or storage."
    />
  );
};

export default VideoCompressor;
