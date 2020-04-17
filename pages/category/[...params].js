import React, { useState, useEffect } from 'react';
import { withApollo } from '../../lib/apollo'
import { useQuery } from '@apollo/react-hooks'
import qgl from 'graphql-tag'
import { useRouter } from 'next/router'
import Link from 'next/link'

const ProductList = ({categoryId}) => {
	const PRODUCT_LIST_QUERY = qgl`
		query($categoryId: String!){
			products(search: "", filter: { category_id: { eq: $categoryId } }) {
				items {
					id
					name
					special_price
					url_key
					sku
					price_range{
						minimum_price{
							final_price{
								value
							}
						}
					}
				}
			}
		}
	`
	const {loading, data, error} = useQuery(
		PRODUCT_LIST_QUERY,
		{ variables: {categoryId: categoryId} }
	)

	if (loading) return <p>Loading . . .</p>;
	if (error) return <p>ERROR: {error.message}</p>;
	if (!data) return <p>Not found</p>;

	console.log(data)

	return (
		<div>Products:
			<div>
				{data.products.items.map(product => (
					<div>{product.name}</div>
				))}
			</div>
		</div>
	)
}

const CategoryDetail = ({url_key}) => {
	const CATEGORY_DETAIL_QUERY = qgl`
		query($url_key: String!) {
			categoryList(filters: { url_key: { eq: $url_key } }) {
				id
				name
				url_key
			}
		}
	`

	const {loading, data, error} = useQuery(
		CATEGORY_DETAIL_QUERY,
		{ variables: {url_key: url_key[url_key.length-1]} }
	)

	if (loading) return <p>Loading . . .</p>;
	if (error) return <p>ERROR: {error.message}</p>;
	if (!data) return <p>Not found</p>;

	console.log(data)

	return (
		<div>
			<h2>Category : {data.categoryList[0].name}</h2> 
			{data.description && (
				<div> {data.description} </div>
			)}
			<ProductList categoryId={data.categoryList[0].id} />
		</div>
	)
}

const CategoryPage = () => {
	const router = useRouter();
	const { params } = router.query;

	console.log(router)
	return (
		<div>
			<CategoryDetail url_key={params}></CategoryDetail>
		</div>
	)
}

export default withApollo(CategoryPage)
