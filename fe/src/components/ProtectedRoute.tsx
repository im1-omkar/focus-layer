import { Navigate } from "react-router-dom";


interface Props {
    children : React.ReactNode;
}

const ProtectedRoute = ({children} : Props) =>{
    const token = localStorage.getItem("token");

    if(!token){
        return <Navigate to='/auth' replace/>;
    }

    //verify the route once again :"")

    return children;
}

export default ProtectedRoute;
