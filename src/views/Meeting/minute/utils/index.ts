/**
 * 边录边转后数据转换
 */
export const DataViewToUint8Array = (dataList: DataView[]): Uint8Array => {
  const arr = dataList.reduce((acc: number[], dataView: DataView) => {
    const bytes = new Uint8Array(dataView.buffer);
    return [...acc, ...Array.from(bytes)];
  }, []);
  const uint8Array = new Uint8Array(arr);
  return uint8Array;
};
