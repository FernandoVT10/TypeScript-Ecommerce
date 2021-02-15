import React, { useContext, useRef, useState } from "react";

import AlertsContext from "@/contexts/AlertsContext";

import ConfirmationModal from "@/components/ConfirmationModal";
import Layout from "@/components/Dashboard/Layout";

import ApiController from "@/services/ApiController";

import EditCarousel from "./EditCarousel";
import AddCarousel from "./AddCarousel";

import styles from "./Carousel.module.scss";

export interface CarouselItem {
    _id: string,
    image: string,
    link: string
}

export interface CarouselProps {
    carouselItems: CarouselItem[]
}

interface APIResponse {
    error: string,
    message: string,
    data: {
        deletedCarouselItem: CarouselItem
    }
}

const Carousel = ({ carouselItems }: CarouselProps) => {
    const [carouseelItemToEdit, setCarouselItemToEdit] = useState<CarouselItem>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isActiveConfirmation, setIsActiveConfirmation] = useState(false);

    const [items, setItems] = useState(carouselItems);

    const carouselItemIdToDelete = useRef("");

    const alertsController = useContext(AlertsContext);

    const handleEditButton = (carouselItem: CarouselItem) => {
        setCarouselItemToEdit(carouselItem);
        setIsEditing(true);
    }

    const handleDeleteButton = (carouselItemId: string) => {
        setIsActiveConfirmation(true);
        carouselItemIdToDelete.current = carouselItemId;
    }

    const deleteCarouselItem = async () => {
        const carouselItemId = carouselItemIdToDelete.current;
        const res = await ApiController.delete<APIResponse>(`carousel/${carouselItemId}`);

        if(res.error) return alertsController.createAlert("danger", res.message);

        setItems(items.filter(item => item._id !== carouselItemId));
    }

    return (
        <Layout>
            <div className={styles.carousel}>
                <ConfirmationModal
                    message="Are you sure to delete this item?"
                    isActive={isActiveConfirmation}
                    setIsActive={setIsActiveConfirmation}
                    onConfirm={deleteCarouselItem}
                />

                <EditCarousel
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    carouselItem={carouseelItemToEdit}
                    setCarouselItems={setItems}
                />

                <AddCarousel
                    isActive={isCreating}
                    setIsActive={setIsCreating}
                    setCarouselItems={setItems}
                />

                <div className={styles.header}>
                    <h2 className={styles.title}>Carousel Items</h2>

                    <button
                        className={styles.addButton}
                        onClick={() => setIsCreating(true)}
                    >
                        <i className="fas fa-plus"></i>
                    </button>
                </div>

                <div className={styles.carouselItems}>
                    {items.map((item, index) => {
                        return (
                            <div className={styles.carouselItem} key={index}>
                                <img
                                    src={`/img/carousel/medium-${item.image}`}
                                    className={styles.image}
                                    alt="Carousel Item Image"
                                />

                                <div className={styles.buttons}>
                                    <button
                                        className={styles.button}
                                        onClick={() => handleEditButton(item)}
                                        data-testid="edit-carousel-item"
                                    >
                                        <i className="fas fa-pencil-alt"></i>
                                    </button>

                                    <button
                                        className={styles.button}
                                        onClick={() => handleDeleteButton(item._id)}
                                        data-testid="delete-carousel-item"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                { items.length === 0 &&
                    <div className={styles.withoutItems}>
                        There are no items to display.
                    </div>
                }
            </div>
        </Layout>
    );
}

export default Carousel;
