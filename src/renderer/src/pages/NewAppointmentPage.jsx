import React from 'react'
import { useNavigate } from 'react-router'
import RedoIcon from '@mui/icons-material/Redo'
import GenderSelectbox from '../components/ReuseableComponents/GenderSelectbox'
import ClinicSelectionField from '../components/EssentialComponents/ClinicSelectionField'
import DoctorSelectionField from '../components/EssentialComponents/DoctorSelectionField'
import { addNewDoctor, getAllDocs } from '../util/apis/doctorsAPIs'
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '../util/apis/httpUrl'
import clsx from 'clsx'
import { addNewAppointment, getAllArea } from '../util/apis/appointmentsApis'
import { useReactToPrint } from 'react-to-print'
import PrintableCard from '../components/printableComponents/PrintableCard'
import { getAllClinics } from '../util/apis/clinicsAPIs'

export const NewAppointmentPage = () => {
  const [gender, setGender] = React.useState('')
  const [chosenDoctor, setChosenDoctor] = React.useState('')
  const [chosenClinic, setChosenClinic] = React.useState('')
  const [newAppointment, setNewAppointment] = React.useState({})
  const [areaValue, setAreaValue] = React.useState('')
  const [error, setError] = React.useState(null)
  const [btnIsDisabled, setbtnIsDisabled] = React.useState(false)
  const formRef = React.useRef()

  const contentRef = React.useRef(null)
  const userId = JSON.parse(localStorage.getItem('user')).existingUser?.id
  const reactToPrintFn = useReactToPrint({
    contentRef,
    pageStyle: `@page {
        size: A6;
        margin: 0;
      }`
  })

  const navigate = useNavigate()
  const inputStyle = `border-2 border-stone-400 rounded-lg p-2 text-mainText font-bold outline-0 focus:border-secondaryText`

  const { mutate: addAppointment } = useMutation({
    mutationFn: addNewAppointment,
    mutationKey: ['appointments'],
    onSuccess: async (data) => {
      setNewAppointment(data)
      formRef.current.reset()
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      setTimeout(() => {
        reactToPrintFn()
      }, 600)
      setTimeout(() => {
        navigate('/home')
        setbtnIsDisabled(false)
      }, 600)
      // socket?.close()
      // reader?.abort()
    },
    onError: (error) => {
      setbtnIsDisabled(false)
      setError(error.message)
    }
  })

  const { data: clinics, isError } = useQuery({
    queryKey: ['clinics'],
    queryFn: getAllClinics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false
  })

  const { mutate: addDoc } = useMutation({
    mutationFn: addNewDoctor,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] })
      setChosenDoctor(data.name)
    }
  })

  const { data } = useQuery({
    queryKey: ['doctors', chosenClinic],
    queryFn: ({ signal }) => getAllDocs({ signal, clinic: chosenClinic })
  })

  const { data: areas } = useQuery({
    queryKey: ['areas', areaValue],
    queryFn: ({ signal }) =>
      getAllArea({
        signal,
        area: areaValue,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 30 * 60 * 1000, // 30 minutes
        refetchOnWindowFocus: false
      })
  })

  const handleSubmit = React.useCallback((e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    setbtnIsDisabled(true)
    addAppointment({ data, chosenClinic, chosenDoctor, gender, userId })
  })

  // React.useEffect(() => {
  //   const form = document.getElementById('myForm')
  //   const handleSubmit = (e) => {}

  //   form.addEventListener('submit', handleSubmit)
  //   return () => form.removeEventListener('submit', handleSubmit) // Cleanup
  // }, [])

  return (
    <form
      ref={formRef}
      id="myForm"
      className=" flex flex-col items-center gap-10 relative"
      onSubmit={handleSubmit}
    >
      <h1 className="absolute -top-20 right-20 text-white bg-secondaryText text-2xl font-extrabold py-2 w-44 rounded-lg text-center pointer-events-none">
        موعد جديد
      </h1>
      <div className="relative flex justify-center flex-row-reverse gap-10  py-10 ">
        <button
          type="button"
          className="bg-alert rounded-full absolute right-5 -top-10 size-12"
          onClick={() => navigate('/home')}
        >
          <RedoIcon style={{ fill: 'white' }} />
        </button>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col items-end ">
            <label htmlFor="name" className="text-mainText text-sm font-bold">
              الإسم الرباعي
            </label>
            <input id="name" name="name" className={`${inputStyle} w-72`} type="text" dir="rtl" />
          </div>
          {/* <div className="flex flex-col items-end">
            <label htmlFor="phoneNumber" className="text-mainText text-sm font-bold">
              رقم الهاتف
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              className={`${inputStyle} w-72`}
              type="text"
              dir="rtl"
            />
          </div> */}
          <div className="flex flex-col items-end relative">
            <label htmlFor="address" className="text-mainText text-sm font-bold">
              عنوان السكن
            </label>
            <input
              onChange={(event) => setAreaValue(event.target.value)}
              value={areaValue}
              id="address"
              name="address"
              className={`${inputStyle} w-72`}
              type="text"
              dir="rtl"
            />
            {areas && areas.length > 0 && (
              <div className="absolute top-16 bg-white z-10 shadow-md shadow-black rounded-xl text-mainText w-full flex flex-col items-end py-2 max-h-52 overflow-y-scroll">
                {areas.map((item) => (
                  <button
                    className={clsx('w-full hover:bg-slate-200 py-1 px-4', {
                      'pointer-events-none hidden': item.name === 'غير معروف'
                    })}
                    type="button"
                    key={item.id}
                    onClick={() => setAreaValue(item.name)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-row-reverse items-center justify-between gap-4">
            <div className="flex flex-col items-end">
              <label htmlFor="age" className="text-mainText text-sm font-bold">
                العمر
              </label>
              <input id="age" name="age" className={`${inputStyle} w-24`} type="number" dir="rtl" />
            </div>
            <GenderSelectbox gender={gender} setGender={setGender} />
          </div>
        </section>
        <section className="flex flex-col gap-4 py-4">
          {clinics && clinics?.length > 0 && (
            <ClinicSelectionField
              chosenClinic={chosenClinic}
              setChosenClinic={setChosenClinic}
              clinics={clinics}
            />
          )}
          <div className={clsx({ 'opacity-40 pointer-events-none': chosenClinic === '' })}>
            <DoctorSelectionField
              addDoc={addDoc}
              doctors={data?.doctor}
              chosenDoctor={chosenDoctor}
              setChosenDoctor={setChosenDoctor}
            />
          </div>
        </section>
      </div>
      <h1 className="text-alert font-extrabold text-lg">{error}</h1>
      <button
        className={clsx(
          'bg-secondaryText text-white font-bold w-72 py-2 rounded-md hover:opacity-55 duration-200',
          {
            'pointer-events-none opacity-45': btnIsDisabled,
            'pointer-events-auto opacity-100': !btnIsDisabled
          }
        )}
      >
        تأكيد الموعد
      </button>

      <div className="hidden">
        <PrintableCard contentRef={contentRef} item={newAppointment} />
      </div>
    </form>
  )
}
