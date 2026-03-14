import React from 'react';
import ToolPage from './ToolPage';

const ExtractMP3: React.FC = () => {
  return (
    <ToolPage
      mode="extract"
      title="Extract <span class='gradient-text'>MP3 Audio</span>"
      description="Quickly extract high-quality audio from any video file directly in your browser."
    />
  );
};

export default ExtractMP3;
