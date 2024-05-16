import React from 'react';

interface ImagePanelProps {
    src: string; 
}

const ImagePanel: React.FC<ImagePanelProps> = ({src}) => {
    return (
        <div className="w-1of2 image-wrapper">
            <img src={src} alt="" />
        </div>
    );
}

export default ImagePanel;
