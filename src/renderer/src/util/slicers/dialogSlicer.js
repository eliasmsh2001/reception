import { createSlice } from '@reduxjs/toolkit'

const dialogSlicer = createSlice({
  name: 'dialog',
  initialState: {
    dialog: '',
    // clinicId: '',
    appointment: null,
    appointmentId: null,
    areasData: null,
    userId: null,
    connectionState: null,
    clinic: null
  },
  reducers: {
    hadleOpenDialog(state, action) {
      state.dialog = action.payload
    },

    handleOpenAppointmentConfirmation(state, action) {
      state.dialog = 'appointmentConfirmation'
      state.clinic = action.payload
    },

    handleCloseAppointmentConfirmation(state, action) {
      state.dialog = ''
      state.clinicId = ''
    },

    handleOpenAppointmentDatails(state, action) {
      state.dialog = 'appointmentDetails'
      state.appointment = action.payload
    },
    handleCloseAppointmentDatails(state, action) {
      state.dialog = ''
      state.appointment = null
    },
    handleOpenEditArchived(state, action) {
      state.dialog = 'editArchived'
      state.appointmentId = action.payload
    },
    handleCloseEditArchived(state) {
      state.dialog = ''
      state.appointmentId = null
    },
    handleAreasReportTable(state, action) {
      state.dialog = 'areasTable'
      state.areasData = action.payload
    },
    handleCloseAreasReportTable(state, action) {
      state.dialog = ''
      state.areasData = null
    },
    handleDeleteUser(state, action) {
      state.dialog = action.payload.dialog
      state.userId = action.payload.userId
    },
    handleAddNewUser(state, action) {
      state.dialog = action.payload
    },
    handleConnectionState(state, action) {
      state.connectionState === action.payload
    }
  }
})

export default dialogSlicer
export const dialogActions = dialogSlicer.actions
