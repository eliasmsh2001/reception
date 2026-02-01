import { useEffect, useState } from 'react'
import AppointmentsMainTable from '../components/Tables/AppointmentsMainTable'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { getAllAppointments } from '../util/apis/appointmentsApis'
import ClinicsTotalAppointmentsTable from '../components/Tables/ClinicsTotalAppointmentsTable'
import { getAllClinics } from '../util/apis/clinicsAPIs'
import Loading from '../components/EssentialComponents/Loading'
import AddIcon from '@mui/icons-material/Add'
import { useDispatch } from 'react-redux'
import { dialogActions } from '../util/slicers/dialogSlicer'
import clsx from 'clsx'

const HomePage = () => {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState(null)
  const [appointmentsError, setAppointmentsError] = useState(false)
  const [clinics, setClinics] = useState(null)
  const [clinicsError, setClinicsError] = useState(false)
  const dispatch = useDispatch()

  // const {
  //   data,
  //   refetch: appointmentsRefetch,
  //   isPending: appointmentsIsPending
  // } = useQuery({
  //   queryKey: ['appointments'],
  //   queryFn: getAllAppointments,
  //   staleTime: 5 * 60 * 1000, // 5 minutes
  //   cacheTime: 30 * 60 * 1000, // 30 minutes
  //   refetchOnWindowFocus: false
  // })

  const { data: clinicsData } = useQuery({
    queryKey: ['clinics'],
    queryFn: getAllClinics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 5000
  })

  useEffect(() => {
    // if (data) {
    //   setAppointmentsError(false)
    //   setAppointments(data)
    // } else {
    //   setAppointments(null)
    //   setAppointmentsError(true)
    //   appointmentsRefetch()
    // }

    if (clinicsData) {
      setClinics(
        clinicsData?.sort((a, b) => b.archivedAppointments?.length - a.archivedAppointments?.length)
      )
      setClinicsError(false)
    } else {
      setClinics(null)
      setClinicsError(true)
    }
  }, [clinicsData])

  return (
    <main className="flex flex-col gap-6 items-center relative h-full overflow-y-scroll pt-20">
      <h1 className="absolute -top-20 right-20 text-white bg-secondaryText text-2xl font-extrabold py-2 w-44 rounded-lg text-center pointer-events-none">
        الصفحة الرئيسية
      </h1>
      {/* <div className="flex flex-row-reverse  px-24 w-full ">
        <div
          onClick={() => navigate('/newAppointment')}
          className="bg-unique font-bold text-white text-xl h-12 w-44 rounded-md hover:opacity-55 duration-200 flex justify-evenly items-center"
        >
          <AddIcon />
          <h1 className="text-center pb-2">موعد جديد</h1>
        </div>
      </div> */}

      <section className="w-full h-full flex flex-wrap gap-8 items-start justify-start p-8 flex-row-reverse ">
        {clinics?.map((item) => (
          <button
            onClick={() => dispatch(dialogActions.handleOpenAppointmentConfirmation(item))}
            className={clsx(
              'text-xl font-bold text-mainText min-w-32 p-4 flex flex-col gap-1 shadow-lg shadow-stone-400 border-2 border-mainText rounded-md bg-mainBlue/5 hover:opacity-45 hover:scale-110 duration-200',
              { 'opacity-50 pointer-events-none': item?.numberLimit === item?.appointments?.length }
            )}
            key={item?.id}
          >
            <span>{item?.name}</span>
            <span dir="rtl" className="text-sm">
              {item?.appointments?.length} {item?.numberLimit ? `من ${item?.numberLimit}` : ''}
            </span>
          </button>
        ))}
      </section>

      <div className="w-full justify-end flex items-start  gap-24 px-10 max-h-[30rem] overflow-y-scroll">
        {/* {clinics && clinics?.length > 0 && !clinicsError && (
          <ClinicsTotalAppointmentsTable
            data={clinics.sort((a, b) => b.appointments?.length - a.appointments?.length)}
            appointments={appointments}
          />
        )} */}

        {/* {appointments && appointments?.length > 0 && !appointmentsError && (
          <AppointmentsMainTable data={appointments} />
        )}

        {!appointments ||
          (!appointments?.length > 0 && (
            <h1 className="text-center w-full text-2xl font-extrabold text-mainBlue my-16">
              لا توجد مواعيد مسجلة
            </h1>
          ))}
        {appointmentsIsPending && (
          <div className="w-full flex justify-center items-center">
            <Loading />
          </div>
        )} */}
      </div>
    </main>
  )
}

export default HomePage
