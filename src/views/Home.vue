<template lang="pug">
  #home
    section.hello
      .wrapper
        .img-wrapper
          img(src="/img/me.jpg")
        .text
          p Hello, my name is Vlad Faust.
          p
            | I'm a passionate developer with many years of experience. For the last two years I've been working on&nbsp;
            a(href="https://crystal-lang.org") Crystal
            |  ecosystem. I've chosen it because of its beauty, expressiveness and efficiency.
          p
            | You can follow me on&nbsp;
            a(href="https://github.com/vladfaust") GitHub
            |  and&nbsp;
            a(href="https://twitter.com/vladfaust") Twitter
            |  and send me e-mails to mail@vladfaust.com
    section.projects
      .wrapper
        .title Projects I've been actively working on:
        .list
          project(
            url="https://onyxframework.org"
            logo="/img/projects/onyx.svg"
            title="Onyx Framework"
          )
          project(
            url="https://worcr.com"
            logo="/img/projects/worcr.svg"
            title="Worcr"
          )
          project(
            url="https://crystaljobs.org"
            logo="/img/projects/crystaljobs.svg"
            title="Crystal Jobs"
          )
          project(
            url="https://github.com/vladfaust/crystalworld"
            logo="/img/projects/crystalworld.png"
            title="Crystal World"
          )
    section.shards
      .wrapper
        .title I also maintain a number of Crystal shards:
        .list
          shard(
            name="stripe.cr"
            url="https://github.com/vladfaust/stripe.cr"
          )
            p(slot="description")
              | A&nbsp;
              a(href="https://stripe.com") Stripe
              |  API wrapper
          shard(
            name="migrate.cr"
            url="https://github.com/vladfaust/migrate.cr"
          )
            p(slot="description") A database migration solution
          shard(
            name="http-params-serializable"
            url="https://github.com/vladfaust/http-params-serializable"
          )
            p(slot="description") An HTTP params parsing module
          shard(
            name="mini_redis"
            url="https://github.com/vladfaust/mini_redis"
          )
            p(slot="description") A light-weight Redis client
          shard(
            name="validations.cr"
            url="https://github.com/vladfaust/validations.cr"
          )
            p(slot="description") A validations mixin
          shard(
            name="callbacks.cr"
            url="https://github.com/vladfaust/callbacks.cr"
          )
            p(slot="description") An expressive callbacks module
          shard(
            name="cake-bake.cr"
            url="https://github.com/vladfaust/cake-bake.cr"
          )
            p(slot="description")
              | An utility shard to bake&nbsp;
              a(href="https://github.com/axvm/cake") Cakefile
              |  into binary
          shard(
            name="tarantool.cr"
            url="https://github.com/vladfaust/tarantool.cr"
          )
            p(slot="description")
              | A&nbsp;
              a(href="https://tarantool.io/") Tarantool
              |  database driver
          shard(
            name="http-multiserver.cr"
            url="https://github.com/vladfaust/http-multiserver.cr"
          )
            p(slot="description") An utility shard to map web applications
          shard(
            name="i18n.cr"
            url="https://github.com/vladfaust/i18n.cr"
          )
            p(slot="description") An internationalization shard
          shard(
            name="time_format.cr"
            url="https://github.com/vladfaust/time_format.cr"
          )
            p(slot="description") A shard to humanize time spans
    section.patrons
      .wrapper
        .title Thanks to all my patrons, I can continue working on Open-Source Software:
        ul
          li
            a(href="https://github.com/ljuti") Lauri Jutila
          li
            a(href="https://seendex.ru") Alexander Maslov
          li Dainel Vera
          li Anton Yordanov
        a.button(href="https://patreon.com/vladfaust")
          img(src="/img/patreon/button-rounded.svg")
</template>

<script>
  import Project from '@/components/Project.vue'
  import Shard from '@/components/Shard.vue'

  export default {
    components: {
      Project,
      Shard
    }
  }
</script>

<style lang="sass" scoped>
  @import '@/assets/styles/mixins.sass'

  section.hello
    .wrapper
      display: grid
      grid-column-gap: 2rem
      grid-template-columns: 1fr 2.25fr

      .img-wrapper
        +center

        img
          width: 100%
          border-radius: 4px

  section.projects
    .wrapper
      +center
      flex-direction: column

    .list
      display: grid
      grid-column-gap: 1px
      grid-row-gap: 1px
      grid-template-columns: repeat(2, 1fr)
      grid-template-rows: repeat(2, 1fr)

      margin-top: 1rem
      padding: 0

  section.shards
    .wrapper
      +center
      flex-direction: column

    .list
      display: grid
      grid-column-gap: 1rem
      grid-row-gap: 1rem
      grid-template-columns: repeat(3, 1fr)

      margin-top: 2.5rem

  section.patrons
    .wrapper
      +center
      flex-direction: column

    .button img
      height: 3rem
      transition: all 100ms ease-out

      &:hover
        transform: translateY(-2px)

    ul
      margin: 1.5rem 0
      padding: 0
      text-align: center
      list-style: none

      li
        display: block

        &:not(:first-of-type)
          margin-top: 0.25rem
</style>
