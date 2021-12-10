export function fetchCompList(opts) {
  // return BOOKINGAPI.get(`/desk/buildingSearch`, { params: opts })
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove({
        errorCode: 200,
        data: {
          compList: [
            {
              styleData: {
                x: 150,
                y: 205,
                width: 500,
                height: 190,
              },
              compId: '1',
              compName: 'Test1',
            },
            {
              styleData: {
                x: 100,
                y: 100,
                width: 30,
                height: 30,
              },

              compId: '2',
              compName: 'Test2',
            },
            {
              styleData: {
                x: 200,
                y: 250,
                width: 50,
                height: 50,
              },
              compId: '3',
              compName: 'Test4',
            },
          ],
        },
      });
    }, 500);
  });
}
export function fetchUseCompList(opts) {
  // return BOOKINGAPI.get(`/desk/map`, { params: opts })
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove({
        errorCode: 200,
        data: {
          compList: [
            {
              styleData: {
                x: 150,
                y: 205,
                width: 500,
                height: 190,
              },
              compId: '1',
              compName: 'Test1',
            },
          ],
        },
      });
    }, 500);
  });
}
