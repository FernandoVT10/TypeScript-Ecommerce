import React, { useContext, useEffect, useState } from "react";

import AlertsContext from "@/contexts/AlertsContext";

import ApiController from "@/services/ApiController";

import CarouselForm from "../CarouselForm";

import { CarouselItem } from "../Carousel";

interface AddCarouselProps {
    isActive: boolean,
    setIsActive: React.Dispatch<boolean>,
    setCarouselItems: React.Dispatch<React.SetStateAction<CarouselItem[]>>
}

interface APIResponse {
    error: string,
    message: string,
    data: {
        createdCarouselItem: CarouselItem
    }
}

const AddCarousel = ({ isActive, setIsActive, setCarouselItems }: AddCarouselProps) => {
    const [link, setLink] = useState("");
    const [image, setImage] = useState<File>(null);
    const [loading, setLoading] = useState(false);

    const alertsController = useContext(AlertsContext);

    const addCarousel = async () => {
        if(!image) return alertsController.createAlert("danger", "The image is required");

        const formData = new FormData;
        formData.append("link", link);
        formData.append("image", image);

        setLoading(true);

        const res = await ApiController.post<APIResponse>(`carousel`, { formData });
        
        setLoading(false);

        if(res.error) {
            return alertsController.createAlert("danger", res.message);
        }

        const { createdCarouselItem } = res.data;

        setCarouselItems(prevItems => [...prevItems, createdCarouselItem]);

        alertsController.createAlert("success", "The carousel item has been created successfully");
        setIsActive(false);

        setImage(null);
        setLink("");
    }

    return (
        <CarouselForm
            isEditing={isActive}
            setIsEditing={setIsActive}
            image={null}
            setImage={setImage}
            link={link}
            setLink={setLink}
            onSubmit={addCarousel}
            prefix="add-carousel"
            loading={loading}
        />
    );
}

export default AddCarousel;
