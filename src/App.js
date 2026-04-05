import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from './pages/rootLayout';
import HomeAllPage from './pages/Home/home';
import MessagesPage from './pages/Messages/messages';
import PersonalPage from './pages/Personal-Page/page';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      // errorElement: <ErrorPage />,
      // loader: RootLoader,
      id: "root",
      children: [
        {
          index: true,
          element: <HomeAllPage />,
          id: "home",
        },
        {
          path: "messages",
          element: <MessagesPage />,
          id: "messages",
        },
        {
          path: "personal",
          element: <PersonalPage />,
          id: "personal",
        },
      ]
    }
  ])
  return (
    <RouterProvider router={router} />
  );
}

export default App;
