const express = require('express')
const { PrismaClient } = require('../generated/prisma/client')
const cron = require('node-cron')

const appointmentsRouter = express.Router()
const prisma = new PrismaClient()

appointmentsRouter.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send('Server error')
})

let date = new Date()
let year = date.getFullYear() // 4-digit year (2023)
let month = date.getMonth() // 0-11 (0 = January)
let day = date.getDate() // 1-31
let time = date.toTimeString().slice(0, 5)
const arabicDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
let dayOfWeek = date.getDay()

cron.schedule('* * * * * *', async () => {
  date = new Date()
  year = date.getFullYear() // 4-digit year (2023)
  month = date.getMonth() // 0-11 (0 = January)
  day = date.getDate() // 1-31
  time = date.toTimeString().slice(0, 5)
  dayOfWeek = date.getDay()
})

appointmentsRouter.get('/getAppointments', async (req, res) => {
  try {
    const appointment = await prisma.appointment.findMany({})
    const sortedAppointments = [...appointment].sort((a, b) => {
      return b.time.localeCompare(a.time)
    })

    res.json(sortedAppointments)
  } catch (e) {
    res.status(200).json({ error: 'There was an issue while finding clinics!!' })
  }
})

appointmentsRouter.get('/areas', async (req, res) => {
  const { area } = req.query

  const allAreas = await prisma.area.findMany({})
  try {
    if (area && area.length > 0) {
      const filteredAreas = allAreas.filter(
        (item) => item.name.trim().includes(area.trim()) && item.name != area
      )
      res.json(filteredAreas)
    }
  } catch (e) {
    res.status(200).json({ error: `Something went wrong! Could not fetch areas.` })
  }
})

appointmentsRouter.post('/addNewAppointment', async (req, res) => {
  const { data, gender, chosenClinic, chosenDoctor, userId } = req.body
  if (
    !data.name ||
    data.name === '' ||
    !data.address ||
    data.address == '' ||
    data.address.length <= 3 ||
    !data.age ||
    data.age === '' ||
    !gender ||
    !chosenClinic
    // !chosenDoctor ||
  ) {
    //....
    return res.status(406).json({
      success: false,
      status: 406,
      message: 'falsey data'
    })
  }

  const existingClinic = await prisma.clinic.findUnique({
    where: { name: chosenClinic },
    include: { appointments: true }
  })

  if (existingClinic.numberLimit && Number(existingClinic.numberLimit) > 0) {
    if (existingClinic.numberLimit <= existingClinic.appointments.length) {
      return res.status(405).json({
        success: false,
        status: 405,
        message: 'max appointments'
      })
    }
  }

  try {
    const existingArea = await prisma.area.findUnique({ where: { name: data.address.trim() } })

    let newArea

    if (!existingArea) {
      newArea = await prisma.area.create({ data: { name: data.address.trim() } })
    }

    let currentPeriod
    if (date.getHours() >= 8 && date.getHours() < 14) {
      currentPeriod = 'الفترة الصباحية'
    } else if (date.getHours() >= 14 && date.getHours() < 20) {
      currentPeriod = 'الفترة المسائية'
    } else if (date.getHours() >= 20 || (date.getHours() >= 0 && date.getHours() < 8)) {
      currentPeriod = 'الفترة الليلية'
    }

    const newAppontment = await prisma.appointment.create({
      data: {
        name: data.name,
        // phoneNumber: data.phoneNumber,
        phoneNumber: 'Unknown',
        appointmentNum:
          existingClinic.appointments.length < 1 ? 1 : existingClinic.appointments.length + 1,
        address: existingArea ? existingArea.name : newArea.name,
        areaId: existingArea ? existingArea.id : newArea.id,
        age: Number(data.age),
        gender: gender,
        doctorName: chosenDoctor,
        // doctorName: 'Unknown',
        clinicName: chosenClinic,
        clinicId: existingClinic.id,
        date: `${year}-${month + 1}-${day}`,
        day: arabicDays[dayOfWeek],
        time: time,
        period: currentPeriod,
        userId: userId

        // clinic: {
        //   connect: { id: existingClinic.id }
        // },
        // area: {
        //   connect: { id: existingArea.id }
        // },
        // user: { connect: { id: userId } }
        // doctor: { connect: { id: '' } }
      }
    })

    const newArchivedAppontment = await prisma.archivedappointment.create({
      data: {
        id: newAppontment.id,
        name: data.name,
        phoneNumber: 'unknown',
        // phoneNumber: data.phoneNumber,
        appointmentNum:
          existingClinic.appointments.length < 1 ? 1 : existingClinic.appointments.length + 1,
        address: data.address && data.address.length > 2 ? data.address : 'غير معروف',
        areaId: existingArea ? existingArea.id : newArea.id,
        age: Number(data.age),
        gender: gender,
        doctorName: 'Unknown',
        clinicName: chosenClinic,
        clinicId: existingClinic.id,
        date: `${year}-${month + 1}-${day}`,
        // date: `2025-4-3`,
        day: arabicDays[dayOfWeek],
        time: time,
        period: currentPeriod,
        userId: userId,
        // doctorId: 'Unknown'
        doctorId: existingClinic.doctor.find((item) => item.name === chosenDoctor)
          ? existingClinic.doctor.find((item) => item.name === chosenDoctor).id
          : 'Unknown'

        // clinic: {
        //   connect: { id: existingClinic.id }
        // },
        // area: {
        //   connect: { id: existingArea.id }
        // },
        // user: { connect: { id: userId } }
      }
    })
    res.json(newAppontment)
    // res.send('new done')
  } catch (e) {
    // res.status(200).json({ error: 'There was an issue while adding new clinic!' })
    console.log(e)
    return res.status(420).json({
      success: false,
      status: 420,
      message: 'max appointments'
    })
  }
})

appointmentsRouter.delete('/deleteAppointment', async (req, res) => {
  const appointmentId = req.body.appointmentId

  const existingAppointment = await prisma.appointment.findUnique({
    where: { id: appointmentId }
  })
  const existingArchivedAppointment = await prisma.archivedappointment.findUnique({
    where: { id: appointmentId }
  })

  if (!existingAppointment) {
    res.status(200).json({ error: 'Could not find this item to delete it!!!' })
  }
  try {
    const deletedItem = await prisma.appointment.delete({ where: { id: appointmentId } })
    if (existingArchivedAppointment) {
      const deletedArchivedAppontment = await prisma.archivedappointment.delete({
        where: { id: appointmentId }
      })
    }
    res.json(deletedItem)
  } catch (e) {
    res.status(200).json({ error: 'Something went wrong!! Could not delete this item.' })
  }
})

appointmentsRouter.get('/getArchivedAppointments', async (req, res) => {
  const { year, month, chosenClinic, searchTerm, day, currentPeriod, chosenArea, selectedUser } =
    req.query

  try {
    const users = await prisma.user.findMany({})
    const existingUser = users.find((item) => item.username === selectedUser)
    const archivedAppointments = await prisma.archivedappointment.findMany({})
    const filteredAppointments = archivedAppointments.filter(
      (item) =>
        (Number(year) ? new Date(item.date).getFullYear() === Number(year) : item) &&
        (Number(month) > 0 ? new Date(item.date).getMonth() + 1 === Number(month) : item) &&
        (Number(day) > 0 ? new Date(item.date).getDate() === Number(day) : item) &&
        (chosenClinic != 'الكل' ? item.clinicName === chosenClinic : item) &&
        (searchTerm != 'null' ? item.name.includes(searchTerm) : item) &&
        (currentPeriod !== 'الكل' ? item.period === currentPeriod : item) &&
        (chosenArea !== 'الكل' ? item.address === chosenArea : item) &&
        (selectedUser !== 'الكل' ? item.userId === existingUser.id : item)
    )

    const tweakedAppointments = filteredAppointments.map((item) => ({
      ...item,
      user: users.find((user) => user.id === item.userId)?.username
    }))

    res.json(tweakedAppointments.sort((a, b) => new Date(b.date) - new Date(a.date)))
  } catch (e) {
    // console.log(e)
    res.status(200).json({ error: `Something went wrong!! Could not fetch archived appointments.` })
  }
})

appointmentsRouter.get('/allAreas', async (req, res) => {
  try {
    const areas = await prisma.area.findMany({ include: { archivedAppointments: true } })
    res.json(areas)
  } catch (e) {
    res.status(200).json({ error: `Something went wrong!! Could not fetch areas` })
  }
})

appointmentsRouter.delete('/deleteArea', async (req, res) => {
  try {
    const areaToDelete = await prisma.area.findUnique({
      where: { id: req.body.id },
      include: { archivedAppointments: true }
    })
    if (!areaToDelete) {
      return
    }

    const areas = await prisma.area.findMany({})
    let unknownArea = areas.find((item) => item.name === 'غير معروف')
    if (!unknownArea) {
      unknownArea = await prisma.area.create({
        data: {
          name: 'غير معروف'
        }
      })
    }

    if (areaToDelete.archivedAppointments.length > 0) {
      const updatedAppointments = await prisma.archivedappointment.updateMany({
        where: { areaId: areaToDelete.id },
        data: {
          areaId: unknownArea.id
        }
      })
    }

    const deletedItem = await prisma.area.delete({ where: { id: req.body.id } })

    res.json(deletedItem)
  } catch (e) {
    // console.log(e)
    res.status(200).json({ error: `Something went wrong!! Could not fetch areas` })
  }
})

appointmentsRouter.put('/editArea', async (req, res) => {
  const { oldId, chosenArea } = req.body
  const existingArea = await prisma.area.findUnique({ where: { id: oldId } })
  if (!existingArea) {
    // console.log('not font existing')
    return
  }

  const areas = await prisma.area.findMany({})
  const areaToSwitchTo = areas.find((item) => item.name === chosenArea)

  if (!areaToSwitchTo) {
    // console.log('not font area')
    return
  }

  try {
    const updatedAppointments = await prisma.archivedappointment.updateMany({
      where: { areaId: oldId },
      data: {
        address: chosenArea,
        areaId: areaToSwitchTo.id
      }
    })

    const deletedArea = await prisma.area.delete({ where: { id: oldId } })
    res.json(updatedAppointments)
  } catch (e) {
    // console.log(e)
    res.status(200).json({ error: `Something went wrong!! Could not fetch areas` })
  }
})

appointmentsRouter.post('/archivedAppointmentToEdit', async (req, res) => {
  const data = req.body
  const existingAppointment = await prisma.archivedappointment.findUnique({
    where: { id: data.itemId }
  })

  let area = await prisma.area.findUnique({ where: { name: data.data.address } })

  const doctor = await prisma.doctor.findFirstOrThrow({ where: { name: data.chosenDoctor } })

  const clinic = await prisma.clinic.findUnique({ where: { name: data.chosenClinic } })

  if (!existingAppointment) {
    return res.status(400).json({
      success: false
    })
  }
  try {
    const updatedAppointment = await prisma.archivedappointment.update({
      where: {
        id: data.itemId
      },
      data: {
        address: area ? area.name : existingAppointment.address,
        areaId: area ? area.id : existingAppointment.areaId,
        doctorName:
          String(data?.chosenDoctor).length > 1 ? doctor.name : existingAppointment.doctorName,
        clinicName:
          String(data?.chosenClinic).length > 2 ? clinic.name : existingAppointment.clinicName,
        clinicId: clinic.id
      }
    })
    res.json(updatedAppointment)
  } catch (e) {
    // console.log(e)
    res.status(200).json({ error: `Something went wrong!! Could not edit appointment` })
  }
})

module.exports = appointmentsRouter
