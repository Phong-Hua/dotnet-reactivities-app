import React from 'react';
import {Cropper} from 'react-cropper';
import 'cropperjs/dist/cropper.css';    // import css

interface Props {
    imagePreview: string;
    setCropper: (cropper: Cropper) => void;
}

export default function PhotoWidgetCropper({imagePreview, setCropper} : Props) {
    return (
        <Cropper 
            src={imagePreview}
            style={{height: 200, width: '100%'}}
            initialAspectRatio={1}  // enforce square images
            aspectRatio={1} // enfore square images
            preview='.img-preview'
            guides={false}
            viewMode={1}
            autoCropArea={1}
            background={false}
            onInitialized={(cropper : Cropper) => setCropper(cropper)}
        />
    )
}