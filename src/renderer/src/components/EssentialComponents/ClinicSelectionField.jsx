import React, { useRef, useState } from 'react'
import ClinicSelectbox from '../ReuseableComponents/ClinicSelectbox'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { addNewClinic, getAllClinics } from '../../util/apis/clinicsAPIs'
import { queryClient } from '../../util/apis/httpUrl'

const ClinicSelectionField = ({ chosenClinic, setChosenClinic, clinics }) => {
  const [isAddClinic, setIsAddClinic] = useState(false)
  const inputRef = useRef()

  const inputStyle = `border-2 border-stone-400 rounded-r-lg p-2 text-mainText font-bold outline-0 focus:border-secondaryText`

  // const {
  //   data: clinics,
  //   isError,
  //   error,
  //   refetch
  // } = useQuery({ queryKey: ['clinics'], queryFn: getAllClinics })

  const { mutate } = useMutation({
    mutationFn: addNewClinic,
    mutationKey: ['clinics'],
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clinics'] })
      setChosenClinic(data.name)
      setIsAddClinic(false)
    }
  })

  const handleSubmit = () => {
    if (inputRef.current.value === '') {
      return
    }
    mutate({ data: { clinicName: inputRef.current.value } })
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex gap-5">
        <button
          onClick={isAddClinic ? () => setIsAddClinic(false) : () => setIsAddClinic(true)}
          type="button"
          className={clsx('size-12  rounded-full hover:opacity-55 duration-200', {
            'bg-alert': isAddClinic,
            'bg-unique': !isAddClinic
          })}
        >
          {!isAddClinic ? (
            <AddIcon style={{ fill: 'white' }} />
          ) : (
            <CloseIcon style={{ fill: 'white' }} />
          )}
        </button>
        {/* 
        ?.filter((item) =>
              item?.numberLimit && item?.numberLimit > 0
                ? item?.numberLimit !== item?.appointments?.length
                : item
            ) */}

        {clinics && clinics?.length > 0 && (
          <ClinicSelectbox
            clinics={clinics?.sort(
              (a, b) => b.archivedAppointments.length - a.archivedAppointments.length
            )}
            chosenClinic={chosenClinic}
            setChosenClinic={setChosenClinic}
          />
        )}
      </div>
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
    </section>
  )
}

export default ClinicSelectionField
