<template>
  <div>
    <Editor v-model="content"/>
  </div>
</template>

<script>
import Editor from '@/components/Editor'
export default {
  components:{
    Editor
  },
  data(){
    return {
      content:'我是编辑器,我真牛逼！'
    }
  },
  methods:{
   
  }
}
</script>
