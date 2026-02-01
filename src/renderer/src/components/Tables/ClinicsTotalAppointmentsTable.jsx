import clsx from 'clsx'
import React from 'react'

const ClinicsTotalAppointmentsTable = ({ data, appointments }) => {
  const cellStyle = `text-sm font-semibold  border-l-2 border-black/35 px-2 py-1`
  return (
    <table dir="rtl" className=" rounded-xl border-2 border-mainBlue ">
      <thead>
        <tr className="bg-mainBlue text-white text-sm font-bold">
          <th className="w-72 py-1">العيادة</th>
          <th className="w-24 py-1">عدد المواعيد</th>
        </tr>
      </thead>
      <tbody>
        {data &&
          data?.length > 0 &&
          data?.map(
            (item, index) =>
              item?.appointments?.length > 0 && (
                <React.Fragment key={item.id}>
                  <tr
                    className={clsx('border-y-2 border-black/35 ', {
                      'bg-mainText/15 text-mainText': index % 2 === 0,
                      'bg-transparent text-mainText': index % 2 !== 0,
                      'bg-stone-600 text-white': item?.numberLimit === item?.appointments?.length
                    })}
                  >
                    <td className={`${cellStyle} w-72`}>{item?.name}</td>
                    <td className={`${cellStyle} w-24`}>
                      {item?.appointments?.length}{' '}
                      {item?.numberLimit ? `من ${item?.numberLimit}` : ''}
                    </td>
                  </tr>
                  {(data.indexOf(item) + 1) % 15 === 0 && <tr className="break-before-page" />}
                </React.Fragment>
              )
          )}
        {/* <tr className="bg-mainBlue">
          <td
            className={`text-sm font-semibold text-white border-l-2 border-black/35 px-2 py-1 w-72`}
          >
            إجمالي مواعيد الفترة
          </td>
          <td
            className={`text-sm font-semibold text-white border-l-2 border-black/35 px-2 py-1 w-24`}
          >
            {appointments?.length}
          </td>
        </tr> */}
      </tbody>
    </table>
  )
}

export default ClinicsTotalAppointmentsTable
