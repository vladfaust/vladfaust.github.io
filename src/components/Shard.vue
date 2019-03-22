<template lang="pug">
  .shard
    a.name(:href="url") {{name}}
    .description
      slot(name="description")
</template>

<script>
  export default {
    props: {
      name: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }
  }
</script>

<style lang="sass" scoped>
  .shard
    height: 5rem
    padding: 1.5rem
    background-color: white
    border: 1px solid rgba(0, 0, 0, 0.05)
    border-radius: 4px

    transition: all 100ms ease-out

    &:hover
      transform: translateY(-2px)

    .description
      font-size: 1.05rem
</style>
