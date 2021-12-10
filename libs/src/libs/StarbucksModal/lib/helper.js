const zhLocale = {
  BOOKING_SUCCESS: '预订成功',
  BOOKING_VISITOR_TEXT: '您好，',
  BOOKING_SUCCESS_TIPS: '请确认工位编号并核对桌面信息落座～',
  BOOKING_SUCCESS_OK: '好的',

  QUICKLY_BOOKING: '快速预订工位',
  SPACE_ID: '工位编号',
  BOOKING_TIME: '预定时段',
  WANT_BOOKING_LONGER: '我想预订更久？',
  WANT_BOOKING_PM_TIPS: '下午时段的工位将在午后开放预订哦',
  TEL_INPUT_TIPS: '请输入手机号验证身份',
  ERROR_CODE_EMPTY: '请输入：访客系统今天登记过的手机号',
  ERROR_CODE_MAX_LENGTH: '最大输入20个字符',
  BOOKING_ERROR_TIPS: '验证失败：请输入访客系统今天登记过的手机号',
  BOOKING_ERROR_TIPS_302: '预订失败：您已经预订了工位，不可重复预订',
  BOOKING_ERROR_TIPS_303: '预订失败：该工位已被预订',
  BOOKING_ERROR_TIPS_304: '预订失败：预订时间已过去，请重新预订',
  TIME_AM: '上午',
  TIME_PM: '下午',
  TIME_UNTIL: '至',
  INPUT_CONFIRM: '确认',
};

const enLocale = {
  BOOKING_SUCCESS: 'Booking Success',
  BOOKING_VISITOR_TEXT: 'Hi, ',
  BOOKING_SUCCESS_TIPS: 'Please check your DeskName and desktop information.',
  BOOKING_SUCCESS_OK: 'OK',

  QUICKLY_BOOKING: 'Book Desk',
  SPACE_ID: 'DeskName',
  BOOKING_TIME: 'Booking time',
  WANT_BOOKING_LONGER: 'Want to book longer? ',
  WANT_BOOKING_PM_TIPS: 'Reservations for the afternoon  will available after noon.',
  TEL_INPUT_TIPS: 'Enter your phone number to verify identity',
  ERROR_CODE_EMPTY: 'Please enter: the phone number registered by the visitor system today.',
  ERROR_CODE_MAX_LENGTH: 'Max. 20 characters',
  BOOKING_ERROR_TIPS:
    'Verification failed: Please enter the phone number registered by the visitor system today.',
  BOOKING_ERROR_TIPS_302: 'Booking failed: you have already booked Desk, no rebooking available',
  BOOKING_ERROR_TIPS_303: 'Booking failed: the desk has been booked',
  BOOKING_ERROR_TIPS_304: 'Booking failed: The reservation time has passed, please rebook.',
  TIME_AM: 'Morning',
  TIME_PM: 'Afternoon',
  TIME_UNTIL: 'until ',
  INPUT_CONFIRM: 'Confirm',
};

export function fillText(isZh, key) {
  if (isZh && zhLocale[key]) {
    return zhLocale[key];
  }
  if (!isZh && enLocale[key]) {
    return enLocale[key];
  }
  return key;
}
