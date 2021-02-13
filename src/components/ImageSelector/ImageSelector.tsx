import React, {useState} from "react";

import validate from "@/services/validate";

import styles from "./ImageSelector.module.scss";

interface ImageSelectorProps {
    prefix: string,
    imageUrl: string,
    setNewImage: React.Dispatch<File>
}

const ImageSelector = ({ prefix, imageUrl, setNewImage }: ImageSelectorProps) => {
    const [previewImage, setPreviewImage] = useState("");

    const [highlightDropArea, setHighlightDropArea] = useState(false);

    const setImage = (file: File) => {
        if(validate.image(file.type)) {
            setNewImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }

        setHighlightDropArea(false);
    }

    const handleOnDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        setImage(file);
    }

    const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0];
        setImage(file);
    }

    const previewImageSRC = previewImage ? previewImage : imageUrl;
    let labelClassNames = [
        !previewImage.length && !imageUrl.length ? styles.withoutImage : "",
        highlightDropArea ? styles.highlight : ""
    ];

    return (
        <div className={styles.imageSelector}>

            <label
                htmlFor={`${prefix}-file-input`}
                className={`${styles.label} ${labelClassNames.join(" ")}`}
                onDrop={handleOnDrop}
                onDragEnter={() => setHighlightDropArea(true)}
                onDragLeave={() => setHighlightDropArea(false)}
                onDragOver={e => e.preventDefault()}
            >
                <div className={styles.imageIcon}>
                    <i className="fas fa-image"></i>
                </div>

                { (previewImage || imageUrl) && 
                    <img
                        src={previewImageSRC}
                        className={styles.previewImage}
                        alt="Preview Image"
                    />
                }
            </label>

            <input
                type="file"
                accept="image/*"
                id={`${prefix}-file-input`}
                className={styles.input}
                onChange={handleInputFile}
                data-testid="carousel-form-input-file"
            />
        </div>
    );
}

export default ImageSelector;
