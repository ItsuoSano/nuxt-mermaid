export default defineComponent({
  name: 'NuxtMermaid',
  props: {
    svgContent: {
      type: String,
      default: '',
    },
  },
  render({ svgContent }) {
    return h('div', { innerHTML: decodeURIComponent(svgContent) })
  },
})
