import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Layout from "@/components/Dashboard/Layout";
import Pagination, { PaginationProps } from "@/components/Pagination";

import ApiController from "@/services/ApiController";

import EditUser, { User } from "./EditUser";

import styles from "./Users.module.scss";

interface APIResponse {
    data: PaginationProps & {
        users: User[]
    }
}

const Users = () => {
    const [isEditing, setIsEditing] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [userToEdit, setUserToEdit] = useState<User>(null);
    const [pagination, setPagination] = useState<PaginationProps>(null);

    const router = useRouter();

    useEffect(() => {
        const getUsers = async () => {
            const res = await ApiController.get<APIResponse>(`users${window.location.search}`);

            if(res.data) {
                setPagination(res.data);
                setUsers(res.data.users);
            }
        }

        getUsers();
    }, [router.query]);

    const handleEditUser = (user: User) => {
        setUserToEdit(user);
        setIsEditing(true);
    }

    return (
        <Layout>
            <div className={styles.users}>
                <EditUser
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    user={userToEdit}
                    setUsers={setUsers}
                />

		<div className={`${styles.searchUser} search-input`}>
                    <form>
                        <input
                            type="search"
                            name="search"
                            placeholder="Enter a name or username to search a user"
                            defaultValue={router.query.search}
                        />

                        <button type="submit">
                            <i className="fas fa-search" aria-hidden="true"></i>
                        </button>
                    </form>
		</div>

                { users.length === 0 &&
                    <div className={styles.notFound}>
                        Results not found
                    </div>
                }

                { users.length > 0 &&
                    <div className={styles.userCardList}>
                        {users.map((user, index) => {
                            let permitsClass = "";

                            switch(user.permits) {
                                case "ADMIN":
                                    permitsClass = styles.admin;
                                    break;
                                case "SUPERADMIN":
                                    permitsClass = styles.superadmin;
                                    break;
                            }

                            return (
                                <div className={styles.userCard} key={index}>
                                    <span className={styles.name}>{ user.name }</span>
                                    <span className={styles.username}>{ user.username }</span>
                                    <span className={`${styles.permits} ${permitsClass}`}>
                                        { user.permits }
                                    </span>

                                    <button
                                        className={styles.editButton}
                                        onClick={() => handleEditUser(user)}
                                    >
                                        <i className="fas fa-pencil-alt"></i>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                }

                { users.length && 
                    <Pagination pagination={pagination}/>
                }
            </div>
        </Layout>
    );
}

export default Users;
