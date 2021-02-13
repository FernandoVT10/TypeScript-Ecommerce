import React, { useContext, useEffect, useState } from "react";

import AlertsContext from "@/contexts/AlertsContext";

import ApiController from "@/services/ApiController";

import PromotionForm from "../PromotionForm";

import { Promotion } from "../";

interface EditPromotionProps {
    promotion: Promotion,
    setPromotions: React.Dispatch<React.SetStateAction<Promotion[]>>
    isActive: boolean,
    setIsActive: React.Dispatch<boolean>
}

interface APIResponse {
    error: string,
    message: string,
    data: {
        updatedPromotion: Promotion
    }
}

const EditPromotion = ({ promotion, setPromotions, isActive, setIsActive }: EditPromotionProps) => {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [imageFile, setImageFile] = useState<File>(null);

    const [loading, setLoading] = useState(false);

    const alertsController = useContext(AlertsContext);

    useEffect(() => {
        if(promotion) {
            setTitle(promotion.title);
            setLink(promotion.link);
            setImageFile(null);
        }
    }, [promotion])

    const editPromotion = async () => {
        const formData = new FormData();

        formData.append("title", title);
        formData.append("link", link);

        if(imageFile) {
            formData.append("newImage", imageFile);
        }

        setLoading(true);

        const res = await ApiController.put<APIResponse>(`promotions/${promotion._id}`, { formData });

        setLoading(false);

        if(res.error) return alertsController.createAlert("danger", res.message);

        const { updatedPromotion } = res.data;

        setPromotions(promotions => promotions.map(promotion => {
            if(promotion._id === updatedPromotion._id) return updatedPromotion;
            return promotion;
        }));

        setIsActive(false);

        alertsController.createAlert("success", "The promotion has been edited successfully");
    }

    const image = promotion ? promotion.image : "";

    return (
        <PromotionForm
            title={title}
            setTitle={setTitle}
            link={link}
            setLink={setLink}
            image={image}
            setNewImage={setImageFile}
            isActive={isActive}
            setIsActive={setIsActive}
            onSubmit={editPromotion}
            prefix="edit-promotion"
            loading={loading}
        />
    );
}

export default EditPromotion;
