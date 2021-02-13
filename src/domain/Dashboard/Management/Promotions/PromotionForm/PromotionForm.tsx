import React from "react";

import Modal from "@/components/Modal";
import ImageSelector from "@/components/ImageSelector";

import styles from "./PromotionForm.module.scss";
import Input from "@/components/Formulary/Input";

interface PromotionFormProps {
    title: string,
    setTitle: React.Dispatch<string>,
    link: string,
    setLink: React.Dispatch<string>,
    image: string,
    setNewImage: React.Dispatch<File>,
    isActive: boolean,
    setIsActive: React.Dispatch<boolean>,
    onSubmit: () => void,
    prefix: string,
    loading: boolean
}

const PromotionForm = ({
    title,
    setTitle,
    link,
    setLink,
    image,
    setNewImage,
    isActive,
    setIsActive,
    onSubmit,
    prefix,
    loading
}: PromotionFormProps) => {
    const handleOnSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    }

    const imageUrl = image ? `/img/promotions/medium-${image}` : "";

    return (
        <Modal isActive={isActive} setIsActive={setIsActive}>
            <div className={styles.promotionForm}>
                { loading && 
                    <div className={styles.loaderContainer}>
                        <span className={`loader`}></span>
                    </div>
                }

                <form onSubmit={handleOnSubmit}>
                    <div className={styles.input}>
                        <Input
                            type="text"
                            id={`${prefix}-title-input`}
                            name="title"
                            label="Title"
                            value={title}
                            setValue={setTitle}
                        />
                    </div>

                    <div className={styles.input}>
                        <Input
                            type="text"
                            id={`${prefix}-link-input`}
                            name="link"
                            label="Link"
                            value={link}
                            setValue={setLink}
                        />
                    </div>

                    <div className={styles.imageSelector}>
                        <ImageSelector prefix={prefix} setNewImage={setNewImage} imageUrl={imageUrl} />
                    </div>

                    <div className={styles.buttons}>
                        <button 
                            type="submit"
                            className={`submit-button ${styles.button}`}
                        >
                            Save
                        </button>

                        <button
                            type="button"
                            className={`submit-button secondary ${styles.button}`}
                            onClick={() => setIsActive(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default PromotionForm;
