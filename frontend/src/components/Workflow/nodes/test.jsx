import React, { useState, useEffect, createContext, useContext } from 'react';


const userContext = createContext();

function Component1() {
    const username = "marco";
    const numbers = [1, 2, 3, 4, 5];
    return(
        <>
        <userContext.Provider value={numbers}>
        hello
        <Component2/>
        </userContext.Provider>
        </>
    )
}
function Component2() {
    return(
        <>
        <br/>
        hello
        <Component3/>
        </>
    )
}
function Component3() {
    const user = useContext(userContext);
    return(
        <>
        <br/>
        hello {user[0]} {user[1]} {user[2]} {user[3]} {user[4]}
        </>
    )
}

export default function TestPage() {
    const [name, setName] = useState("marco")
    const [group, setGroup] = useState([]);
    setGroup([1,5,6,7]);

    useEffect(() => {
        setName("marco is amazing");
      }, [name]); // empty array = run once (on mount)
      
  return (
    <>
        <h1>Test Page</h1>
        <p>This is a test page.</p>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <p>Current Name: {name}</p>

        <h2>Prop Drilling</h2>
        <Component1/>
    </>
  )
}
