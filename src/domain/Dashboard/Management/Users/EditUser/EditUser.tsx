import React, { useState, useEffect, useContext } from "react";

import AlertsContext from "@/contexts/AlertsContext";

import Modal from "@/components/Modal";

import ApiController from "@/services/ApiController";

import styles from "./EditUser.module.scss";

type Permits = "USER" | "ADMIN" | "SUPERADMIN";

export interface User {
    _id: string,
    name: string,
    username: string,
    email: string,
    permits: Permits
}

interface EditUserProps {
    isEditing: boolean,
    setIsEditing: React.Dispatch<boolean>,
    user: User,
    setUsers: React.Dispatch<React.SetStateAction<User[]>>
}

interface APIResponse {
    error: string,
    message: string,
    data: {
        updatedUser: User
    }
}

const EditUser = ({ isEditing, setIsEditing, user, setUsers }: EditUserProps) => {
    const [privileges, setPrivileges] = useState("");

    const [loading, setLoading] = useState(false);

    const alertsController = useContext(AlertsContext);

    useEffect(() => {
        if(!user) return;

        setPrivileges(user.permits);
    }, [user]);

    const handleForm = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        const res = await ApiController.put<APIResponse>(`users/${user._id}`, {
            body: { permits: privileges }
        });

        setLoading(false);

        if(res.error) {
            return alertsController.createAlert("danger", res.message);
        }

        const { updatedUser } = res.data;

        setUsers(users => users.map(user => {
            if(user._id === updatedUser._id) return updatedUser;

            return user;
        }));

        alertsController.createAlert("success", "The user has been updated successfully");
        setIsEditing(false);
    }

    if(!user) return null;

    return (
        <Modal isActive={isEditing} setIsActive={setIsEditing}>
            <div className={styles.editUser}>
                { loading &&
                    <div className={styles.loaderContainer}>
                        <span className="loader"></span>
                    </div>
                }

                <form onSubmit={handleForm}>
                    <p className={styles.label}>
                        <span className={styles.labelName}>Name: </span>
                        { user.name }
                    </p>

                    <p className={styles.label}>
                        <span className={styles.labelName}>Username: </span>
                        { user.username }
                    </p>

                    <p className={styles.label}>
                        <span className={styles.labelName}>Email: </span>
                        { user.email }
                    </p>

                    <div className={styles.label}>
                        <span className={styles.labelName}>Privileges: </span>

                        <div className={styles.selectContainer}>
                            <select
                                className={styles.select}
                                id="select-privilege"
                                value={privileges}
                                onChange={({ target: { value } }) => setPrivileges(value as Permits)}
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="SUPERADMIN">SUPERADMIN</option>
                            </select>

                            <label className={styles.arrow} htmlFor="select-privilege"></label>
                        </div>
                    </div>

                    <div className={styles.buttons}>
                        <button className={`${styles.button} submit-button`}>
                            Save Changes
                        </button>

                        <button
                            className={`${styles.button} submit-button secondary`}
                            onClick={() => setIsEditing(false)}
                            type="button"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default EditUser;
