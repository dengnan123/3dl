import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { v4 as uuid } from 'uuid';
import * as moment from 'dayjs';
import { ThemeColor } from '../entities/ThemeColor';
import { ThemeConfig } from '../entities/ThemeConfig';
import { dealWithAddInfo, dealWithUpdateInfo, dealWithFindInfo } from './parse';
import { strToObj, objToStr } from '../utils/type';

@Injectable()
export class ThemeService {
  constructor(
    @InjectRepository(ThemeColor)
    private readonly photoRepository: Repository<ThemeColor>,

    @InjectRepository(ThemeConfig)
    private readonly themeConfigRepository: Repository<ThemeConfig>,
  ) {}

  async getAllInfo(condition) {
    const data = await this.photoRepository.find(condition);
    return data.map(v => {
      return dealWithFindInfo(v);
    });
  }

  async batchAdd(arr) {
    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(ThemeColor)
      .values(arr)
      .execute();
  }

  async updateInfo(condition) {
    const toUpdate = await this.photoRepository.findOne({
      id: condition.id,
    });
    const updated = dealWithUpdateInfo(condition, toUpdate);
    const data = await this.photoRepository.save(updated);
    return dealWithFindInfo(data);
  }

  async add(condition) {
    const time = moment().valueOf();
    const newId = uuid();
    const addData = {
      ...condition,
      creatTime: time,
      updateTime: time,
      id: newId,
    };
    const newAddData = dealWithAddInfo(addData);
    return await this.photoRepository.save(newAddData);
  }

  async findOne(id) {
    const data: any = await this.photoRepository.findOne(id);
    return dealWithFindInfo(data);
  }

  // theme config

  async getThemeConfigAllInfo(condition) {
    const data = await this.themeConfigRepository.find(condition);
    return data.map(v => {
      return {
        ...v,
        style: strToObj(v.style),
        mockData: strToObj(v.mockData),
      };
    });
  }

  async batchAddThemeConfig(arr) {
    const newArr = arr.map(v => {
      return {
        ...v,
        style: objToStr(v.style),
      };
    });
    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(ThemeConfig)
      .values(newArr)
      .execute();
  }

  async updateThemeConfigInfo(condition) {
    const toUpdate = await this.themeConfigRepository.findOne({
      id: condition.id,
    });
    const updated = Object.assign({}, toUpdate, {
      ...condition,
      style: objToStr(condition.style),
      mockData: objToStr(condition.mockData),
    });
    const data = await this.themeConfigRepository.save(updated);
    return {
      ...data,
      style: strToObj(condition.style),
      mockData: strToObj(condition.mockData),
    };
  }

  async addThemeConfig(condition) {
    const time = moment().valueOf();
    const newId = uuid();
    const addData = {
      ...condition,
      creatTime: time,
      updateTime: time,
      id: newId,
    };
    const newAddData = {
      ...addData,
      style: objToStr(condition.style),
      mockData: objToStr(condition.mockData),
    };
    return await this.themeConfigRepository.save(newAddData);
  }

  async findOneThemeConfig(id) {
    const data: any = await this.themeConfigRepository.findOne(id);
    return {
      ...data,
      style: strToObj(data.style),
      mockData: strToObj(data.mockData),
    };
  }
  async findOneByParamsThemeConfig(inputData) {
    const data: any = await this.themeConfigRepository.findOne(inputData);
    return {
      ...data,
      style: strToObj(data.style),
      mockData: strToObj(data.mockData),
    };
  }
}
