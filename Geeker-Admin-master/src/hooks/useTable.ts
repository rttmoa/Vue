import { Table } from "./interface";
import { reactive, computed, toRefs } from "vue";

/**
 * @description table 页面操作方法封装
 * @param {Function} api 获取表格数据 api 方法 (必传)
 * @param {Object} initParam 获取数据初始化参数 (非必传，默认为{})
 * @param {Boolean} isPageable 是否有分页 (非必传，默认为true)
 * @param {Function} dataCallBack 对后台返回的数据进行处理的方法 (非必传)
 * */
export const useTable = (
  api: (params: any) => Promise<any> | any,
  initParam: object = {},
  isPageable: boolean = true,
  dataCallBack?: (data: any) => any,
  requestError?: (error: any) => void
) => {
  const state = reactive<Table.TableStateProps>({
    // 表格数据 / 分页数据 / 查询参数 / 初始化参数 / 总参数
    // 表格数据
    tableData: [],
    // 分页数据
    pageable: {
      // 当前页数
      pageNum: 1,
      // 每页显示条数
      pageSize: 25, // 10 / 25 / 50 / 100
      // 总条数
      total: 0
    },
    // 查询参数(只包括查询)
    searchParam: {},
    // 初始化默认的查询参数
    searchInitParam: {},
    // 总参数(包含分页和查询参数)
    totalParam: {}
  });

  /**
   * @description 分页查询参数(只包括分页和表格字段排序,其他排序方式可自行配置)
   * */
  const pageParam = computed({
    get: () => {
      return {
        pageNum: state.pageable.pageNum,
        pageSize: state.pageable.pageSize
      };
    },
    set: (newVal: any) => {
      console.log("我是分页更新之后的值", newVal);
    }
  });

  /**
   * @description 获取表格数据
   * @return void
   * */
  const getTableList = async () => {
    try {
      // 先把初始化参数和分页参数放到总参数里面
      Object.assign(state.totalParam, initParam, isPageable ? pageParam.value : {}); // state.totalParams: {pageNum: 1, pageSize: 25, type: 1}
      let { data } = await api({ ...state.searchInitParam, ...state.totalParam });
      // data: {list: (25) […], pageNum:1, pageSize: 25, total: 2000}
      // debugger;
      dataCallBack && (data = dataCallBack(data));
      state.tableData = isPageable ? data.list : data;
      // 解构后台返回的分页数据 (如果有分页更新分页信息)
      const { pageNum, pageSize, total } = data;
      isPageable && updatePageable({ pageNum, pageSize, total });
    } catch (error) {
      requestError && requestError(error);
    }
  };

  /**
   * @description 更新查询参数
   * @return void
   * */
  const updatedTotalParam = () => {
    state.totalParam = {};
    // 处理查询参数，可以给查询参数加自定义前缀操作
    let nowSearchParam: { [key: string]: any } = {};
    // 防止手动清空输入框携带参数（这里可以自定义查询参数前缀）
    // console.log(state.searchParam);
    for (let key in state.searchParam) {
      // * 某些情况下参数为 false/0 也应该携带参数
      if (state.searchParam[key] || state.searchParam[key] === false || state.searchParam[key] === 0) {
        nowSearchParam[key] = state.searchParam[key];
      }
    }
    Object.assign(state.totalParam, nowSearchParam, isPageable ? pageParam.value : {});
    // 后面的参数赋值给state.totalParams:
    // state.totalParams: {age: "29",gender: 2,idCard: "230105235234234",pageNum: 1,pageSize: 25,status: 1,username: "zhangsan",createTime: (2) ['2022-12-05 00:00:00', '2022-12-14 00:00:00']}
    // debugger;
  };

  /**
   * @description 更新分页信息
   * @param {Object} resPageable 后台返回的分页数据
   * @return void
   * */
  const updatePageable = (resPageable: Table.Pageable) => {
    // console.log(resPageable); // {pageNum: 7, pageSize: 25, total: 2000}
    Object.assign(state.pageable, resPageable); // 将后台中的data赋值给state中pageable
  };

  /**
   * @description 表格数据查询
   * @return void
   * */
  const search = () => {
    state.pageable.pageNum = 1;
    updatedTotalParam();
    getTableList();
  };

  /**
   * @description 表格数据重置
   * @return void
   * */
  const reset = () => {
    state.pageable.pageNum = 1;
    state.searchParam = {};
    // 重置搜索表单的时，如果有默认搜索参数，则重置默认的搜索参数
    Object.keys(state.searchInitParam).forEach(key => {
      state.searchParam[key] = state.searchInitParam[key];
    });
    updatedTotalParam();
    getTableList();
  };

  /**
   * @description 每页条数改变
   * @param {Number} val 当前条数
   * @return void
   * */
  const handleSizeChange = (val: number) => {
    state.pageable.pageNum = 1;
    state.pageable.pageSize = val;
    getTableList();
  };

  /**
   * @description 当前页改变
   * @param {Number} val 当前页
   * @return void
   * */
  const handleCurrentChange = (val: number) => {
    state.pageable.pageNum = val;
    getTableList();
  };

  // 返回的参数：
  return {
    ...toRefs(state), //  表格数据 / 分页数据 / 查询参数 / 初始化参数 / 总参数
    getTableList, //      配置state参数  /  获取表格数据
    search, //            配置查询参数 / 重新获取表格数据
    reset, //             初始化查询参数 / 重新获取表格数据
    handleSizeChange, //  配置分页每页页码 / 重新获取表格数据
    handleCurrentChange, // 配置跳转的页面 / 重新获取表格数据
    updatedTotalParam //  只做更新查询参数
  };
};
