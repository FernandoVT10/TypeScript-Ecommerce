import React, { useContext, useEffect, useState } from "react";

import AlertsContext from "@/contexts/AlertsContext";

import ApiController from "@/services/ApiController";

import PromotionForm from "../PromotionForm";

import { Promotion } from "../";

interface AddPromotionProps {
    setPromotions: React.Dispatch<React.SetStateAction<Promotion[]>>
    isActive: boolean,
    setIsActive: React.Dispatch<boolean>
}

interface APIResponse {
    error: string,
    message: string,
    data: {
        createdPromotion: Promotion
    }
}

const AddPromotion = ({ setPromotions, isActive, setIsActive }: AddPromotionProps) => {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [imageFile, setImageFile] = useState<File>(null);

    const [loading, setLoading] = useState(false);

    const alertsController = useContext(AlertsContext);

    const editPromotion = async () => {
        if(!imageFile) return alertsController.createAlert("danger", "The image is required");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("link", link);
        formData.append("image", imageFile);

        setLoading(true);

        const res = await ApiController.post<APIResponse>("promotions", { formData });

        setLoading(false);

        if(res.error) return alertsController.createAlert("danger", res.message);

        const { createdPromotion } = res.data;

        setPromotions(promotions => [...promotions, createdPromotion]);

        setIsActive(false);

        setTitle("");
        setLink("");
        setImageFile(null);

        alertsController.createAlert("success", "The promotion has been created successfully");
    }

    return (
        <PromotionForm
            title={title}
            setTitle={setTitle}
            link={link}
            setLink={setLink}
            image={null}
            setNewImage={setImageFile}
            isActive={isActive}
            setIsActive={setIsActive}
            onSubmit={editPromotion}
            prefix="edit-promotion"
            loading={loading}
        />
    );
}

export default AddPromotion;
