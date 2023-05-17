<template>
  <div :class="['editor-box', self_disabled ? 'editor-disabled' : '']">
    <Toolbar class="editor-toolbar" :editor="editorRef" :default-config="toolbarConfig" :mode="mode" v-if="!hideToolBar" />
    <Editor
      class="editor-content'"
      :style="{ height }"
      :mode="mode"
      v-model="valueHtml"
      :default-config="editorConfig"
      @on-created="handleCreated"
      @on-blur="handleBlur"
    />
  </div>
</template>

<script setup lang="ts" name="WangEditor">
import { nextTick, computed, inject, shallowRef, onBeforeUnmount } from "vue";
import { IToolbarConfig, IEditorConfig } from "@wangeditor/editor";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { uploadImg, uploadVideo } from "@/api/modules/upload";
import "@wangeditor/editor/dist/css/style.css";
import { ElMessage, formContextKey, formItemContextKey } from "element-plus";

// 富文本 DOM 元素  &&  只处理基本数据类型的响应式, 不进行对象的响应式处理
const editorRef = shallowRef();

// 实列化编辑器 && 创建富文本编辑器
const handleCreated = (editor: any) => {
  // console.log(editor); // TODO: 编辑器各种方法：{children: Array(1), operations: Array(0), selection: null, marks: null, isInline: ƒ, …}
  editorRef.value = editor;
};

// 接收父组件参数，并设置默认值
interface RichEditorProps {
  value: string; // 富文本值 ==> 必传
  toolbarConfig?: Partial<IToolbarConfig>; // 工具栏配置 ==> 非必传（默认为空）
  editorConfig?: Partial<IEditorConfig>; // 编辑器配置 ==> 非必传（默认为空）
  height?: string; // 富文本高度 ==> 非必传（默认为 500px）
  mode?: "default" | "simple"; // 富文本模式 ==> 非必传（默认为 default）
  hideToolBar?: boolean; // 是否隐藏工具栏 ==> 非必传（默认为false）
  disabled?: boolean; // 是否禁用编辑器 ==> 非必传（默认为false）
}
const props = withDefaults(defineProps<RichEditorProps>(), {
  toolbarConfig: () => {
    return {
      excludeKeys: []
    };
  },
  editorConfig: () => {
    return {
      placeholder: "请输入内容...",
      MENU_CONF: {}
    };
  },
  height: "500px",
  mode: "default",
  hideToolBar: false, // 是否展示工具栏
  disabled: false // 是否可编辑
});

// 获取 el-form 组件上下文
const formContext = inject(formContextKey, void 0); // TODO: 控制 ???
// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey, void 0);
// 判断是否禁用上传和删除
const self_disabled = computed(() => {
  return props.disabled || formContext?.disabled;
});
// 判断当前富文本编辑器是否禁用
if (self_disabled.value) nextTick(() => editorRef.value.disable());
// if (!self_disabled.value) nextTick(() => editorRef.value.disable()); // 取反：禁止使用工具栏与编辑器

// 富文本的内容监听，触发父组件改变，实现双向数据绑定
type EmitProps = {
  (e: "update:value", val: string): void;
  (e: "check-validate"): void;
};
const emit = defineEmits<EmitProps>();
// TODO: 计算 computed：get/set  &&  get获取父组件中 ref("S")
const valueHtml = computed({
  get() {
    return props.value;
  },
  set(val: string) {
    // console.log(editorRef.value.isEmpty()); // 文本域的值是否为空
    // 防止富文本内容为空时，校验失败
    if (editorRef.value.isEmpty()) val = "";
    console.log("富文本值：", val);
    emit("update:value", val);
  }
});

/**
 * @description 图片自定义上传
 * @param file 上传的文件
 * @param insertFn 上传成功后的回调函数（插入到富文本编辑器中）
 * */
type InsertFnTypeImg = (url: string, alt?: string, href?: string) => void;
const uploadImgValidate = (file: File): boolean => {
  console.log(file); // 上传文件数据：{name: 'admin.png',type: "image/png" size: 227518, lastModified: 16838466, lastModifiedDate: "", webkitRelativePath: '' …}
  return true;
};
props.editorConfig.MENU_CONF!["uploadImage"] = {
  // 配置：https://blog.csdn.net/qq_41397941/article/details/129112448
  // 小于该值就插入 base64 格式（而不上传），默认为 0
  base64LimitSize: 5 * 1024, // 5kb
  // 单个文件的最大体积限制，默认为 2M
  // maxFileSize: 1 * 1024 * 1024, // 1M
  // // 最多可上传几个文件，默认为 100
  // maxNumberOfFiles: 5,
  // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
  allowedFileTypes: ["image/*"],
  async customUpload(file: File, insertFn: InsertFnTypeImg) {
    if (!uploadImgValidate(file)) return; // 上传图片前校验文件
    let formData = new FormData();
    formData.append("file", file);
    try {
      // console.log("formData: ", formData.get("file")); // 可以获取到File文件
      const { data } = await uploadImg(formData);
      // console.log(data); // {fileUrl: 'https://i.imgtg.com/2023/01/16/QRqMK.jpg'}
      insertFn(data.fileUrl);
      ElMessage({
        type: "success",
        message: "上传附件成功！"
      });
    } catch (error) {
      console.log("上传错误", error);
    }
  }
};

/**
 * @description 视频自定义上传
 * @param file 上传的文件
 * @param insertFn 上传成功后的回调函数（插入到富文本编辑器中）
 * */
type InsertFnTypeVideo = (url: string, poster?: string) => void;
const uploadVideoValidate = (file: File): boolean => {
  console.log(file);
  return true;
};
// FIXME: 上传视频
// 一、 jianshu.com/p/1b589a287f1a
// 二、 https://blog.csdn.net/qq_41397941/article/details/129112448
// 三、 https://blog.csdn.net/weixin_47039061/article/details/127106307
props.editorConfig.MENU_CONF!["uploadVideo"] = {
  async customUpload(file: File, insertFn: InsertFnTypeVideo) {
    if (!uploadVideoValidate(file)) return; // 上传视频前校验文件
    let formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await uploadVideo(formData);
      insertFn(data.fileUrl);
    } catch (error) {
      console.log("上传视频错误：", error);
    }
  }
};

// 编辑框失去焦点时触发
const handleBlur = () => {
  formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
};

// TODO: 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  if (!editorRef.value) return;
  editorRef.value.destroy();
});

defineExpose({
  editor: editorRef
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
