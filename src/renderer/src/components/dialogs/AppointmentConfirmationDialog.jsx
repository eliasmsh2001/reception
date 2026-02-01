import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { useDispatch, useSelector } from 'react-redux'
import { dialogActions } from '../../util/slicers/dialogSlicer'
// import EditIcon from '@mui/icons-material/Edit'
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop'
import DeleteIcon from '@mui/icons-material/Delete'
import { useMutation, useQueries, useQuery } from '@tanstack/react-query'
import { addNewAppointment, deleteAppointment } from '../../util/apis/appointmentsApis'
import { queryClient } from '../../util/apis/httpUrl'
import { useReactToPrint } from 'react-to-print'
import { useRef } from 'react'
import PrintableCard from '../printableComponents/PrintableCard'
import { getClinicToEdit } from '../../util/apis/clinicsAPIs'

export default function AppointmentConfirmationDialog() {
  const open = useSelector((state) => state.dialog.dialog)
  const item = useSelector((state) => state.dialog.clinic)
  const [newAppointment, setNewAppointment] = React.useState(null)
  const userId = JSON.parse(localStorage.getItem('user')).existingUser?.id

  const dispatch = useDispatch()
  const contentRef = useRef(null)
  const reactToPrintFn = useReactToPrint({
    contentRef,
    pageStyle: `@page {
      size: A6;
      margin: 0;
    }`
  })

  const [error, setError] = React.useState(null)

  const handleClose = () => {
    dispatch(dialogActions.handleCloseAppointmentDatails())
  }

  const { mutate: addAppointment } = useMutation({
    mutationFn: addNewAppointment,
    mutationKey: ['appointments'],
    onSuccess: async (data) => {
      setNewAppointment(data)
      queryClient.invalidateQueries({ queryKey: ['clinics'] })
      queryClient.invalidateQueries({ queryKey: ['appointments'] })

      setTimeout(() => {
        reactToPrintFn()
      }, 600)
      setTimeout(() => {
        dispatch(dialogActions.handleCloseAppointmentConfirmation())
      }, 700)
    },
    onError: (error) => {
      setError(error.message)
    }
  })

  return (
    <React.Fragment>
      <Dialog
        open={open === 'appointmentConfirmation'}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ width: 300 }}>
          <DialogContentText id="alert-dialog-description"></DialogContentText>

          <h1 className="text-center text-xl font-bold bg-mainText text-white rounded-md py-4">
            {item?.name}
          </h1>

          {/* <h1 className="text-center text-mainText mt-8 font-semibold mb-4">الرقم الحالى</h1> */}
          {/* <h1 className="text-xl font-bold text-mainText text-center">
            {item?.appointments && item?.appointments?.length < 1
              ? 'لم يتم سحب أي رقم بعد'
              : item?.appointments?.length}
          </h1> */}

          <div className="flex flex-col gap-2 mt-8">
            <button
              onClick={() =>
                addAppointment({
                  data: null,
                  chosenClinic: item?.name,
                  chosenDoctor: null,
                  gender: null,
                  userId
                })
              }
              className="bg-mainBlue py-2 rounded-md text-white font-bold text-lg hover:opacity-45 duration-200"
            >
              سحب رقم
            </button>
            <button
              onClick={handleClose}
              className="bg-alert py-2 rounded-md text-white font-bold text-lg hover:opacity-45 duration-200"
            >
              إلغاء العملية
            </button>
          </div>

          <div className="hidden">
            <PrintableCard contentRef={contentRef} item={newAppointment} />
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
