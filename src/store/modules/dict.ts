import { defineStore } from 'pinia';
export type DictState = {
  dict: any[]; //字典列表
};
export const useDictStore = defineStore('dict', {
  state: (): DictState => ({
    dict: [],
  }),
  actions: {
    // 获取字典
    getDict(_key: string | null) {
      if (_key == null && _key == '') {
        return null;
      }
      try {
        for (let i = 0; i < this.dict.length; i++) {
          if (this.dict[i].key == _key) {
            return this.dict[i].value;
          }
        }
      } catch (e) {
        return null;
      }
    },
    // 设置字典
    setDict(_key: string | null, value: any) {
      if (_key !== null && _key !== '') {
        this.dict.push({
          key: _key,
          value: value,
        });
      }
    },
    // 删除字典
    removeDict(_key: string | null) {
      let bln = false;
      try {
        for (let i = 0; i < this.dict.length; i++) {
          if (this.dict[i].key == _key) {
            this.dict.splice(i, 1);
            return true;
          }
        }
      } catch (e) {
        bln = false;
      }
      return bln;
    },
    // 清空字典
    cleanDict() {
      this.dict = [];
    },
    // 初始字典
    initDict() {},
  },
});
