import React from 'react';
import ToolPage from './ToolPage';

const RemoveAudio: React.FC = () => {
  return (
    <ToolPage 
      mode="mute"
      title="Remove <span class='gradient-text'>Audio from Video</span>"
      description="Fast, browser-based tool to mute your videos. No uploads required."
    />
  );
};

export default RemoveAudio;
