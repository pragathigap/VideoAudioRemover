import React from 'react';
import ToolPage from './ToolPage';

const AddAudio: React.FC = () => {
  return (
    <ToolPage 
      mode="add-audio"
      title='Add <span class="gradient-text">Audio to Video</span>'
      description="Merge an external audio file with your video. Perfect for adding background music or replacing narrations."
    />
  );
};

export default AddAudio;
