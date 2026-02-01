import { Outlet } from 'react-router'
import MainSidebar from '../components/EssentialComponents/MainSidebar'
import logoimg from '../assets/images.jpg'
import UseAuthContext from '../hooks/UseAuthContext'
import LogoutComfirmationDialog from '../components/dialogs/LogoutComfirmationDialog'
import CloseAppConfirmation from '../components/dialogs/CloseAppConfirmation'
import waveImage from '../assets/wave.svg'
import { useEffect, useState } from 'react'
import EditArchivedAppointment from '../components/dialogs/EditArchivedAppointment'
import AreasReportTableDialog from '../components/dialogs/AreasReportTableDialog'
import DeleteUserConfirmation from '../components/dialogs/DeleteUserConfirmation'
import AddNewUserDialog from '../components/dialogs/AddNewUserDialog'
import EditUserDialog from '../components/dialogs/EditUserDialog'
import ConnectionLossDialog from '../components/dialogs/ConnectionLossDialog'
import AppointmentConfirmationDialog from '../components/dialogs/AppointmentConfirmationDialog'

const RootLayout = () => {
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5))
  const today = new Date().toUTCString().slice(0, 16)
  const { user } = UseAuthContext()
  const [currentPeriod, setCurrentPeriod] = useState(null)
  const [username, setUserName] = useState()
  const hour = new Date().getHours()
  const minutes = new Date().getMinutes()
  useEffect(() => {
    const timerID = setInterval(() => {
      setTime(new Date().toTimeString().slice(0, 5))
    }, 1000)
    setUserName(JSON.parse(localStorage.getItem('user'))?.existingUser?.username)

    // Cleanup the interval on component unmount
    if (hour >= 7 && hour < 14) {
      hour === 7 && minutes < 45
        ? setCurrentPeriod('الفترة الليلية')
        : setCurrentPeriod('الفترة الصباحية')
    } else if (hour >= 14 && hour < 20) {
      setCurrentPeriod('الفترة المسائية')
    } else if ((hour >= 20 && hour <= 23) || (hour >= 0 && hour < 8)) {
      setCurrentPeriod('الفترة الليلية')
    }
    return () => clearInterval(timerID)
  }, [time])

  //
  return (
    <>
      <main className="relative flex  flex-row-reverse h-screen">
        <img src={waveImage} className="fixed -z-10" />
        <MainSidebar />
        <section className=" flex flex-col gap-4 left-5 top-5 w-full">
          <div className="w-full flex gap-4  justify-between px-8 py-4 ">
            <div className="flex items-center gap-4">
              <img src={logoimg} alt="" className=" size-48 rounded-full " />
              <div className="flex flex-col gap-2 items-center  text-white font-bold text-lg">
                <h1>العيادة المجمعة زاوية الدهماني</h1>
                <h1>الإستعلامات</h1>
              </div>
            </div>
            <div className="text-lg font-bold text-white py-10 flex flex-row-reverse gap-4">
              {username && <h1> {username} مرحباً</h1>}
            </div>
            <div className="text-lg font-bold text-white py-10 flex flex-row-reverse gap-4">
              <h1>{time}</h1>
              <h1>{today}</h1>-<h1 className="text-center">{currentPeriod}</h1>
            </div>
          </div>
          <Outlet />
        </section>
      </main>
      <LogoutComfirmationDialog />
      <CloseAppConfirmation />
      <EditArchivedAppointment />
      <AreasReportTableDialog />
      <DeleteUserConfirmation />
      <AddNewUserDialog />
      <EditUserDialog />
      <AppointmentConfirmationDialog />
    </>
  )
}

export default RootLayout
