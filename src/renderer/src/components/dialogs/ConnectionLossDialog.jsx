const handleClose = () => {}
import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useDispatch, useSelector } from 'react-redux'
import { dialogActions } from '../../util/slicers/dialogSlicer'
import { useLogout } from '../../hooks/UseLogout'

export default function ConnectionLossDialog({ open }) {
  const dispatch = useDispatch()
  const { logout } = useLogout()

  const handleClose = () => {
    dispatch(dialogActions.handleConnectionState(''))
  }

  return (
    <React.Fragment>
      <Dialog
        open={open === 'connectionLoss'}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent style={{ height: 300 }}>
          <div className="pt-10">
            <h1 className="text-3xl text-alert font-extrabold text-center mb-2">
              !فشل الإتصال بالسيرفر
            </h1>
            <h1 className="text-lg font-bold text-mainText text-center">
              الرجاء التأكد من الإتصال بالإنترنت والتأكد من الوصول الى السيرفر على العنوان
              192.168.0.5
            </h1>
            <h2 className=" font-bold text-stone-600 text-center my-5">
              ستتم إعادة المحاولة تلقائياً كل 5 ثواني
            </h2>
          </div>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              logout()
              window.close()
            }}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions> */}
      </Dialog>
    </React.Fragment>
  )
}
