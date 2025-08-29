import { HashRouter, Routes, Route, Navigate } from 'react-router'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RootLayout from './pages/RootLayout'
import { QueryClientProvider } from '@tanstack/react-query'
import UseAuthContext from './hooks/UseAuthContext'

import url, { queryClient } from './util/apis/httpUrl'
import { NewAppointmentPage } from './pages/NewAppointmentPage'
import ArchivedAppointmentsPage from './pages/ArchivedAppointmentsPage'
import { useEffect, useState } from 'react'
import ReportsPage from './pages/ReportsPage'
import YearlyTotalAppointments from './components/statistics/YearlyTotalAppointments'
import AreasReport from './components/statistics/AreasReport'
import NotfoundPage from './pages/NotfoundPage'
import ClinicsReport from './components/statistics/ClinicsReport'
import StatisticsPage from './pages/StatisticsPage'
import GlobalReport from './components/reports/GlobalReport'
import SettingsPage from './pages/SettingsPage'
import UsersSettings from './components/settings/UsersSettings'
import ClinicsSettings from './components/settings/ClinicsSettings'
import AreasSettings from './components/settings/AreasSettings'
import EditClinicPage from './components/settings/EditClinicPage'
import { useLogout } from './hooks/UseLogout'

function App() {
  // const user = true
  const { user } = UseAuthContext()
  const userAuthority = JSON.parse(localStorage.getItem('user'))?.existingUser?.authority
  const { logout } = useLogout()
  const [connectionState, setConnectionState] = useState('')

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await fetch(`${url}/health`, { cache: 'no-store' })
        setConnectionState('')
      } catch {
        logout()
        setConnectionState('loss')
      }
    }

    const intervalId = setInterval(checkBackend, 15000) // Check every 15 seconds
    checkBackend() // Initial check

    return () => clearInterval(intervalId)
  }, [connectionState])

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {connectionState === 'loss' && (
          <div className="absolute w-screen h-screen flex justify-center items-center bg-black/55 z-20">
            <div className="bg-white w-[40rem] h-[15rem] py-10 px-4 rounded-xl flex justify-center items-center flex-col">
              <h1 className="text-3xl text-alert font-extrabold text-center mb-2">
                !فشل الإتصال بالسيرفر
              </h1>
              <h1 className="text-lg font-bold text-mainText text-center">
                الرجاء التأكد من الاتصال بالعنوان 192.168.0.5
              </h1>
              <h2 className=" font-bold text-stone-600 text-center my-5">
                ستتم إعادة المحاولة تلقائياً كل 15 ثانية
              </h2>
              <button
                onClick={() => setConnectionState('')}
                className="bg-mainBlue rounded-md py-2 px-6 text-white font-bold"
              >
                حسناً
              </button>
            </div>
          </div>
        )}
        <HashRouter>
          <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route path="/" element={user ? <RootLayout /> : <Navigate to="/login" />}>
              <Route path="home" element={user ? <HomePage /> : <Navigate to="/login" />} />
              <Route
                path="/newAppointment"
                element={user ? <NewAppointmentPage /> : <Navigate to="/login" />}
              />
              {userAuthority === 'admin' && (
                <>
                  <Route path="/settings" element={<SettingsPage />}>
                    <Route index element={<UsersSettings />} />
                    <Route path="clinics" element={<ClinicsSettings />} />
                    <Route path="clinics/:id" element={<EditClinicPage />} />
                    <Route path="areas" element={<AreasSettings />} />
                  </Route>

                  <Route
                    path="/archivedAppointments"
                    element={user ? <ArchivedAppointmentsPage /> : <Navigate to="/login" />}
                  />
                  <Route
                    path="/statistics"
                    element={user ? <StatisticsPage /> : <Navigate to="/login" />}
                  >
                    <Route index element={<YearlyTotalAppointments />} />
                    <Route path="areas" element={<AreasReport />} />
                    <Route path="clinics" element={<ClinicsReport />} />
                  </Route>
                  <Route
                    path="/reports"
                    element={user ? <ReportsPage /> : <Navigate to="/login" />}
                  >
                    <Route index element={<GlobalReport />} />
                  </Route>
                </>
              )}
              <Route path="*" element={<NotfoundPage />} />
            </Route>
          </Routes>
        </HashRouter>{' '}
      </QueryClientProvider>
    </>
  )
}

export default App
