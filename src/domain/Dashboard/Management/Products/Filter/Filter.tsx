import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import RangeInput from "@/components/Formulary/RangeInput";

import ApiController from "@/services/ApiController";

import styles from "./Filter.module.scss";

interface Category {
    name: string
}

interface ApiResponse {
    data: {
	categories: Array<Category>
    }
}

const SORT_BY_OPTIONS = {
    stock: "Stock",
    createdAt: "Creation Date",
    discount: "Discount",
    price: "Price",
    name: "Name"
}

const PRODUCTS_PER_PAGE = 6;

const Filter = () => {
    const [isActive, setIsActive] = useState(false);

    const [categories, setCategories] = useState<Array<Category>>([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [productsPerPage, setProductsPerPage] = useState(PRODUCTS_PER_PAGE);
    const [sortBy, setSortBy] = useState("");

    const router = useRouter();

    useEffect(() => {
    	const { search, limit, category } = router.query;

	if(search) {
	    setSearch(search.toString());
	}

	if(limit) {
	    setProductsPerPage(parseInt(limit.toString()) || PRODUCTS_PER_PAGE);
	}

	if(category) {
	    setSelectedCategory(category.toString());
	}
    }, [router.query]);

    useEffect(() => {
    	const getCategories = async () => {
	    const res = await ApiController.get<ApiResponse>("categories");

	    if(!res.data) return;
	    setCategories(res.data.categories);
    	}

	getCategories();
    }, []);

    const getSortButtons = () => {
	return Object.keys(SORT_BY_OPTIONS).map((key, index) => {
	    const sortButtonClass = sortBy === key ? styles.active : "";

	    return (
		<button
		type="button"
		className={`${styles.selectCard} ${sortButtonClass}`}
		onClick={() => setSortBy(key)}
		key={index}>
		    { SORT_BY_OPTIONS[key] }
		</button>
	    );
	});
    }

    const handleForm = (e: React.FormEvent) => {
	e.preventDefault();

	const query = {};

	if(search.length) {
	    Object.assign(query, { search });
	}

	if(selectedCategory.length) {
	    Object.assign(query, { category: selectedCategory });
	}

	if(productsPerPage) {
	    Object.assign(query, { limit: productsPerPage });
	}

	if(sortBy.length) {
	    Object.assign(query, { sortBy });
	}

	setIsActive(false);

	router.push({
	    pathname: router.pathname,
	    query
	});
    }

    return (
	<div className={styles.filterContainer}>
	    <form onSubmit={handleForm}>
		<div className={`${styles.searchProduct} search-input`}>
		    <input
			type="search"
			name="search"
			placeholder="Search a product"
			value={search}
			onChange={({ target: { value } }) => setSearch(value)}
			autoComplete="search"
		    />

		    <button type="submit">
			<i className="fas fa-search" aria-hidden="true"></i>
		    </button>
		</div>
		<span className={styles.totalProducts}>97 products</span>

		<button
		    type="button"
		    className={styles.filterButton}
		    onClick={() => setIsActive(!isActive)}
		>
		    Filter
		    <i className="fas fa-sort-amount-down-alt" aria-hidden="true"></i>
		</button>

		{ isActive && 
		    <div className={styles.filter}>
			<div className={styles.categoriesFilter}>
			    <p className={styles.subtitle}>Categories</p>

			    <div className={styles.categories}>
				{categories.map((category, index) => {
				    const categoryClass = selectedCategory === category.name ? styles.active : "";

				    return (
					<button
					    type="button"
					    className={`${styles.selectCard} ${categoryClass}`}
					    onClick={() => setSelectedCategory(category.name)}
					    key={index}
					>
					    { category.name }
					</button>
				    );
				})}
			    </div>
			</div>

			<div className={styles.pageFilter}>
			    <p className={styles.subtitle}>Products per page</p>

			    <RangeInput
				min={1}
				max={25}
				value={productsPerPage}
				setValue={setProductsPerPage}
			    />
			</div>

			<div className={styles.sortBy}>
			    <p className={styles.subtitle}>Sort By</p>

			    <div className={styles.sortButtons}>
				{ getSortButtons() }
			    </div>
			</div>

			<button type="submit" className={`${styles.applyFilters} submit-button secondary`}>
			    Apply Filters
			</button>
		    </div>
		}
	    </form>
	</div>
    );
}

export default Filter;
