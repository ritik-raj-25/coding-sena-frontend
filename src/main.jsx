import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter} from 'react-router-dom'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import store, { persistor } from './store/store.js'
import Home from './pages/Home.jsx'
import Protected from './components/Protected.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import EmailVerification from './pages/EmailVerification.jsx'
import DashboardLayout from './pages/DashboardLayout.jsx'
import ViewProfile from './pages/ViewProfile.jsx'
import DashboardDefault from './pages/DashboardDefault.jsx'
import UpdateProfile from './pages/UpdateProfile.jsx'
import DeactivateAccount from './pages/DeactivateAccount.jsx'
import Enrollment from './pages/Enrollment.jsx'
import PaymentSuccess from './pages/PaymentSuccess.jsx'
import PaymentCancel from './pages/PaymentCancel.jsx'
import RestoreAccount from './pages/RestoreAccount.jsx'
import Course from './pages/Course.jsx'
import { PersistGate } from "redux-persist/integration/react";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import EnrolledCourses from './pages/EnrolledCourses.jsx'
import Topic from './pages/Topic.jsx'
import Test from './pages/Test.jsx'
import TestDetail from './pages/TestDetail.jsx'
import TestAttemptDetail from './pages/TestAttemptDetail.jsx'
import RealTimeTest from './pages/RealTimeTest.jsx'
import ManageCourse from './pages/ManageCourse.jsx'
import Error from './pages/Error.jsx'
import CourseManagement from './pages/CourseManagement.jsx'
import AddCourse from './pages/AddCourse.jsx'
import MoreOption from './pages/MoreOption.jsx'
import AddSkill from './pages/AddSkill.jsx'
import UserManagementComponent from './components/UserManagement.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: '/courses',
        element: <Course/>
      },
      {
        path: '/courses/:courseId',
        element: <Enrollment/>
      },
      {
        path: '/payment-success/*',
        element: <Protected authentication={true}><PaymentSuccess/></Protected>
      },
      {
        path: '/payment-cancel',
        element: <Protected authentication={true}><PaymentCancel/></Protected>
      },
      {
        path: "/signup",
        element: <Protected authentication={false}><Signup/></Protected>
      },
      {
        path: "/login",
        element: <Protected authentication={false}><Login/></Protected>
      },
      {
        path: "/restore-account",
        element: <Protected authentication={false}><RestoreAccount/></Protected>
      },
      {
        path: "/email-verification",
        element: <Protected authentication={false}><EmailVerification/></Protected>
      },
      {
        path: "/dashboard",
        element: <Protected authentication={true}><DashboardLayout/></Protected>,
        children: [
          {
            index: true,
            element: <DashboardDefault />
          },
          {
            path: "view-profile",
            element: <ViewProfile />
          },
          {
            path: "update-profile",
            element: <UpdateProfile />
          },
          {
            path: "deactivate-account",
            element: <DeactivateAccount/>
          },
          {
            path: "my-courses",
            element: <EnrolledCourses/>
          }, 
          {
            path: "manage-courses",
            element: <Protected authentication={true}><ManageCourse /></Protected>
          },
          {
            path: "admin/course-management",
            element: <Protected authentication={true}><CourseManagement /></Protected>
          },
          {
            path: "admin/add-course",
            element: <Protected authentication={true}><AddCourse /></Protected>
          },
          {
            path: "admin/more-options",
            element: <Protected authentication={true}><MoreOption /></Protected>
          },
          {
            path: "admin/create-skill",
            element: <Protected authentication={true}><AddSkill /></Protected>
          },
          {
            path: "admin/user-management",
            element: <Protected authentication={true}><UserManagementComponent /></Protected>
          }
        ]
      },
      {
        path: "/my-courses/:courseId/topics",
        element: <Protected authentication={true}><Topic /></Protected>
      },
      {
        path: "/my-courses/:courseId/tests",
        element: <Protected authentication={true}><Test /></Protected>
      },
      {
        path: "/my-courses/:courseId/tests/:testId",
        element: <Protected authentication={true}><TestDetail /></Protected>
      }, 
      {
        path: "/my-courses/:courseId/tests/:testId/attempts/:attemptId",
        element: <Protected authentication={true}><TestAttemptDetail /></Protected>
      }, 
      {
        path: "/my-courses/:courseId/tests/:testId/start",
        element: <Protected authentication={true}><RealTimeTest /></Protected>
      },
      {
        path: "*",
        element: <Error />
      }
    ]
  },
])

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store }>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  // {/* </StrictMode> */}
)
