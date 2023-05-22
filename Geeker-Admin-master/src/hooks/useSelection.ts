import { ref, computed } from "vue";

/**
 * @description 表格多选数据操作
 * @param {String} rowKey 当表格可以多选时，所指定的 id
 * */
export const useSelection = (rowKey: string = "id") => {
  const isSelected = ref<boolean>(false);
  const selectedList = ref<{ [key: string]: any }[]>([]);

  // 当前选中的所有 ids 数组
  const selectedListIds = computed((): string[] => {
    let ids: string[] = [];
    selectedList.value.forEach(item => ids.push(item[rowKey]));
    // console.log(selectedList.value); // 表格中的每一项Item
    // console.log(ids); // ['447616687754768472', '661233179731676372']
    return ids;
  });

  /**
   * @description 多选操作
   * @param {Array} rowArr 当前选择的所有数据
   * @return void
   */
  const selectionChange = (rowArr: { [key: string]: any }[]) => {
    // console.log(rowArr); // 点击表格中的每一条Item： (3)[Proxy(Object), Proxy(Object), Proxy(Object)]
    rowArr.length ? (isSelected.value = true) : (isSelected.value = false);
    selectedList.value = rowArr;
  };

  return {
    isSelected, // 是否点击了表格的复选框
    selectedList, // 选择的表格中的所有Item
    selectedListIds, // 选择的表格中每一项Item的Id
    selectionChange // Change事件
  };
};
