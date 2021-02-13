import React, { useEffect, useState } from "react";

import Modal from "@/components/Modal";
import ImageSelector from "@/components/ImageSelector";
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
    useEffect(() => {
        if(!isEditing) {
            // setPreviewImage("");
        }
    }, [isEditing]);

    const handleForm = (e: React.FormEvent) => {
        e.preventDefault();

        onSubmit();
    }

    const imageUrl = image ? `/img/carousel/medium-${image}` : "";

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
                        <ImageSelector prefix={prefix} imageUrl={imageUrl} setNewImage={setImage}/>
                    </div>

                    <div className={styles.buttons}>
                        <button className={`${styles.button} submit-button`}>Save</button>

                        <button
                            type="button"
                            className={`${styles.button} submit-button secondary`}
                            onClick={() => setIsEditing(false)}
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
