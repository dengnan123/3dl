import { getLocalUser } from '../../../helpers/storage';

export function getUser() {
  const data = getLocalUser();
  if (!data || JSON.stringify(data) === '{}') {
    return {
      success: false,
      errorCode: 400,
      data: null,
    };
  }
  return {
    success: true,
    errorCode: 200,
    data: getLocalUser(),
  };
}

export function logout() {
  return {
    errorCode: 200,
  };
}
