import React, {useState, useEffect} from "react";
import { Route, Redirect} from "react-router-dom";
import { getuser } from '../libs/User';
import Loading from './Loading'


const PrivateRoute = ({ component: Component, ...rest }) =>  {
  
  const [hasUser, setHasUser] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const auth = async () => {
    const user = await (await getuser(localStorage.getItem('auth') || '')).data
    if(user) {
      return true
    }
    return false
  }
  useEffect(()=>{
    const timer = setTimeout(() => {
      console.log('Just timing out because local read is so short:)')
      auth().then((authed) => {
        setHasUser(authed)
        setLoaded(true)
      })
    }, 1000);
    return () => clearTimeout(timer);
  }, [loaded])

  return <Route {...rest} 
            render={(props) => {
              if(!loaded) {
                return <Loading/>
              } else if(hasUser !== true) {
                return <Redirect to="/login" />
              }
              return <Component {...props}/>
              
            }} 
           />
}
export default PrivateRoute;
