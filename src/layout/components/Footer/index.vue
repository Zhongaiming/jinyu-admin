<template>
  <div class="page-footer">
    <div class="page-footer-link">
      <a href="#" target="_blank"> {{ $t('guanWang') }} </a>
      <a href="#" target="_blank"> {{ $t('sheQu') }} </a>
      <a href="#" target="_blank"> {{ $t('jiaoLiu') }} </a>
    </div>
    <div class="copyright"> jinyu-admin 1.4 </div>
  </div>
</template>

<script>
  export default {
    name: 'PageFooter',
    components: {},
    props: {
      collapsed: {
        type: Boolean,
      },
    },
  };
</script>

<style lang="less" scoped>
  .page-footer {
    //margin: 28px 0 24px 0;
    padding: 0 16px;
    text-align: center;

    a {
      font-size: 14px;
      color: #808695;
      -webkit-transition: all 0.2s ease-in-out;
      transition: all 0.2s ease-in-out;

      &:hover {
        color: #515a6e;
      }
    }

    &-link {
      display: flex;
      justify-content: center;
      margin-bottom: 8px;

      a:not(:last-child) {
        margin-right: 40px;
      }
    }

    .copyright {
      color: #808695;
      font-size: 14px;
    }
  }
</style>
