import React, {useContext, useRef, useState} from "react";

import AlertsContext from "@/contexts/AlertsContext";

import Layout from "@/components/Dashboard/Layout";
import ConfimationModal from "@/components/ConfirmationModal";

import ApiController from "@/services/ApiController";

import AddPromotion from "./AddPromotion";
import EditPromotion from "./EditPromotion";

import styles from "./Promotions.module.scss";

export interface Promotion {
    _id: string,
    title: string,
    image: string,
    link: string
}

export interface PromotionsProps {
    promotions: Promotion[]
}

interface APIResponse {
    error: string,
    message: string,
    data: {
        deletedPromotion: Promotion
    }
}

const Promotions = (props: PromotionsProps) => {
    const [promotions, setPromotions] = useState(props.promotions);

    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isActiveConfirmationModal, setIsActiveConfirmationModal] = useState(false);

    const [promotionToEdit, setPromotionToEdit] = useState<Promotion>(null);

    const promotionIdToDelete = useRef("");

    const alertsController = useContext(AlertsContext);

    const deletePromotion = async () => {
        const res = await ApiController.delete<APIResponse>(`promotions/${promotionIdToDelete.current}`);

        if(res.error) return alertsController.createAlert("danger", res.message);

        const { deletedPromotion } = res.data;

        setPromotions(
            promotions.filter(promotion => promotion._id !== deletedPromotion._id)
        );
    }

    const handleEditButton = (promotion: Promotion) => {
        setPromotionToEdit(promotion);
        setIsEditing(true);
    }

    const handleDeleteButton = (promotionId: string) => {
        promotionIdToDelete.current = promotionId;
        setIsActiveConfirmationModal(true);
    }

    return (
        <Layout>
            <div className={styles.promotionsManagement}>
                <ConfimationModal
                    message="Are you sure to delete this promotion?"
                    isActive={isActiveConfirmationModal}
                    setIsActive={setIsActiveConfirmationModal}
                    onConfirm={deletePromotion}
                />

                <AddPromotion
                    setPromotions={setPromotions}
                    isActive={isCreating}
                    setIsActive={setIsCreating}
                />

                <EditPromotion
                    promotion={promotionToEdit}
                    setPromotions={setPromotions}
                    isActive={isEditing}
                    setIsActive={setIsEditing}
                />

                <div className={styles.titleContainer}>
                    <h2 className={styles.title}>Promotions</h2>

                    <button
                        className={styles.addButton}
                        onClick={() => setIsCreating(true)}
                    >
                        <i className="fas fa-plus"></i>
                    </button>
                </div>

                <div className={styles.promotions}>
                    {promotions.map((promotion, index) => {
                        return (
                            <div className={styles.promotionCard} key={index}>
                                <img
                                    src={`/img/promotions/medium-${promotion.image}`}
                                    className={styles.image}
                                    alt="Promotion Image" 
                                />

                                <div className={styles.footer}>
                                    <p className={styles.title}>
                                        { promotion.title }
                                    </p>

                                    <div className={styles.buttons}>
                                        <button
                                            className={styles.button}
                                            onClick={() => handleEditButton(promotion)}
                                        >
                                            <i className="fas fa-pencil-alt"></i>
                                        </button>

                                        <button
                                            className={styles.button}
                                            onClick={() => handleDeleteButton(promotion._id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                { promotions.length === 0 &&
                    <div className={styles.withoutItems}>
                        There are no prommotions to display.
                    </div>
                }
            </div>
        </Layout>
    );
}

export default Promotions;
