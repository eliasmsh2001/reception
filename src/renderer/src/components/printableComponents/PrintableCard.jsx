import React from 'react'
import logo from '../../assets/images.jpg'

const PrintableCard = ({ contentRef, item }) => {
  return (
    <div className="flex flex-col gap-3 items-center" ref={contentRef}>
      <div className="w-full flex flex-col items-center justify-center border-b-4 pb-4 border-black">
        <img src={logo} className="size-24" alt="" />
        <h1 className="taxt-sm font-extrabold">وزارة الصحة</h1>
        <h1 className="taxt-sm font-extrabold">العيادة المجمعة زاوية الدهماني</h1>
      </div>

      <div className="flex justify-center items-center p-8 border-4 border-black text-4xl font-extrabold size-16">
        <h1>{item?.appointmentNum}</h1>
      </div>

      <div>
        {/* <div className="flex gap-3 items-center justify-center text-xs">
          <h1 className="text-stone-500 font-semibold">{item?.name ? item?.name : 'غير معروف'}</h1>
          <h1 className="text-mainText font-bold">:الاسم</h1>
        </div> */}
        <div className="flex gap-3 items-center justify-center text-xs">
          <h1 className="text-stone-500 font-semibold">
            {item?.clinicName ? item?.clinicName : 'غير معروف'}
          </h1>
          <h1 className="text-mainText font-bold">:العيادة</h1>
        </div>
        {/* <div className="flex gap-3 items-center justify-center text-xs">
          <h1 className="text-stone-500 font-semibold">
            {item?.doctorName ? item?.doctorName : 'غير معروف'}
          </h1>
          <h1 className="text-mainText font-bold">:الدكتور</h1>
        </div> */}
        <div className="flex gap-3 items-center justify-center text-xs">
          <h1 className="text-mainText font-semibold">
            {item?.day ? item?.day : ''}
            {'  --  '}
            {item?.date ? item?.date : ''}
            {'  --  '}
            {item?.time ? item?.time : ''}
          </h1>
        </div>
      </div>
    </div>
  )
}

export default PrintableCard
