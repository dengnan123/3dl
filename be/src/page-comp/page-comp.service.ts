import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PageComp } from '../entities/PageComp';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository, getConnection } from 'typeorm';
import * as moment from 'dayjs';
import { uniqWith, isEqual } from 'lodash';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import * as fs from 'fs-extra'
import { isObject, isString, filterObj, isArray } from '../utils/type';
import { dealWithAddInfo, dealWithUpdateInfo, dealWithFindInfo } from './parse';
import { CompDataSourceService } from "./compDataSource.service"
import * as pLimit from 'p-limit'
const dbLimit = pLimit(20);
@Injectable()
export class PageCompService {
  constructor(
    @InjectRepository(PageComp)
    private readonly photoRepository: Repository<PageComp>,
    private compDataSourceService: CompDataSourceService
  ) { }


  async getAllInfo(condition) {
    const data = await this.photoRepository.find(condition);
    return data.map(v => {
      return dealWithFindInfo(v);
    });
  }

  async getAllInfoAWithDto(dto) {
    const condition = {
      where: {
        pageId: dto.pageId,
        status: 0,
      },
    };
    const list = await this.getAllInfo(condition);
    const findDataSourceIdByCompId = async (v) => {
      return await this.compDataSourceService.getDataSourceIdListByCompId(v.id)
    }
    const promissArr = list.map(async v => {
      const res = await dbLimit(findDataSourceIdByCompId, v)
      const dataSourceId = res?.length ? res.map(n => n.dataSourceId) : v.dataSourceId // 兼容老页面
      return {
        ...v,
        dataSourceId
      }
    })
    return await Promise.all(promissArr)
  }

  async getAllInfoIncludesPageWrap(dto) {
    const data = await this.getAllInfoAWithDto(dto)
    return this.generateTreeData(data);
  }

  // generateTreeData(queryData) {
  //   if (!queryData.length) {
  //     return []
  //   }
  //   const normalList = [];
  //   for (const v of queryData) {
  //     if (!v.groupId) {
  //       normalList.push(v);
  //     }
  //   }
  //   return normalList.map(v => {
  //     const { id } = v
  //     const child = this.getChildByGroupId(id, queryData);
  //     if (!child?.length) {
  //       return v
  //     }
  //     return {
  //       ...v,
  //       child
  //     }
  //   })
  // }
  generateTreeData(arr) {
    if (!arr) {
      return []
    }
    let map = arr.reduce((pre, next) => {
      return {
        ...pre,
        [next.id]: next,
      };
    }, {});
    let res = [];
    for (const v of arr) {
      const { groupId } = v;
      if (!groupId) {
        res.push(v);
      } else {
        const parent = map[groupId];
        if (parent) {
          parent.child = parent.child || [];
          parent.child.push(v);
        }
      }
    }
    return res
  }


  async getAllPageWrap(dto) {
    const data: any = await this.getAllInfo({
      where: {
        pageId: dto.pageId,
        compName: 'PageWrap',
        status: 0
      }
    });
    if (!data.length) {
      return {}
    }
    const promissArr = data.map(async v => {
      const { style } = v
      const wrapPageId = style?.pageId
      if (!wrapPageId) {
        return v
      }
      const pageWrapData = await this.getAllInfoAWithDto({
        pageId: wrapPageId
      })
      const child = this.generateTreeData(pageWrapData);
      return {
        ...v,
        child
      }
    })
    const list: any = await Promise.all(promissArr)
    let obj = {}
    for (const v of list) {
      const { id } = v
      obj[id] = v
    }
    return obj
  }


  async batchAdd(arr) {
    const newArr = this.dealWithBatchAddData(arr).map(v => {
      return {
        ...v,
        creatTime: moment().valueOf(),
      };
    });
    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(PageComp)
      .values(newArr)
      .execute();
  }


  async copyFile(arr, oldPageId) {
    // // 如果里面包含图片,处理静态文件,
    const promissArr = arr.map(async v => {
      const { compName, style, pageId } = v
      if (compName === 'Image') {
        const { filename } = style
        const basePath = path.resolve(__dirname, '../../../static/page');
        const oldPicNamePath = `${basePath}/${oldPageId}/${filename}`;
        const newPicNamePath = `${basePath}/${pageId}/${filename}`;
        if (fs.existsSync(oldPicNamePath)) {
          // 有的话 就复制
          fs.copySync(oldPicNamePath, newPicNamePath);
        }
      }

    })
    await Promise.all(promissArr)
  }

  async updateInfo(condition) {
    const toUpdate = await this.photoRepository.findOne({
      id: condition.id,
    });
    const updated = dealWithUpdateInfo(condition, toUpdate);

    const data = await this.photoRepository.save({
      ...updated,
      updateTime: moment().valueOf(),
    });
    return dealWithFindInfo(data);
  }

  async add(condition) {
    const addData = dealWithAddInfo(condition);
    const data = await this.photoRepository.save({
      ...addData,
      creatTime: moment().valueOf(),
    });
    return dealWithFindInfo(data);
  }

  async findOne(id) {
    const data: any = await this.photoRepository.findOne(id);
    return dealWithFindInfo(data);
  }

  dealWithDrapStopData(useCompList, data) {
    const dealWithChild = ({
      child,
      leftDiff,
      topDiff,
      widthDiff,
      heightDiff,
      groupId,
    }) => {
      return child.map(v => {
        const resData = {
          ...v,
          groupId,
          left: v.left + leftDiff,
          top: v.top + topDiff,
          width: v.width + widthDiff,
          height: v.height + heightDiff,
        };
        if (!v.child) {
          return resData;
        }
        const newChild = dealWithChild({
          child: v.child,
          leftDiff,
          topDiff,
          widthDiff,
          heightDiff,
          groupId: v.id,
        });
        resData.child = newChild;
        return resData;
      });
    };
    return useCompList.map(v => {
      const resData = {
        ...v,
        ...data,
      };
      const { child, oldLeft, oldTop, oldWidth, oldHeight } = v;
      if (child && child.length) {
        const leftDiff = data.left - oldLeft;
        const topDiff = data.top - oldTop;
        let widthDiff = 0;
        let heightDiff = 0;
        if (oldWidth) {
          widthDiff = data.width - oldWidth;
        }
        if (oldHeight) {
          heightDiff = data.height - oldHeight;
        }
        const newChild = dealWithChild({
          child,
          leftDiff,
          topDiff,
          widthDiff,
          heightDiff,
          groupId: v.id,
        });
        resData.child = newChild;
      }
      return resData;
    });
  }

  reductionArr(arr) {
    const dealWithChild = child => {
      if (!child || !child.length) {
        return [];
      }
      return child.reduce((pre, next) => {
        const { child: newChild, childComps } = next;
        if (newChild && newChild.length) {
          const list = dealWithChild(newChild);
          return [...pre, next, ...list];
        }
        return [...pre, next];
      }, []);
    };

    const newArr = arr.reduce((pre, next) => {
      const { child } = next;
      if (child && child.length) {
        const list = dealWithChild(child);
        return [...pre, next, ...list];
      }
      return [...pre, next];
    }, []);

    return newArr;
  }

  getChildByGroupId(id, list) {
    const hashObj = {};
    for (const value of list) {
      const { id: selfId, groupId } = value;
      hashObj[selfId] = groupId;
    }
    const getChild = id => {
      return list.reduce((pre, next) => {
        const { groupId } = next;
        if (groupId === id) {
          const data = {
            ...next,
          };
          const child = getChild(next.id);
          if (child && child.length) {
            data.child = child;
          }
          return [...pre, data];
        }
        return pre;
      }, []);
    };
    return getChild(id);
  }

  syncGroupId(arr) {
    const dealWithChild = child => {
      if (!child || !child.length) {
        return [];
      }
      return child.reduce((pre, next) => {
        const { child: newChild } = next;
        if (newChild && newChild.length) {
          const list = dealWithChild(newChild);
          next.child = list.map(v => {
            return {
              ...v,
              groupId: next.id,
            };
          });
          return [...pre, next];
        }
        return [...pre, next];
      }, []);
    };

    const newArr = arr.reduce((pre, next) => {
      const { child } = next;
      if (child && child.length) {
        const list = dealWithChild(child);
        next.child = list.map(v => {
          return {
            ...v,
            groupId: next.id,
          };
        });
        return [...pre, next];
      }
      return [...pre, next];
    }, []);

    return newArr;
  }

  dealWithBatchAddData(arr) {
    return arr.map(v => {
      const newValue = {
        ...v,
      };
      return dealWithAddInfo(newValue);
    });
  }
  async dealWithUpdateData(condition) {
    const toUpdate = await this.photoRepository.findOne({
      id: condition.id,
    });
    return dealWithUpdateInfo(condition, toUpdate);
  }

  async updateOrAddData(condition) {
    const toUpdate = await this.photoRepository.findOne({
      id: condition.id,
    });
    let newData;
    if (toUpdate) {
      newData = dealWithUpdateInfo(condition, toUpdate);
    } else {
      newData = dealWithAddInfo(condition);
    }
    const data = await this.photoRepository.save({
      ...newData,
      updateTime: moment().valueOf(),
    });
    return dealWithFindInfo(data);
  }

  dealWithAllData(queryData) {
    const groupList = [];
    const normalList = [];

    for (const v of queryData) {
      if ((v.compName === 'Group' || v.type === 'container') && !v.groupId) {
        groupList.push(v);
      }
      if (!v.groupId && v.type !== 'container' && v.compName !== 'Group') {
        normalList.push(v);
      }
    }

    const newGroupList = groupList.map(v => {
      const { id } = v;
      const child = this.getChildByGroupId(id, queryData);

      return {
        ...v,
        child,
      };
    });
    return [...newGroupList, ...normalList];
  }

  getHashDataByArr(arr) {
    const hashData = {};
    for (const v of arr) {
      const { id } = v;
      hashData[id] = v;
    }
    return hashData;
  }

  newGetChildByGroupId(id, list) {
    const hashObj = {};
    const delIdHash = {};
    for (const value of list) {
      const { id: selfId, groupId } = value;
      hashObj[selfId] = groupId;
    }
    const getChild = id => {
      return list.reduce((pre, next) => {
        const { groupId } = next;
        if (groupId === id) {
          const data = {
            ...next,
          };
          delIdHash[next.id] = 1;
          const child = getChild(next.id);
          if (child && child.length) {
            data.child = child;
          }
          return [...pre, data];
        }
        return pre;
      }, []);
    };
    return {
      child: getChild(id),
      delIdHash,
    };
  }

  // 处理预览页面的数据，除了容器组件，其他组件都扁平化展示，和编辑同页面的不同。编辑页面生成树状结构是为了成组的效果
  dealWithPreviewAllData(queryData) {
    let shouldDelIdHash = {};
    const res = queryData
      .map(v => {
        const { type, id } = v;
        if (type === 'container') {
          const { delIdHash, child } = this.newGetChildByGroupId(id, queryData);

          shouldDelIdHash = {
            ...shouldDelIdHash,
            ...delIdHash,
          };
          return {
            ...v,
            child,
          };
        }
        return v;
      })
      .filter(v => {
        if (v.compName === 'Group') {
          return false;
        }
        if (shouldDelIdHash[v.id]) {
          return false;
        }
        return true;
      });

    return uniqWith(res, isEqual);
  }


  dealWithCvData({ initUseCompList, id }) {
    let cvInfo: any = this.getClickInfoById(initUseCompList, id);
    if (!cvInfo) {
      return;
    }
    cvInfo.id = uuid();
    cvInfo.groupId = null;
    cvInfo.isClick = false;
    cvInfo.isHidden = 0;
    cvInfo.isLocking = 0;
    cvInfo.useDataType = 'JSON';
    cvInfo.dataSourceId = null
    // 获取当前zindex的最高值
    cvInfo.zIndex = this.getMaxZIndex(initUseCompList) + 1;
    let newArr = [];
    let updateArr = [];
    if (!cvInfo.child || !cvInfo.child.length) {
      newArr = [...initUseCompList, cvInfo];
      updateArr = [cvInfo];
    } else {
      const newDealWithChild = this.genereteNewIdArr(cvInfo.child);
      let newCvInfo = {
        ...cvInfo,
        child: newDealWithChild,
      };
      newArr = [...initUseCompList, newCvInfo];
      const _cvInfo = filterObj(newCvInfo, ['', undefined, null]);
      const dealWithArr = this.flatArrAndAddGroupId([_cvInfo]).map(v => {
        return filterObj(v, ['', undefined, null]);
      });
      updateArr = dealWithArr;
    }
    return {
      newArr,
      flatArr: updateArr,
    };
  };

  getMaxZIndex(arr) {
    let zIndex;
    for (const v of arr) {
      if (zIndex === undefined) {
        zIndex = v.zIndex;
      }
      if (v.zIndex > zIndex) {
        zIndex = v.zIndex;
      }
    }
    return zIndex;
  };

  genereteNewIdArr(arr) {
    const getChild = arr => {
      return arr.map((v, index) => {
        if (!v.child || !v.child.length) {
          return {
            ...v,
            id: uuid(),
          };
        }
        const _child = getChild(v.child);
        return {
          ...v,
          id: uuid(),
          child: _child,
        };
      });
    };

    return getChild(arr);
  };

  flatArrAndAddGroupId(arr) {
    const getChild = v => {
      const newInfo = {
        ...v,
      };
      delete newInfo.child;
      const { child } = v;
      const newChild = child.reduce((pre, next) => {
        if (!next.child || !next.child.length) {
          return [
            ...pre,
            {
              ...next,
              groupId: v.id,
            },
          ];
        }
        const _child = getChild(next);
        const newNext = {
          ...next,
          groupId: v.id,
        };
        delete newNext.child;
        return [...pre, ..._child, newNext];
      }, []);
      return newChild;
    };

    return arr.reduce((pre, next) => {
      if (!next.child || !next.child.length) {
        return [...pre, next];
      }
      const _child = getChild(next);
      const newNext = {
        ...next,
        groupId: null,
      };
      delete newNext.child;
      return [...pre, newNext, ..._child];
    }, []);
  };

  getClickInfoById(data, id) {
    let isSelectCompInfo = {};
    const deepArr = data => {
      for (let v of data) {
        if (v.id === id) {
          isSelectCompInfo = {
            ...v,
          };
          return;
        }
        const { child } = v;
        if (child && child.length) {
          deepArr(child);
        }
      }
    };
    deepArr(data);
    return isSelectCompInfo;
  };


  redashQuery({ redashUrl }) {

  }



}
