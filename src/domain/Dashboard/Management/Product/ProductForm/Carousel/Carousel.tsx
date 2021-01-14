import React, { useState } from "react";

import validate from "@/services/validate";

import styles from "./Carousel.module.scss";

interface CarouselProps {
    images: string[],
    setNewImages: React.Dispatch<React.SetStateAction<File[]>>,
    setDeletedImages: React.Dispatch<React.SetStateAction<string[]>>
}

interface CurrentImage {
    isNewImage: boolean,
    data: string,
    name: string
}

const Carousel = ({ images, setNewImages, setDeletedImages }: CarouselProps) => {
    const [selectedImage, setSelectedImage] = useState(0);

    const [currentImages, setCurrentImages] = useState<CurrentImage[]>(
        images.map(image => ({
            isNewImage: false,
            data: null,
            name: image
        }))
    );

    const [highlightDropArea, setHighlightDropArea] = useState(false);

    const previewImage = (image: File) => {
        const reader = new FileReader();

        reader.onload = () => {
            const imageURL = reader.result;
            setCurrentImages(currentImages => [
                ...currentImages,
                {
                    isNewImage: true, 
                    data: imageURL.toString(),
                    name: image.name
                }
            ]);
            setSelectedImage(currentImages.length);
        }

        reader.readAsDataURL(image);
    }

    const addImages = (files: FileList) => {
        const images: File[] = [];

        for(let index = 0; index < files.length; index++) {
            const image = files.item(index);

            if(!validate.image(image.type)) return;

            images.push(image);
            previewImage(image);
        }

        setNewImages(newImages => newImages.concat(images));
    }

    const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;

        addImages(files);
    }

    const handleDrop = (e: React.DragEvent) => {
        e.stopPropagation();
        e.preventDefault();

        setHighlightDropArea(false);

        const { files } = e.dataTransfer;

        addImages(files);
    }

    const removeImage = (image: CurrentImage) => {
        if(selectedImage === currentImages.length - 1) {
            setSelectedImage(selectedImage - 1);
        }

        if(image.isNewImage) {
            setNewImages(
                newImages => newImages.filter(newImage => newImage.name !== image.name)
            );
        } else {
            setDeletedImages(deletedImages => [...deletedImages, image.name]);
        }

        setCurrentImages(
            currentImages.filter(currentImage => currentImage.name !== image.name)
        );
    }

    const getSelectedImage = () => {
        const selectedImageObj = currentImages[selectedImage];

        if(!selectedImageObj) return undefined;

        if(selectedImageObj.isNewImage) return selectedImageObj.data;

        return `/img/products/medium-${selectedImageObj.name}`;
    }


    const dropAreaClass = highlightDropArea ? styles.highlight : "";

    return (
        <div className={styles.carousel}>
            <div 
                className={`${styles.dropArea} ${dropAreaClass}`}
                onDrop={handleDrop}
                onDragEnter={() => setHighlightDropArea(true)}
                onDragLeave={() => setHighlightDropArea(false)}
                onDragOver={e => e.preventDefault()}
            >
                { getSelectedImage() !== undefined ?
                    <div className={styles.selectedImageContainer}>
                        <img
                            src={getSelectedImage()}
                            className={styles.selectedImage}
                            alt="Carousel Selected Image"
                        />
                    </div>
                    :
                    <div className={styles.dropLabel}>
                        Drag and drop files .jpg, .jpeg or .png
                    </div>
                }
            </div>

            <div className={styles.images}>
                {currentImages.map((image, index) => {
                    const imageClass = index === selectedImage ? styles.active : "";

                    const imageSrc = image.isNewImage ? image.data : `/img/products/thumb-${image.name}`;

                    return (
                        <div className={`${styles.imageContainer} ${imageClass}`} key={index}>
                            <img
                                src={imageSrc}
                                className={styles.image}
                                onClick={() => setSelectedImage(index)}
                                alt="Carousel Thumb Image"
                            />

                            <button
                                className={styles.removeImage}
                                onClick={() => removeImage(image)}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    );
                })}

                <input
                    type="file"
                    className={styles.addImageInput}
                    id="add-image"
                    accept="image/*"
                    onChange={handleInputFile}
                    multiple
                />

                <label htmlFor="add-image" className={styles.addImage}>
                    <i className="fas fa-plus"></i>
                </label>
            </div>
        </div>
    );
}

export default Carousel;
