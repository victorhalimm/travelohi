import React from 'react';
import style from './BackgroundImage.module.scss';

// Define props type for TypeScript (if you're using it)
interface BackgroundImageProps {
  imageUrl: string;
  children?: React.ReactNode;
}

const BackgroundImage = ({ imageUrl, children }: BackgroundImageProps) => {
    return (
        <>
            <div className={style.backgroundImage} style={{ backgroundImage: `url(${imageUrl})` }}>
                <div className='z-10'>
                    {children}
                </div>
            </div>

            <div style={{ height: '90vh' }}></div>
        </>
    );
}

export default BackgroundImage;
