import { useContext } from "react";
import { UserContext } from "../contexts/user";

const useUser = () => useContext(UserContext);

export default useUser;
