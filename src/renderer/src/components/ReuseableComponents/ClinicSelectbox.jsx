import * as React from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

export default function ClinicSelectbox({ clinics, chosenClinic, setChosenClinic, isArchive }) {
  const handleChange = (value) => {
    setChosenClinic(value)
  }

  return (
    // <Box sx={{ minWidth: 300 }}>
    //   <FormControl fullWidth>
    //     {!isArchive && <InputLabel id="demo-simple-select-label">العيادة</InputLabel>}
    //     <Select
    //       MenuProps={{
    //         PaperProps: {
    //           style: {
    //             maxHeight: 200
    //           }
    //         }
    //       }}
    //       labelId="demo-simple-select-label"
    //       id="demo-simple-select"
    //       value={chosenClinic}
    //       label="العيادة"
    //       onChange={handleChange}
    //     >
    //       {isArchive && <MenuItem value={'الكل'}>الكل</MenuItem>}
    //       {clinics && clinics?.map((item) => <MenuItem value={item?.name}>{item?.name}</MenuItem>)}
    //       {!clinics && <MenuItem value={100}>حدث خطأ، لا نوجد عيادات</MenuItem>}
    //     </Select>
    //   </FormControl>
    // </Box>
    <select
      value={chosenClinic}
      onChange={(e) => handleChange(e.target.value)}
      className="w-64 text-right text-sm text-mainText font-bold p-2 border-2 border-stone-400 rounded-lg outline-0 focus:border-mainBlue"
    >
      {isArchive && <option value={'الكل'}>الكل</option>}
      {!isArchive && <option value={''}>اختر عيادة</option>}

      {clinics?.map((item, index) => (
        <option key={index} value={item.name}>
          {item.name}
        </option>
      ))}
    </select>
  )
}
