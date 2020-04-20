import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { withRedux } from '../../lib/redux'

const ChartPage = () => {

  const chartProducts = useSelector(state => {
    console.log(state.chartProducts[0]);
    return state.chartProducts;
  });

  return <div>tesssss</div>
}

export default withRedux(ChartPage);