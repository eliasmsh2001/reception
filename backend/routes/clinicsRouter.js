const express = require('express')
const { PrismaClient } = require('../generated/prisma/client')
const cron = require('node-cron')

const clinicsRouter = express.Router()
const prisma = new PrismaClient()

let currentPeriod

cron.schedule('* * * * * *', async () => {
  const hour = new Date().getHours()
  const today = new Date().getDate()

  if (hour >= 8 && hour < 14) {
    currentPeriod = 'الفترة الصباحية'
  } else if (hour >= 14 && hour < 20) {
    currentPeriod = 'الفترة المسائية'
  } else if ((hour >= 20 && hour <= 23) || (hour >= 0 && hour < 8)) {
    currentPeriod = 'الفترة الليلية'
  }

  try {
    const appointments = await prisma.appointment.findMany({})

    if (appointments[appointments.length - 1].period !== currentPeriod) {
      await prisma.appointment.deleteMany()
    }
  } catch (error) {}
})

clinicsRouter.post('/addClinic', async (req, res) => {
  try {
    const newClinic = await prisma.clinic.create({
      data: {
        name: req.body.clinicName
      }
    })

    res.json(newClinic)
  } catch (e) {
    res.status(200).json({ error: `Something went wrong!! Could not add this clinic.` })
  }
})

clinicsRouter.get('/getClinics', async (req, res) => {
  try {
    const clinics = await prisma.clinic.findMany({
      include: { appointments: true, archivedAppointments: true }
    })
    // const sortedClinics = clinics.sort(
    //   (a, b) => b.archivedAppointments.length - a.archivedAppointments.length
    // )

    let clinicsToGo = clinics

    if (currentPeriod === 'الفترة الليلية') {
      clinicsToGo = clinics.filter(
        (item) =>
          item.name === 'اطفال' ||
          item.name === 'ملاحظه النساء ' ||
          item.name === 'ملاحظه الرجال ' ||
          item.name === 'نساء ولاده' ||
          item.name === 'صحه عامه '
      )
    }

    res.json(clinicsToGo)
  } catch (e) {
    res.status(200).json({ error: `Something went wrong!! Could not find clinics.` })
  }
})

clinicsRouter.get('/getClinicToEdit', async (req, res) => {
  const { id } = req.query
  try {
    const clinic = await prisma.clinic.findUnique({
      where: { id },
      include: { appointments: true, archivedAppointments: true, doctor: true }
    })

    res.json(clinic)
  } catch (e) {
    res.status(200).json({ error: `Something went wrong!! Could not find clinics.` })
  }
})
clinicsRouter.put('/editClinicLimit', async (req, res) => {
  const { limit, id } = req.body
  try {
    const updatedClinic = await prisma.clinic.update({
      where: { id },
      data: {
        numberLimit: Number(limit)
      }
    })

    res.json(updatedClinic)
  } catch (e) {
    res.status(200).json({ error: `Something went wrong!! Could not find clinics.` })
  }
})

clinicsRouter.delete('/deleteDoctor', async (req, res) => {
  try {
    const deletedDoc = await prisma.doctor.delete({
      where: { id: req.body.id }
    })

    res.json(deletedDoc)
  } catch (e) {
    res.status(200).json({ error: `Something went wrong!! Could not find clinics.` })
  }
})

module.exports = clinicsRouter
