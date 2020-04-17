import { Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from 'graphql-tag';
import { withApollo } from '../lib/apollo';
import { withRedux } from '../lib/redux';
import { compose } from 'redux';



const ProductListQuery = () => {
	const PRODUCT_LIST_QUERY = gql`
		query ProductList($search: String!, $sortName: SortEnum!, $pageSize: Int!, $currentPage: Int!) {
			productList(search: $search, sort: {name: $sortName}, pageSize: $pageSize, currentPage: $currentPage) {
				total_count
				items {
					id
					name
					url_key
				}
			}
		}
	`

	return useQuery(
		PRODUCT_LIST_QUERY,
		{
			variables: { search: '', sortName: 'ASC', pageSize: 5, currentPage: 1 },
			notifyOnNetworkStatusChange: true
		}
	);
}



const IndexPage = (props) => {
	const CATEGORY_LIST_QUERY = gql`{
		categoryList {
			name
			url_key
			children_count
			children {
				id
				level
				name
				path
				url_path
				url_key
				children {
					id
					level
					name
					path
					url_path
					url_key
				}
			}
		}
	}`

	const { loading, error, data } = useQuery(
		CATEGORY_LIST_QUERY,
		{
			variables: { min: 11, max: 20 },
			notifyOnNetworkStatusChange: true
		}
	);

	if (loading) return <p>Loading . . .</p>;
	if (error) return <p>ERROR: {error.message}</p>;
	if (!data) return <p>Not found</p>;


	return (
		<Fragment>
			<ul>
				{data.categoryList.map(category => (
					<li>
						{category.name}
						<ul>
							{category.children.map(child => (
								<li>
									{child.name}
									<ul>
										{child.children.map(grandChild => (
											<li>
												{grandChild.name}
											</li>
										))}
									</ul>
								</li>
							))}
						</ul>
					</li>
				))}
			</ul>
		</Fragment>
	)
}


IndexPage.getInitialProps = ({ reduxStore }) => {
	// Tick the time once, so we'll have a
	// valid time before first render
	const { dispatch } = reduxStore
	// dispatch({
	// 	type: 'TICK',
	// 	light: typeof window === 'object',
	// 	lastUpdate: Date.now(),
	// })

	return {}
}

export default compose(withApollo, withRedux)(IndexPage)