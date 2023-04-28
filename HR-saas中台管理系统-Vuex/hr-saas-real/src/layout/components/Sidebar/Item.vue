<!-- <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="$t('route.' + onlyOneChild.name)" /> -->
<script>
  export default {
    name: 'MenuItem',
    functional: true,
    props: {
      icon: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      }
    },
    render(h, context) {
      // console.log(context) // FunctionalRenderContext {data: {…}, props: {…}, children: undefined, parent: VueComponent, listeners: {…}, …}
      const { icon, title } = context.props;
      const vnodes = []

      if (icon) {
        if (icon.includes('el-icon')) {
          vnodes.push(<i class={[icon, 'sub-el-icon']} />)
        } else {
          vnodes.push(<svg-icon icon-class={icon}/>)
        }
      }

      if (title) {
        vnodes.push(<span slot='title'>{(title)}</span>)
      }
      return vnodes
    }
  }
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
