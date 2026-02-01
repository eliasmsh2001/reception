import React, { useRef, useState } from 'react'
import { addNewClinic, getAllClinics } from '../../util/apis/clinicsAPIs'
import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Outlet, useNavigate } from 'react-router'
import { queryClient } from '../../util/apis/httpUrl'

const ClinicsSettings = () => {
  const { data } = useQuery({ queryKey: ['clinics'], queryFn: getAllClinics })
  const [isAddClinic, setIsAddClinic] = useState(true)
  const inputRef = useRef()
  const inputStyle = `border-2 border-stone-400 rounded-r-lg p-2 text-mainText font-bold outline-0 focus:border-secondaryText`

  const navigate = useNavigate()

  const { mutate } = useMutation({
    mutationFn: addNewClinic,
    mutationKey: ['clinics'],
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clinics'] })
    }
  })

  const handleSubmit = () => {
    if (inputRef.current.value === '') {
      return
    }
    mutate({ data: { clinicName: inputRef.current.value } })
  }

  return (
    <section className="w-full h-full border-t-2 border-mainText p-2 flex flex-col items-end">
      {isAddClinic && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-secondaryText rounded-l-lg px-2 text-sm font-bold text-white hover:opacity-55 duration-200"
          >
            أضف
          </button>
          <input
            ref={inputRef}
            className={inputStyle}
            type="text"
            dir="rtl"
            placeholder="أكتب إسم العيادة لإضافتها"
          />
        </div>
      )}
      <ul className="h-[35rem] overflow-scroll px-5 w-64 ">
        <li className="text-center text-mainBlue font-bold my-2">انقر على العيادة لتعديلها</li>
        <li className="bg-mainBlue py-2">
          <h1 className="text-center text-white font-bold">العيادة</h1>
        </li>
        {data &&
          data?.length &&
          data.map((item, index) => (
            <React.Fragment key={item.id}>
              <li
                onClick={() => {
                  navigate(`/settings/clinics/${item.id}`)
                }}
                className={clsx(
                  'flex flex-row-reverse gap-10 py-1 border-x-2 border-mainBlue px-2 cursor-pointer',
                  {
                    'bg-stone-200': index % 2 != 0
                  }
                )}
              >
                <h1>{item.name}</h1>
              </li>
            </React.Fragment>
          ))}
      </ul>

      <Outlet />
    </section>
  )
}

export default ClinicsSettings
