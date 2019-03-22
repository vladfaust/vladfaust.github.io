<template lang="pug">
  .project
    a(:href="url")
      img.logo(:src="logo", :alt="title")
</template>

<script>
  export default {
    props: {
      url: {
        type: String,
        required: true
      },
      logo: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '@/assets/styles/mixins.sass'

  .project
    +center
    padding: 2rem

    a
      line-height: 0
      transition: all 100ms ease-out

      &:hover
        transform: translateY(-2px)

    .logo
      max-width: 15rem
      max-height: 4rem
</style>
