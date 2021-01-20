import React, { useEffect, useState } from "react";

import ApiController from "@/services/ApiController";

import styles from "./Categories.module.scss";

interface Category {
    _id: string,
    name: string
}

interface CategoriesProps {
    selectedCategories: string[],
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>
}

interface ApiResponses {
    getCategories: {
	data: {
	    categories: Category[]
	}
    },
    createCategory: {
	data: {
	    createdCategory: Category
	}
    },
    deleteCategory: {
	data: {
	    deletedCategory: Category
	}
    }
}

const Categories = ({ selectedCategories, setSelectedCategories }: CategoriesProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [search, setSearch] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [addCategoryIsActive, setAddCategoryFormIsActive] = useState(false);

    useEffect(() => {
	const getCategories = async () => {
	    const res = await ApiController.get<ApiResponses["getCategories"]>("categories");

	    if(res.data) {
		setCategories(res.data.categories);
	    }
	}

	getCategories();
    }, []);

    const handleOnClick = (categoryName: string) => {
	if(selectedCategories.includes(categoryName)) {
	    return setSelectedCategories(
		selectedCategories.filter(selectedCategory => selectedCategory !== categoryName)
	    );
	}

	setSelectedCategories(prevCategories => [...prevCategories, categoryName]);
    }

    const handleAddCategory = async (e: React.FormEvent) => {
	e.preventDefault();

	if(!categoryName) return setAddCategoryFormIsActive(false);

	const res = await ApiController.post<ApiResponses["createCategory"]>("categories", {
	    body: { name: categoryName }
	});

	if(res.data) {
	    setCategories([...categories, res.data.createdCategory]);
	    setCategoryName("");
	    setAddCategoryFormIsActive(false);
	}
    }

    const deleteCategory = async (categoryId: string) => {
	const res = await ApiController.delete<ApiResponses["deleteCategory"]>(`categories/${categoryId}`);

	if(res.data) {
	    const { deletedCategory } = res.data;

	    setCategories(categories.filter(category => category.name != deletedCategory.name));
	}
    }

    const getCategories = () => {
	if(search) {
	    return categories.filter(category => category.name.includes(search));
	}

	return categories;
    }

    return (
	<div className={styles.categoriesContainer}>
	    <input
		type="search"
		className={styles.searchCategory}
		placeholder="Search a category"
		value={search}
		onChange={({ target: { value } }) => setSearch(value)}
	    />

	    <div className={styles.categories}>
		{getCategories().map((category, index) => {
		    const categoryCardClass = selectedCategories.includes(category.name) ? styles.active : "";

		    return (
			<div
			    className={`${styles.categoryCard} ${categoryCardClass}`}
			    onClick={() => handleOnClick(category.name)}
			    key={index}
			>
			    <span className={styles.categoryName}>
				{ category.name }
			    </span>

			    <button
				className={styles.deleteButton}
				onClick={() => deleteCategory(category._id)}
			    >
				<i className="fas fa-times"></i>
			    </button>
			</div>
		    );
		})}
	    </div>

	    { addCategoryIsActive ?
		<div className={styles.addCategoryForm}>
		    <form onSubmit={handleAddCategory}>
			<input
			    type="text"
			    className={styles.categoryNameInput}
			    value={categoryName}
                            data-testid="add-category-input"
			    onChange={({ target: { value } }) => setCategoryName(value)}
			    autoFocus
			/>

			<div
			    className={styles.background}
			    onClick={() => setAddCategoryFormIsActive(false)}
			></div>
		    </form>
		</div>
		:
		<button
		    className={styles.addCategory}
		    onClick={() => setAddCategoryFormIsActive(true)}
		>
		    <i className="fas fa-plus"></i>
		    Add new category
		</button>
	    }
	</div>
    );
}

export default Categories;	
