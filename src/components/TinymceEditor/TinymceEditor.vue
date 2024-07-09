<template>
  <div :id="data.tinymceId" class="tinymce-editor min-h-max" v-dompurify-html="data.content"></div>
</template>

<script setup lang="ts">
  import { uploadFilePublic } from '@/api/Public';
  import { useGlobSetting } from '@/hooks/setting';
  declare let window: any;
  defineOptions({
    name: 'TinymceEditor',
  });
  const props = defineProps({
    value: {
      type: String,
    },
    config: {
      type: Object,
      default: () => {},
    },
    defaultValue: {
      type: String,
    },
  });
  const { fileUrl } = useGlobSetting();

  const emits = defineEmits(['update:value']);
  const data = reactive({
    tinymceId: 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + ''),
    src: '/lib/tinymce/tinymce.min.js',
    content: '',
    defaultConfigs: {
      base_url: '/lib/tinymce',
      auto_focus: true,
      height: '100%',
      menubar: false,
      elementpath: false,
      icons: 'custom',
      toolbar_mode: 'wrap',
      toolbar_sticky: false,
      inline: false,
      statusbar: false,
      plugins: [
        'hr advlist autolink lists insertdatetime pagebreak preview quickbars searchreplace importword powerpaste table image',
      ],
      branding: false,
      powerpaste_word_import: 'propmt',
      powerpaste_html_import: 'propmt',
      powerpaste_allow_local_images: true,
      powerpaste_keep_unsupported_src: true,
      paste_merge_formats: true,
      toolbar:
        'fontselect fontsizeselect lineheight bold italic underline strikethrough alignleft aligncenter alignright alignjustify forecolor backcolor numlist bullist outdent indent image table hr link unlink blockquote searchreplace undo redo',
      font_formats:
        '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;知乎配置=BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;小米配置=Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif',
      fontsize_formats:
        '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 12px 14px 16px 18px 24px 36px 48px 56px 72px',
      line_height_formats: '1 1.2 1.4 1.6 2',
      quickbars_insert_toolbar: '',
      with_credentials: true,
      content_style: 'body { z-index: 0 };img {max-width:100%;}',
      language: 'zh_CN',
      paste_data_images: true,
      placeholder: '请输入内容',
      setup: (editor) => {
        editor.on('Change', () => {
          emits('update:value', editor.getContent());
        });
      },
    },
  });
  watch(
    () => props.defaultValue,
    (newValue) => {
      const tinymce = window.tinymce && window.tinymce.get(data.tinymceId);
      if (tinymce) {
        tinymce.setContent(newValue);
      }
      data.content = props.defaultValue || '';
    },
    { immediate: true }
  );
  function handleImageUpload(blobInfo, success, failure) {
    uploadFilePublic({
      file: blobInfo.blob(),
      filename: blobInfo.filename(),
      asImage: true,
    })
      .then((res) => {
        if (res.data.success) {
          success(fileUrl + res.data.data.downloadUri);
        } else {
          failure('Upload failed:' + res.data.errorMessage);
        }
      })
      .catch((error) => {
        failure('Upload failed:' + error.errorMessage);
      });
  }
  function dynamicLoadScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.id = src;
    document.body.appendChild(script);
    script.onload = () => {
      initTinymce();
    };
  }
  const configs = computed(() => ({ ...data.defaultConfigs, ...props.config }));

  function initTinymce() {
    window.tinymce.init({
      ...configs.value,
      selector: `#${data.tinymceId}`,
      images_upload_handler: handleImageUpload,
    });
  }
  onMounted(() => {
    dynamicLoadScript(data.src);
  });
</script>
<style lang="less"></style>
