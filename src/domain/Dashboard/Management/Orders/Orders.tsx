import React, {useEffect, useState} from "react";
import { useRouter } from "next/router";

import Layout from "@/components/Dashboard/Layout";
import OrderCard, { OrderCardProps } from "@/components/Dashboard/OrderCard";

import ApiController from "@/services/ApiController";

import Pagination, { PaginationProps } from "@/components/Pagination";

import SortBy from "./SortBy";

import styles from "./Orders.module.scss";

type Orders = Array<OrderCardProps["order"]>;

interface ApiResponse {
    data: { orders: Orders } & PaginationProps
}

const Orders = () => {
    const [orders, setOrders] = useState<Orders>([]);
    const [pagination, setPagination] = useState<PaginationProps>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
    	const getOrders = async () => {
	    setLoading(true);

	    const res = await ApiController.get<ApiResponse>(`orders${window.location.search}`);

	    setLoading(false);

	    if(!res.data) {
		setPagination(null);
		setOrders([]);
		return;
	    }

	    setOrders(res.data.orders);
	    setPagination(res.data);
    	}

	getOrders();
    }, [router.query]);

    return (
	<Layout>
	    <div className={styles.orders}>
		<div className={styles.header}>
		    <h3 className={styles.title}>Orders</h3>

		    <SortBy/>
		</div>

		{ loading && 
		    <div className={styles.loaderContainer}>
			<span className="loader"></span>
		    </div>
		}

		{ orders.length > 0 && !loading &&
		    <div className={styles.ordersContainer}>
			{orders.map((order, index) => {
			    return <OrderCard order={order} isManageCard={true} key={index}/>;
			})}

			<div className={styles.pagination}>
			    { pagination &&
				<Pagination pagination={pagination}/>
			    }
			</div>
		    </div>
		}

		{ orders.length === 0 && !loading &&
		    <div className={styles.noOrders}>
		    	There are no orders to show
		    </div>
		}
	    </div>
	</Layout>
    );
}

export default Orders;
