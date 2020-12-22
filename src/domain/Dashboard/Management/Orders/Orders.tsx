import React, {useEffect, useState} from "react";
import { useRouter } from "next/router";

import Layout from "@/components/Dashboard/Layout";
import OrderCard, { OrderCardProps } from "@/components/Dashboard/OrderCard";

import ApiController from "@/services/ApiController";

import Pagination, { PaginationProps } from "@/components/Pagination";

import styles from "./Orders.module.scss";

interface OrdersResponse extends PaginationProps {
    orders: Array<OrderCardProps["order"]>
}

interface ApiResponse {
    data: OrdersResponse
}

const Orders = () => {
    const [ordersResponse, setOrdersResponse] = useState<OrdersResponse>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
    	const getOrders = async () => {
	    setLoading(true);

	    const res = await ApiController.get<ApiResponse>(`orders${window.location.search}`);

	    setLoading(false);

	    if(!res.data) return setOrdersResponse(null);

	    setOrdersResponse(res.data);
    	}

	getOrders();
    }, [router.query]);

    return (
	<Layout>
	    <div className={styles.orders}>
		<h3 className={styles.title}>Orders</h3>

		{ loading && 
		    <div className={styles.loaderContainer}>
			<span className="loader"></span>
		    </div>
		}

		{ ordersResponse && !loading &&
		    <div className={styles.ordersContainer}>
			{ordersResponse.orders.map((order, index) => {
			    return <OrderCard order={order} isManageCard={true} key={index}/>;
			})}

			<div className={styles.pagination}>
			    <Pagination pagination={ordersResponse}/>
			</div>
		    </div>
		}

		{ !ordersResponse && !loading &&
		    <div className={styles.noOrders}>
		    	There are no orders to show
		    </div>
		}
	    </div>
	</Layout>
    );
}

export default Orders;
