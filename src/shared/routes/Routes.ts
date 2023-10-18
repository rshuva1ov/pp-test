import { Auth } from "../Components/Auth";
import { Main } from "../Components/Main";


export const privateRoutes = [
    { path: "/main", element: Main },
];

export const publicRoutes = [
    { path: "/auth", element: Auth },
];