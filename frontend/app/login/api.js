const commHeaders = {
    "Content-Type": "application/json"
}

export async function LoginAPI(username, hashedPassword) {
    const req = {
        username: username,
        password: hashedPassword,
    }

    const rsp = await fetch("/api/v1/login", { 
        method: "POST", 
        headers: commHeaders,
        body: JSON.stringify(req)
    })

    console.log(rsp)

    const rspObj = await rsp.json() 
    console.log(rspObj)
    return rspObj
    
} 

export default LoginAPI;