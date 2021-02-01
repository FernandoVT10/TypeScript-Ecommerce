import React, { useContext, useEffect, useState } from "react";

import AlertsContext from "@/contexts/AlertsContext";

import ApiController from "@/services/ApiController";

import CarouselForm from "../CarouselForm";

import { CarouselItem } from "../Carousel";

interface EditCarouselProps {
    isEditing: boolean,
    setIsEditing: React.Dispatch<boolean>,
    carouselItem: CarouselItem,
    setCarouselItems: React.Dispatch<React.SetStateAction<CarouselItem[]>>
}

interface APIResponse {
    error: string,
    message: string,
    data: {
        updatedCarouselItem: CarouselItem
    }
}

const EditCarousel = ({ isEditing, setIsEditing, carouselItem, setCarouselItems }: EditCarouselProps) => {
    const [link, setLink] = useState("");
    const [newImage, setNewImage] = useState<File>(null);
    const [loading, setLoading] = useState(false);

    const alertsController = useContext(AlertsContext);

    useEffect(() => {
        if(!carouselItem) return;

        setLink(carouselItem.link);
    }, [carouselItem])

    const editCarousel = async () => {
        const formData = new FormData;

        formData.append("link", link);

        if(newImage) {
            formData.append("newImage", newImage);
        }

        setLoading(true);

        const res = await ApiController.put<APIResponse>(`carousel/${carouselItem._id}`, { formData });
        
        setLoading(false);

        if(res.error) {
            return alertsController.createAlert("danger", res.message);
        }

        const { updatedCarouselItem } = res.data;

        setCarouselItems(prevItems => prevItems.map(item => {
            console.log(item._id === updatedCarouselItem._id);

            if(item._id === updatedCarouselItem._id) return updatedCarouselItem;
            return item;
        }));

        alertsController.createAlert("success", "The carousel item has been updated successfully");
        setIsEditing(false);

        setNewImage(null);
    }

    const image = carouselItem ? carouselItem.image : null;

    return (
        <CarouselForm
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            image={image}
            setImage={setNewImage}
            link={link}
            setLink={setLink}
            onSubmit={editCarousel}
            prefix="edit-carousel"
            loading={loading}
        />
    );
}

export default EditCarousel;
