import React, {useState} from "react";

import Modal from "@/components/Modal";
import Input from "@/components/Formulary/Input";

import validate from "@/services/validate";

import styles from "./CarouselForm.module.scss";

interface CarouselFormProps {
    isEditing: boolean,
    setIsEditing: React.Dispatch<boolean>,
    image: string,
    setImage: React.Dispatch<File>,
    link: string,
    setLink: React.Dispatch<string>,
    onSubmit: () => void,
    prefix: string,
    loading: boolean
}

const CarouselForm = ({
    isEditing,
    setIsEditing,
    image,
    setImage,
    link,
    setLink,
    onSubmit,
    prefix,
    loading
}: CarouselFormProps) => {
    const [previewImage, setPreviewIma] = useState("");

    const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0];

        if(validate.image(file.type)) {
            setImage(file);
            setPreviewIma(URL.createObjectURL(file));
        }
    }

    const handleForm = (e: React.FormEvent) => {
        e.preventDefault();

        onSubmit();
    }

    const previewImageSRC = previewImage ? previewImage : `/img/carousel/medium-${image}`;
    const labelClassName = !previewImage && !image ? styles.withoutImage : "";

    return (
        <Modal isActive={isEditing} setIsActive={setIsEditing}>
            <div className={styles.carouselForm}>
                { loading &&
                    <div className={styles.loaderContainer}>
                        <span className="loader"></span>
                    </div>
                }

                <form onSubmit={handleForm}>
                    <Input
                        type="text"
                        name="link"
                        id={`${prefix}-link`}
                        label="Link"
                        value={link}
                        setValue={setLink}
                    />

                    <div className={styles.imageContainer}>
                        <label
                            htmlFor={`${prefix}-file-input`}
                            className={`${styles.label} ${labelClassName}`}
                        >
                            <div className={styles.imageIcon}>
                                <i className="fas fa-image"></i>
                            </div>

                            { (previewImage || image ) && 
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
                        />
                    </div>

                    <div className={styles.buttons}>
                        <button className={`${styles.button} submit-button`}>Save</button>

                        <button
                            type="button"
                            className={`${styles.button} submit-button secondary`}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default CarouselForm;
