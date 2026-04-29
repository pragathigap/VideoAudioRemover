import React from 'react';
import ToolPage from './ToolPage';

const Home: React.FC = () => {
  return (
    <ToolPage 
      mode="all"
      title="Mute or Extract <span class='gradient-text'>Magic</span>"
      description="Upload a video, remove its audio, or extract MP3 audio."
      primaryKeyword="remove audio from video without losing quality"
    />
  );
};

export default Home;
