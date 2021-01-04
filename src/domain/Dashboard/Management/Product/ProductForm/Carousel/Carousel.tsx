import React, { useEffect, useState } from "react";

import validate from "@/services/validate";

import styles from "./Carousel.module.scss";

const Carousel = ({ images }: { images: Array<string> }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [currentImages, setCurrentImages] = useState<Array<string>>([]);
    const [newImages, setNewImages] = useState<Array<File>>([]);

    const [highlightDropArea, setHighlightDropArea] = useState(false);

    useEffect(() => {
	setCurrentImages(images.map(image => `/img/products/thumb-${image}`));
    }, []);

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

    const addImages = (files: FileList) => {
        for(let index = 0; index < files.length; index++) {
	    const image = files.item(index);

	    if(!validate.image(image.type)) return;

	    previewImage(image);
	}
    }

    const previewImage = (image: File) => {
	const reader = new FileReader();
	reader.onload = () => {
	    const imageURL = reader.result;
	    setCurrentImages(currentImages => [...currentImages, imageURL.toString()]);
	    setSelectedImage(currentImages.length);
	}
	reader.readAsDataURL(image);
    }

    const removeImage = (image: string) => {
	if(selectedImage === currentImages.length - 1) {
	    setSelectedImage(selectedImage - 1);
	}

	setCurrentImages(currentImages.filter(currentImage => currentImage !== image));
    }

    const getSelectedImage = () => {
	if(!currentImages[selectedImage]) return undefined;

	return currentImages[selectedImage].replace("thumb", "medium");
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

		    return (
			<div className={`${styles.imageContainer} ${imageClass}`} key={index}>
			    <img
				src={image}
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
