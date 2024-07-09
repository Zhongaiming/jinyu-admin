import type { App, Plugin, Component } from 'vue';
import { NIcon, NTag } from 'naive-ui';
import { PageEnum } from '@/enums/pageEnum';
import { isObject } from './is/index';
import { cloneDeep } from 'lodash-es';
import JSEncrypt from 'jsencrypt';
/**
 * render 图标
 * */
export function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}
/**
 * font 图标(Font class)
 * */
export function renderFontClassIcon(icon: string, iconName = 'iconfont') {
  return () => h('span', { class: [iconName, icon] });
}
/**
 * font 图标(Unicode)
 * */
export function renderUnicodeIcon(icon: string, iconName = 'iconfont') {
  return () => h('span', { class: [iconName], innerHTML: icon });
}
/**
 * font svg 图标
 * */
export function renderfontsvg(icon) {
  return () =>
    h(NIcon, null, {
      default: () =>
        h('svg', { class: `icon`, 'aria-hidden': 'true' }, h('use', { 'xlink:href': `#${icon}` })),
    });
}

/**
 * render new Tag
 * */
const newTagColors = { color: '#f90', textColor: '#fff', borderColor: '#f90' };
export function renderNew(type = 'warning', text = 'New', color: object = newTagColors) {
  return () =>
    h(
      NTag as any,
      {
        type,
        round: true,
        size: 'small',
        color,
      },
      { default: () => text }
    );
}

/**
 * 递归组装菜单格式
 */
export function generatorMenu(routerMap: Array<any>) {
  return filterRouter(routerMap).map((item) => {
    const isRoot = isRootRouter(item);
    const info = isRoot ? item.children[0] : item;
    const currentMenu = {
      ...info,
      ...info.meta,
      label: info.meta?.title,
      key: info.name,
      icon: isRoot ? item.meta?.icon : info.meta?.icon,
    };
    // 是否有子菜单，并递归处理
    if (info.children && info.children.length > 0) {
      // Recursion
      currentMenu.children = generatorMenu(info.children);
    }
    return currentMenu;
  });
}

/**
 * 混合菜单
 * */
export function generatorMenuMix(routerMap: Array<any>, routerName: string, location: string) {
  const cloneRouterMap = cloneDeep(routerMap);
  const newRouter = filterRouter(cloneRouterMap);
  if (location === 'header') {
    const firstRouter: any[] = [];
    newRouter.forEach((item) => {
      const isRoot = isRootRouter(item);
      const info = isRoot ? item.children[0] : item;
      info.children = undefined;
      const currentMenu = {
        ...info,
        ...info.meta,
        label: info.meta?.title,
        key: info.name,
      };
      firstRouter.push(currentMenu);
    });
    return firstRouter;
  } else {
    return getChildrenRouter(newRouter.filter((item) => item.name === routerName)[0]?.children);
  }
}

/**
 * 递归组装子菜单
 * */
export function getChildrenRouter(routerMap: Array<any>) {
  return filterRouter(routerMap).map((item) => {
    const isRoot = isRootRouter(item);
    const info = isRoot ? item.children[0] : item;
    const currentMenu = {
      ...info,
      ...info.meta,
      label: info.meta?.title,
      key: info.name,
    };
    // 是否有子菜单，并递归处理
    if (info.children && info.children.length > 0) {
      // Recursion
      currentMenu.children = getChildrenRouter(info.children);
    }
    return currentMenu;
  });
}

/**
 * 判断根路由 Router
 * */
export function isRootRouter(item) {
  return (
    item.meta?.alwaysShow != true &&
    item?.children?.filter((item) => !Boolean(item?.meta?.hidden))?.length === 1
  );
}

/**
 * 排除Router
 * */
export function filterRouter(routerMap: Array<any>) {
  if (!routerMap) return [];
  return routerMap.filter((item) => {
    return (
      (item.meta?.hidden || false) != true &&
      ![
        '/:path(.*)*',
        '/',
        PageEnum.REDIRECT,
        PageEnum.BASE_LOGIN,
        PageEnum.UNIFIED_LOGIN,
      ].includes(item.path)
    );
  });
}

export const withInstall = <T extends Component>(component: T, alias?: string) => {
  const comp = component as any;
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component as T & Plugin;
};

/**
 *  找到对应的节点
 * */
let result = null;
export function getTreeItem(data: any[], key?: string | number): any {
  data.map((item) => {
    if (item.key === key) {
      result = item;
    } else {
      if (item.children && item.children.length) {
        getTreeItem(item.children, key);
      }
    }
  });
  return result;
}

/**
 *  找到所有节点
 * */
const treeAll: any[] = [];
export function getTreeAll(data: any[]): any[] {
  data.map((item) => {
    treeAll.push(item.key);
    if (item.children && item.children.length) {
      getTreeAll(item.children);
    }
  });
  return treeAll;
}

// dynamic use hook props
export function getDynamicProps<T extends {}, U>(props: T): Partial<U> {
  const ret: Recordable = {};

  Object.keys(props).map((key) => {
    ret[key] = unref((props as Recordable)[key]);
  });

  return ret as Partial<U>;
}

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

/**
 * Sums the passed percentage to the R, G or B of a HEX color
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed part of the color
 */
function addLight(color: string, amount: number) {
  const cc = parseInt(color, 16) + amount;
  const c = cc > 255 ? 255 : cc;
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`;
}

/**
 * Lightens a 6 char HEX color according to the passed percentage
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed color represented as HEX
 */
export function lighten(color: string, amount: number) {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color;
  amount = Math.trunc((255 * amount) / 100);
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount
  )}${addLight(color.substring(4, 6), amount)}`;
}

/**
 * 判断是否 url
 * */
export function isUrl(url: string) {
  return /^(http|https):\/\//g.test(url);
}

/**
 * 密码加密
 * @param {*} value 要加密的字符串
 */
const publicKey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCpC4QMnbTrQOFriJJCCFFWhlruBJThAEBfRk7pRx1jsAhyNVL3CqJb0tRvpnbCnJhrRAEPdgFHXv5A0RrvFp+5Cw7QoFH6O9rKB8+0H7+aVQeKITMUHf/XMXioymw6Iq4QfWd8RhdtM1KM6eGTy8aU7SO2s69Mc1LXefg/x3yw6wIDAQAB';
export function encrypt(value: string) {
  if (value == null || value === '') return null;
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  return encodeURIComponent(encrypt.encrypt(value));
}

/**
 * 列表数据转换树形数据
 * @param {Array} data 要转换的列表
 * @param {String} id 主键字段字段名
 * @param {String} pid 父字段字段名
 * @returns {Array} 转换后的树数据
 */
export function treeDataTranslate(data, id = 'id', pid = 'parentId', sort?) {
  const res: any = [];
  const temp = {};
  for (let i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i];
  }
  for (let k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = [];
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1;
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1;
      data[k]['_parent'] = data[k][pid];
      data[k]['_index'] = temp[data[k][pid]].children.length + 1;
      if (temp[data[k][pid]]['_index']) {
        data[k]['_index'] = temp[data[k][pid]]._index + '.' + data[k]['_index'];
      }

      temp[data[k][pid]]['children'].push(data[k]);
      if (sort) {
        temp[data[k][pid]]['children'].sort((a, b) => {
          return a[sort] - b[sort];
        });
      }
    } else {
      data[k]['_index'] = res.length + 1;
      res.push(data[k]);
      if (sort) {
        res.sort((a, b) => {
          return a[sort] - b[sort];
        });
      }
    }
  }
  return res;
}

/**
 * 删除之后返回第几页并更新
 * @param {number} totalNum  列表总页数
 * @param {String} reduceNum 减少数量
 * @param {String} pageNum 当前页
 * @param {String} pageSize 每页容量
 * @returns {number} 最终当前页数
 */

export function getCurrentPage(actionRef, reduceNum) {
  const action = actionRef.value;
  const currentTotal = action.pagination.itemCount - reduceNum;
  const pageNum = action.pagination.pageNum;
  const pageSize = action.pagination.pageSize;
  const totalPage = parseInt(currentTotal / pageSize);
  if (pageNum < totalPage) {
    return totalPage;
  } else if (pageNum == totalPage) {
    if (currentTotal % pageSize == 0) {
      return action.updatePage(pageNum - 1);
    } else {
      return action.updatePage(pageNum);
    }
  } else {
    return action.updatePage(pageNum);
  }
}

/**
 * 数组对象去重
 * @param {Array} sorter  数组
 * @returns {Array} 去重后数组
 */
export function uniqueObjects(arr) {
  const uniqueMap = new Map();
  return arr.filter((item) => {
    const key = JSON.stringify(item);
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, true);
      return true;
    }
    return false;
  });
}

/**
 * 选人选部门弹窗确定返回字符串
 * @param {Array} json 数据json
 * @param {Array} selectList 选人选部门选择数据
 * @returns {string} 合并后数组并转换为字符串
 */

export function selectModalOkStr(json, selectList) {
  const jsonObj = json && JSON.parse(json);
  if (jsonObj) {
    return unref(JSON.stringify(uniqueObjects([...jsonObj, ...selectList])));
  } else {
    return unref(JSON.stringify(uniqueObjects([...selectList])));
  }
}

/**
 * 选人选部门弹窗关闭返回字符串
 * @param {Array} json 数据json
 *  @param {Array} data 数据删除项
 * @returns {string} 合并后数组并转换为字符串
 */

export function selectModalCloseStr(json, data) {
  return unref(
    JSON.stringify(json && JSON.parse(json).filter((item) => item.value !== data.value))
  );
}

/*
 * 判断rgb,rgba,hex
 * @param {string} colorStr 传入颜色
 * @returns {string} 返回的类型
 */

export function getColorType(colorStr) {
  const hexRegex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
  const rgbRegex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
  const rgbaRegex = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*([0-9]*\.?[0-9]+)\)$/;

  if (hexRegex.test(colorStr)) {
    return 'hex';
  } else if (rgbRegex.test(colorStr)) {
    return 'rgb';
  } else if (rgbaRegex.test(colorStr)) {
    return 'rgba';
  } else {
    return null;
  }
}

/*
 * hex 转 rgba
 * @param {string} hexValue 颜色
 * @param {number} opc 透明度
 * @returns {string} 返回的rgba
 */
export function hexToRgba(hexValue, opc) {
  const rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const hex = hexValue.replace(rgx, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!rgb) {
    return hexValue;
  }
  const r = parseInt(rgb[1], 16);
  const g = parseInt(rgb[2], 16);
  const b = parseInt(rgb[3], 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + opc + ')';
}
/*
 * rgb 转 rgba
 * @param {rgbString} rgb 颜色
 * @param {number} alpha 透明度
 * @returns {string} 返回的rgba
 */

export function rgbStringToRgba(rgbString, alpha) {
  // 用正则表达式提取RGB值
  const rgbValues = rgbString.match(/\d+/g);

  if (!rgbValues || rgbValues.length !== 3) {
    console.error('Invalid RGB string format. Please provide a valid RGB string.');
    return;
  }

  // 转换提取的数字为整数，并确保在0到255范围内
  const red = Math.max(0, Math.min(255, parseInt(rgbValues[0])));
  const green = Math.max(0, Math.min(255, parseInt(rgbValues[1])));
  const blue = Math.max(0, Math.min(255, parseInt(rgbValues[2])));

  // 确保透明度值在0到1范围内
  alpha = Math.max(0, Math.min(1, alpha));

  // 返回RGBA字符串
  return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')';
}

/*
 * 电话号码隐藏中间
 * @param {string} tel 手机号码
 * @returns {string} 返回的替换后的手机号码
 */
export function geTel(tel) {
  const reg = /^(\d{3})\d{4}(\d{4})$/;
  return tel.replace(reg, '$1****$2');
}

/*
 * submitSchemas数组源数组转换
 * @param {array} dataSource 数据源
 * @param {array} changes 变化参数
 * @returns {array} 转换后数组
 */

export function transformDataSource(dataSource, changes) {
  return dataSource.value.map((item) => {
    const changedItem = changes.find((change) => change.key === item.field);
    if (changedItem) {
      changedItem.values.forEach((changeObj) => {
        const keys = changeObj.changeKey.split('.');
        let target = item;
        for (let i = 0; i < keys.length - 1; i++) {
          target = target[keys[i]];
        }
        target[keys[keys.length - 1]] = changeObj.changeValue;
      });
    }
    return item;
  });
}
