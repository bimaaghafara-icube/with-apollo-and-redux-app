import { Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from 'graphql-tag';
import { withApollo } from '../lib/apollo';
import { withRedux } from '../lib/redux';
import { compose } from 'redux';
import Link from 'next/link';

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
			variables: {},
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
							{category.children.map(childCategory => (
								<li>
									<Link href={`/category/${childCategory.url_key}`}>
										<a>{childCategory.name}</a>
									</Link>
									<ul>
										{childCategory.children.map(grandChildCategory => (
											<li>
												<Link 
													href={`/category/${childCategory.url_key}/${grandChildCategory.url_key}`}
													as={`/category/${childCategory.url_key}/${grandChildCategory.url_key}`}>
													<a>{grandChildCategory.name}</a>
												</Link>
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