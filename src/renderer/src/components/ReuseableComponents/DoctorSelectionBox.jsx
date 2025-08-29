import * as React from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

export default function DoctorSelectionBox({ doctors, chosenDoctor, setChosenDoctor }) {
  const handleChange = (value) => {
    setChosenDoctor(value)
  }

  return (
    // <Box sx={{ minWidth: 300 }}>
    //   <FormControl fullWidth>
    //     <InputLabel id="demo-simple-select-label">الدكتور</InputLabel>
    //     <Select
    //       labelId="demo-simple-select-label"
    //       id="demo-simple-select"
    //       value={chosenDoctor}
    //       label="الدكتور"
    //       onChange={handleChange}
    //     >
    //       {doctors && doctors.map((item) => <MenuItem value={item.name}>{item.name}</MenuItem>)}
    //     </Select>
    //   </FormControl>
    // </Box>
    <select
      value={chosenDoctor}
      onChange={(e) => handleChange(e.target.value)}
      className="w-64 text-right text-sm text-mainText font-bold p-2 border-2 border-stone-400 rounded-lg outline-0 focus:border-mainBlue "
    >
      <option value="">اختر دكتور</option>
      {doctors?.map((item, index) => (
        <option className="" key={index} value={item.name}>
          {item.name}
        </option>
      ))}
    </select>
  )
}
