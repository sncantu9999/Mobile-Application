import React, { useState, useEffect, useRef, createContext} from "react";

const Context = createContext()

const Provider = ( { children } ) => {


  const [ domain, setDomain ] = useState("http://10.21.183.52:80")
  const [ isLoggedIn, setIsLoggedIn ] = useState(false)
  const [ userObj, setUserObj ] = useState()
  
  const globalContext = {
    domain,
    isLoggedIn,
    setIsLoggedIn,
    userObj,
    setUserObj,
  }

  return <Context.Provider value={globalContext}>{children}</Context.Provider>

};

export { Context, Provider };