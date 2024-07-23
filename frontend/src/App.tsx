import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import ChatRoom from './pages/ChatRoom';
import ChatClient from './pages/ChatClient';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="eCommerce Dashboard | SupperSuport" />
              <ECommerce />
            </>
          }
        />
        <Route
          path="/chat"
          element={
            <>
              <PageTitle title="Chat | SupperSuport" />
              <ChatRoom />
            </>
          }
        />
        <Route
          path="/chat-client"
          element={
            <>
              <PageTitle title="Chat client | SupperSuport" />
              <ChatClient />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar | SupperSuport" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | SupperSuport" />
              <Profile />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables | SupperSuport" />
              <Tables />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | SupperSuport" />
              <Settings />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | SupperSuport" />
              <Chart />
            </>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | SupperSuport" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | SupperSuport" />
              <SignUp />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
