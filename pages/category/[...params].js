import React, { useState, useEffect, Fragment } from 'react';
import { withApollo } from '../../lib/apollo'
import { useQuery } from '@apollo/react-hooks'
import qgl from 'graphql-tag'
import { useRouter } from 'next/router'
import Router from 'next/router'
import Link from 'next/link'


const ProductCard = (props) => {
	return (
		<Fragment>
			<div className="product-card">
				<div className="product-card-wrapper" onClick={props.onClick}>
					<div
							className="img-wrapper"
							style={{ backgroundImage: `url('${props.imageUrl}')` }}
						/>
						<div className="description">
							<div className="name text-right">
								{props.productName}
							</div>
							<div className="types text-right">
								{props.currency} {props.price}
							</div>
						</div>
				</div>
			</div>
			<style jsx>{`
				.product-card {
					width: 50%;
					display: inline-block;
				}
				.product-card-wrapper {
					cursor: pointer;
					height: 300px;
					border-radius: 8px;
					border: 2px solid rgba(30, 30, 30, 0.2);
					margin: 12px;
				}
				.product-card-wrapper:hover {
					opacity: 0.9;
					border: 2px solid grey;
					border-radius: 10px;
				}
				.product-card-wrapper .img-wrapper {
					border: 10px solid transparent;
					background-color: #fff;
					border-radius: 6px 6px 0 0;
					background-position: center;
					background-size: contain;
					background-repeat: no-repeat;
					width: 100%;
					max-width: calc(100% - 20px);
					height: 65%;
				}
				.product-card-wrapper .description {
					padding: 16px;
					height: 18%;
					border-radius: 0 0 6px 6px;
					background-color: grey;
					color: #fff;
				}
				.product-card-wrapper .description .name {
					font-size: 22px;
				}
				.product-card-wrapper .description .name, .product-card-wrapper .description .types {
					padding: 2px;
				}
			`}</style>
		</Fragment>
	)
}

const ProductList = ({ categoryId }) => {
	const PRODUCT_LIST_QUERY = qgl`
		query($categoryId: String!){
			products(search: "", filter: { category_id: { eq: $categoryId } }) {
				items {
					id
					name
					special_price
					url_key
					sku
					image {
						url
					}
					price_range{
						minimum_price{
							final_price{
								currency
								value
							}
						}
					}
				}
			}
		}
	`
	const { loading, data, error } = useQuery(
		PRODUCT_LIST_QUERY,
		{ variables: { categoryId: categoryId } }
	)

	if (loading) return <p>Loading . . .</p>;
	if (error) return <p>ERROR: {error.message}</p>;
	if (!data) return <p>Not found</p>;

	console.log('products: ', data)

	return (
		<div>Products:
			<div>
				{data.products.items.map(product =>
					<ProductCard 
						productName={product.name}
						imageUrl={product.image.url}
						currency={product.price_range.minimum_price.final_price.currency}
						price={product.price_range.minimum_price.final_price.value}
						onClick={() => {Router.push('/product/[url_key]', `/product/${product.url_key}`)}}
					/>
				)}
			</div>
		</div>
	)
}

const CategoryDetail = ({ url_key }) => {
	const CATEGORY_DETAIL_QUERY = qgl`
		query($url_key: String!) {
			categoryList(filters: { url_key: { eq: $url_key } }) {
				id
				name
				url_key
			}
		}
	`

	const { loading, data, error } = useQuery(
		CATEGORY_DETAIL_QUERY,
		{ variables: { url_key: url_key[url_key.length - 1] } }
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
