<template>
  <n-layout>
    <div class="view-account">
      <div class="view-account-title"></div>
      <div class="view-account-person"></div>
      <div class="view-account-container">
        <div class="view-account-main">
          <div class="view-account-form">
            <n-form ref="formRef" label-placement="left" size="large" :model="formInline" :rules="rules">
              <n-form-item path="loginName">
                <n-input v-model:value="formInline.loginName" placeholder="请输入用户名">
                  <template #prefix>
                    <n-icon size="18" color="#808695">
                      <PersonOutline />
                    </n-icon>
                  </template>
                </n-input>
              </n-form-item>
              <n-form-item path="password">
                <n-input v-model:value="formInline.password" type="password" showPasswordOn="click" placeholder="请输入密码">
                  <template #prefix>
                    <n-icon size="18" color="#808695">
                      <LockClosedOutline />
                    </n-icon>
                  </template>
                </n-input>
              </n-form-item>
              <n-form-item>
                <div @click="handleSubmit" class="primary-button">
                  <div class="primary-button-text"></div>
                </div>
              </n-form-item>
            </n-form>
          </div>
        </div>
      </div>
    </div>
  </n-layout>
</template>

<script lang="ts" setup>
import { encrypt } from '@/utils';
import { strTrim } from '@/utils/check';
import { useUserStore } from '@/store/modules/user';
import { useMessage } from 'naive-ui';
import { ResultEnum } from '@/enums/httpEnum';
import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5';
import { PageEnum } from '@/enums/pageEnum';
// import { websiteConfig } from '@/config/website.config';
interface FormState {
  loginName: string;
  password: string | null;
}

const formRef = ref();
const message = useMessage();
const loading = ref(false);
// const autoLogin = ref(true);
const LOGIN_NAME = PageEnum.BASE_LOGIN_NAME;

const formInline = reactive({
  loginName: '',
  password: '',
  isCaptcha: true,
});

const rules = {
  loginName: { required: true, message: '请输入用户名', trigger: 'blur' },
  password: { required: true, message: '请输入密码', trigger: 'blur' },
};

const userStore = useUserStore();

const router = useRouter();
const route = useRoute();
const handleSubmit = (e) => {
  e.preventDefault();
  formRef.value.validate(async (errors) => {
    if (!errors) {
      const { loginName, password } = formInline;
      message.loading('登录中...');
      loading.value = true;

      const params: FormState = {
        loginName,
        password: encrypt(strTrim(password)),
      };

      try {
        const { code, message: msg } = await userStore.login(params);
        message.destroyAll();
        if (code == ResultEnum.SUCCESS) {
          const toPath = decodeURIComponent((route.query?.redirect || '/') as string);
          message.success('登录成功，即将进入系统');
          if (route.name === LOGIN_NAME) {
            // router.replace('/');
            if (userStore.currentApp?.menu?.length > 0) {
              router.replace(userStore.currentApp.menu[0].path);
            } else {
              router.replace('/');
            }
          } else router.replace(toPath);
        } else {
          message.info(msg || '登录失败');
        }
      } finally {
        loading.value = false;
      }
    } else {
      message.error('请填写完整信息，并且进行验证码校验');
    }
  });
};
</script>

<style lang="less" scoped>
.view-account {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  overflow: auto;
  background-color: var(--n-color);
  position: relative;

  .view-account-person {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }

  .view-account-title {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }

  @media (min-width: 1500px) {
    &-container {
      width: 1484.8px;
      height: 825.6px;
      overflow: hidden;
      background-image: url('@/assets/ztImages/loginEnterBg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }

    &-person {
      background-image: url('@/assets/ztImages/loginPerson.png');
      background-repeat: no-repeat;
      background-size: auto 120%;
      background-position: right -12% bottom 50%;
    }

    &-title {
      background-image: url('@/assets/ztImages/loginTitle.png');
      background-repeat: no-repeat;
      background-position: left 3% top 3%;
    }

    .primary-button {
      width: 100%;
      height: 52px;
      margin-top: 12%;

      &-text {
        width: 92.8px;
        height: 42.4px;
      }
    }
  }

  @media (min-width: 1195px) and (max-width: 1500px) {
    &-container {
      width: 1187.84px;
      height: 660.48px;
      overflow: hidden;
      background-image: url('@/assets/ztImages/loginEnterBg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }

    &-person {
      background-image: url('@/assets/ztImages/loginPerson.png');
      background-repeat: no-repeat;
      background-size: auto 120%;
      background-position: right -60% bottom 50%;
    }

    .primary-button {
      width: 100%;
      height: 42px;
      margin-top: 12%;

      &-text {
        width: 69.6px;
        height: 31.8px;
      }
    }
  }

  @media (max-width: 1195px) {
    &-container {
      width: 831.488px;
      height: 462.336px;
      overflow: hidden;
      background-image: url('@/assets/ztImages/loginEnterBg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }

    .primary-button {
      width: 100%;
      height: 38px;
      margin-top: 3%;

      &-text {
        width: 58px;
        height: 26.5px;
      }
    }
  }

  &-main {
    padding: 22% 45% 8% 18%;
  }

  &-other {
    width: 100%;
  }

  .primary-button {
    background-image: url('@/assets/ztImages/loginBtn.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    &-text {
      background-image: url('@/assets/ztImages/loginTxt.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }

  .default-color {
    color: #515a6e;

    .ant-checkbox-wrapper {
      color: #515a6e;
    }
  }
}

.view-account {
  background-image: url('@/assets/ztImages/loginBg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.view-account-container {
  position: relative;
  z-index: 99;
}
</style>
