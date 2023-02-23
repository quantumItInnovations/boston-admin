import React, { Component, useContext } from 'react'
import { Store } from '../../Store';

export default function Footer (){
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {  userInfo } = state;
        return (<>{userInfo?( <div id='Footer'>
        <footer className="main-footer">
          <strong>Copyright © 2014-2023 <a href="https://quantumitinnovation.com">Quantum It</a>. </strong>
          All rights reserved.
        </footer>
      </div>):(<></>)}
          </>

        )
    
}