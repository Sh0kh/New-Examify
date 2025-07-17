import React, { useEffect, useState } from 'react'
import Top3 from './components/Top3'
import Table from './components/Table'
// import axios from '../Service/axios'
import ReactLoading from 'react-loading';
import { $api } from '../../../utils';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

function Rating() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const getResult = async () => {
    try {
      const response = await $api.get('/user/rating')
      setData(response.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getResult()
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <ReactLoading type="spinningBubbles" color="#000" height={100} width={100} />
      </div>
    );
  }
  return (
    <>
      <Header />
      <div className='Rating mt-[100px]'>
        <Top3 data={data} />
        <Table data={data} />
      </div>
      <Footer />
    </>
  )
}

export default Rating