import { useQuery } from "@apollo/react-hooks";
import gql from 'graphql-tag';
import { withApollo } from '../../lib/apollo';
import { withRedux } from '../../lib/redux';
import { compose } from 'redux';
import { useRouter, Router } from 'next/router'

const ProductPage = () => {
    const PRODUCT_DETAIL_QUERY = gql`
      query getProduct($url_key: String!) {
        products(search: "", filter: { url_key: { eq: $url_key } }) {
          total_count
          items {
            id
            name
            description {
              html
            }
            categories {
              name
            }
            price_range {
              maximum_price {
                discount {
                  amount_off
                  percent_off
                }
                final_price {
                  currency
                  value
                }
              }
              minimum_price {
                discount {
                  amount_off
                  percent_off
                }
                final_price {
                  currency
                  value
                }
              }
            }
            url_key
            image {
              url
              label
            }
          }
        }
      }
    `;

    const router = useRouter();
    const { loading, data, error } = useQuery(
      PRODUCT_DETAIL_QUERY,
      { variables: { url_key: router.query.url_key } }
    )
  
    if (loading) return <p>Loading . . .</p>;
    if (error) return <p>ERROR: {error.message}</p>;
    if (!data) return <p>Not found</p>;
  
    console.log(router)
    console.log('PRODUCT_DETAIL_QUERY: ', data)

    const product = data.products.items[0],
      productName = product.name,
      productDescription = product.description.html,
      productImageUrl = product.image.url,
      productCurrency = product.price_range.minimum_price.final_price.currency,
      productPrice = product.price_range.minimum_price.final_price.value;      
  
    return (
      <div>
        <h2>{productName}</h2>
        <h3>{productCurrency} {productPrice}</h3>
        <div dangerouslySetInnerHTML={{__html: productDescription}} />
        <img src={productImageUrl} width='200'/>
      </div>
    )
}

ProductPage.getInitialProps = ({ reduxStore }) => {
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

export default compose(withApollo, withRedux)(ProductPage)