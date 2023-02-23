import axios from 'axios';
import React, {  useContext,useEffect,useState,useReducer } from 'react';
import { getError } from './utils';
import { Store } from './Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, followers: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function Dashboard(){
  const { state } = useContext(Store);
  const { token } = state;
  const  [, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  
  const [newf, setNewf] = useState('');
  const [lost, setLost] = useState('');
  const [nfb, setNfb] = useState('');
  const [infb, setInfb] = useState('');
  
  useEffect(() => {
  
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const  lost  = await axios.get(
          'https://instagram-apis-quantum-it.herokuapp.com/api/followers/lost'

          , {
            headers: { Authorization: token }
          });
          setLost(lost.data.followers.length)
      
        
        const newF  = await axios.get(
          'https://instagram-apis-quantum-it.herokuapp.com/api/followers/new'

          , {
            headers: { Authorization: token }
          });
          setNewf(newF.data.followers.length)
       
        const  nfb  = await axios.get(
          'https://instagram-apis-quantum-it.herokuapp.com/api/followers/nfb'

          , {
            headers: { Authorization: token }
          });
          setNfb(nfb.data.followers.length)
        
        const  infb  = await axios.get(
          'https://instagram-apis-quantum-it.herokuapp.com/api/followers/infb'

          , {
            headers: { Authorization: token }
          });
          setInfb(infb.data.followers.length)
        dispatch({ type: 'FETCH_SUCCESS', payload: infb.data });
      
 
      

      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  },[token]);
        return (
        <>
        
            <div className="wrapper">
    {/* Content Header (Page header) */}
    <div className="content-header">
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1 className="m-0 text-dark">Dashboard</h1>
          </div>{/* /.col */}
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item"><a href="www.google.com">Home</a></li>
              <li className="breadcrumb-item active">Dashboard v1</li>
            </ol>
          </div>{/* /.col */}
        </div>{/* /.row */}
      </div>{/* /.container-fluid */}
    </div>
    {/* /.content-header */}
    {/* Main content */}
    <section className="content">
      <div className="container-fluid">
        {/* Small boxes (Stat box) */}
        <div className="row">
          <div className="col-lg-3 col-6">
            {/* small box */}
            <div className="small-box bg-info">
              <div className="inner">
                <h3>{newf}</h3>
                <p>New Followers</p>
              </div>
              <div className="icon">
              <i className="ion ion-person-add" />
              </div>
              <a href="www.google.com" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
            </div>
          </div>
          {/* ./col */}
          <div className="col-lg-3 col-6">
            {/* small box */}
            <div className="small-box bg-success">
              <div className="inner">
                <h3>{lost}<sup style={{fontSize: 20}}></sup></h3>
                <p>Lost Followers</p>
              </div>
              <div className="icon">
              <i className="ion ion-person" />
              </div>
              <a href="www.google.com" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
            </div>
          </div>
          {/* ./col */}
          <div className="col-lg-3 col-6">
            {/* small box */}
            <div className="small-box bg-warning">
              <div className="inner">
                <h3>{nfb}</h3>
                <p>Followers Who dont follow Me</p>
              </div>
              <div className="icon">
              <i className="ion ion-stats-bars" />
              </div>
              <a href="www.google.com" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
            </div>
          </div>
          {/* ./col */}
          <div className="col-lg-3 col-6">
            {/* small box */}
            <div className="small-box bg-danger">
              <div className="inner">
                <h3>{infb}</h3>
                <p>Followers Who I dont follow Me</p>
              </div>
              <div className="icon">
                <i className="ion ion-pie-graph" />
              </div>
              <a href="www.google.com" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
            </div>
          </div>
          {/* ./col */}
        </div>
        {/* /.row */}
        {/* Main row */}
       

     
        {/* /.row (main row) */}
      </div>{/* /.container-fluid */}
    </section>
    {/* /.content */}
  </div>

           </>







        )
    
}