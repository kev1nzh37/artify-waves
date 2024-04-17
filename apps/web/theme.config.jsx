export default {
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Artify Waves',
    }
  },
  logo: <>
    <img src="/logo/logo.png" style={{ width: 40, height: 40, marginRight: 8 }} alt="" />
    <span>Artify Waves</span>
  </>,
  head: <>
    <link rel="icon" href="/logo/logo.svg" type="image/svg+xml"></link>
  </>,
  project: {
    link: "https://github.com/kev1nzh37/artify-waves",
  },
  gitTimestamp: null,
  feedback: {
    content: null,
  },
  // navigation: false,
  editLink: {
    component: null,
  },
  primaryHue: 1,  // 色调
  primarySaturation: 91,  // 饱和度
}
