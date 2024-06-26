const commHeaders = {
    "Content-Type": "application/json"
}

// redirect frontend to backend API 
export async function signup(username, password) {
    const req = {
        username: username,
        password: password,
    }

    const rsp = await fetch("/api/v1/signup", { 
        method: "POST", 
        headers: commHeaders,
        body: JSON.stringify(req) 
    })

    console.log(rsp)

    const rspObj = await rsp.json() 
    console.log(rspObj)
    return rspObj
    
} 

export default signup;