<template>
  <div class="editorContainer" ref="editor"></div>
</template>

<script>
import E from 'wangeditor'
export default {
  props: {
    value: {
      type: String
    }
  },
  methods: {
    initEditor() {
      const editor = new E(this.$refs.editor)
      editor.config.onchange = (newHtml) => {
        console.log('change 之后最新的 html', newHtml)
        this.$emit('input', newHtml)
      }
      editor.create()
      editor.txt.html(this.value)
      this.$watch('value', () => {
        editor.txt.html(this.value)
      })
    }
  },
  mounted() {
    console.log('传过来的数据为', this.value)
    this.initEditor()
  }
}
</script>