# 1.9.0 (2024-04-18)


### Bug Fixes

* 更换菜单属性位置，修复菜单不会自动展开 ([62d1437](https://example.com/commits/62d14374aec7af69a07e197512ad93872c8d9a9d))
* 后端token过期，请求信息失败后页面卡住 ([068858e](https://example.com/commits/068858ee61cbb990b73e96d2669da11d79604416))
* 去除关闭所有后自动跳转根页面 ([c76254d](https://example.com/commits/c76254d6be93f5f452067d826659056ce35fba1c))
* 修复菜单未完全展开 ([5e5ccf5](https://example.com/commits/5e5ccf5991f23b7e21b6a0695bd31124d9d4add6))
* 修复点击应用后路由需要手动切换 ([9b6ba8f](https://example.com/commits/9b6ba8fd71ae5547d82bb346ea68001243699397))
* 修复关闭当前tab的bug ([e2e45e5](https://example.com/commits/e2e45e58207de498dea60f1d234efb6be275c788))
* 修复关闭全部后没有跳转的问题 ([bf97439](https://example.com/commits/bf9743976a5f40dabc81b93a16276e8a0287c59d))
* 修复后端返回路由未排序的问题 ([741502c](https://example.com/commits/741502c9cfbab8482cf94e2574e2f4066268ce54))
* 修复可能是appId获取导致的当前应用异常 ([c71fbcc](https://example.com/commits/c71fbcc39093e78649b28a259fb6fd0e3c504efe))
* 修复可以关闭当前固定路由tab的bug ([8de89dc](https://example.com/commits/8de89dc7164dbbba7d1a3b926f17f0cab20e7fb3))
* 修复面包屑显示了隐藏菜单 ([b02c8b2](https://example.com/commits/b02c8b2e5d1a8c773010bf944d20b2b56cf69a1e))
* 修复其他位置切换时，没有更新应用列表状态 ([28f4b6e](https://example.com/commits/28f4b6eb57c37939fcfeffa11bb4b32c295dce56))
* 修复清除错误 ([ac7967d](https://example.com/commits/ac7967da170640a5b76fa896f1d18717a93b3f73))
* 修复清除tab时没有清除固定路由 ([ded1e53](https://example.com/commits/ded1e533169d96c21a76f9349d6054650d5835b3))
* 修复权限字中的筛选字段不一致 ([9c32221](https://example.com/commits/9c322217380ee3a4615d446431f2a4d5dbd2a0d7))
* 修复时间格式化使用的字段错误 ([c8c5973](https://example.com/commits/c8c597374cdeafc4fba211c75e46e346710ab66f))
* 修复首次进入无法进行快捷方式跳转 ([72dd0d1](https://example.com/commits/72dd0d19f9b6b1d9f2f1d9506c7153cc5b8c951e))
* 修复树选择器的回显 ([d6e2bb2](https://example.com/commits/d6e2bb225b973e6f9cdc70072844b7197cc2378c))
* 修复新闻详情数据没有显示 ([6cab1f4](https://example.com/commits/6cab1f40c6e53c994c0553f982afbbf5ad1f04af))
* 修复应用图标第一个进入时加载失败 ([f0273f2](https://example.com/commits/f0273f2c9f2e3170c354d0d68b0ea671ab9e4c5e))
* 修复重定向页面没有跟随应用变化 ([5d9ef44](https://example.com/commits/5d9ef444683878edd4c88cf5f0466b636f369759))
* 修复重置不生效的问题 ([a64cf75](https://example.com/commits/a64cf755d28547e0ca15ebbd318c6668172a8394))
* 修复appId异常的问题 ([f9152b0](https://example.com/commits/f9152b00adcb0806007cedd204236de46d75702a))
* 修复tabView数据刷新后丢失 ([0d73a5a](https://example.com/commits/0d73a5a3c5b6f854d1134cb620c63d5342123f92))


### Code Refactoring

* 项目初始化 ([176f0f5](https://example.com/commits/176f0f558e4b91cf3ace14fb90253922ee1d3a31))


### Continuous Integration

* **.eslintrc.js:** 删除了ecmaFeatures和jsxPragma配置 ([c902531](https://example.com/commits/c902531a4f418b500057f992bfae455f27dc3e0e))


### Features

* 暗黑模式样式修改 ([c5f2b55](https://example.com/commits/c5f2b55fb7036b6808be2f999a828ea1f2603789))
* 编辑新增用户+接口前缀 ([31024ca](https://example.com/commits/31024ca0e4bbe0174f294d106762c1f14a8f6ed0))
* 部门岗位+封装表格排序+封装表格单元格编辑 ([af3a535](https://example.com/commits/af3a53511e14769cfa9dc215c58dfe8dc7c6d475))
* 菜单的配置页 ([79548a6](https://example.com/commits/79548a629b1be488e5bac6f037b9729c2ac057b5))
* 菜单树工具栏添加同级菜单 ([78021d6](https://example.com/commits/78021d64875f79304547be0f4313ec77d10fcddb))
* 菜单添加新的字段 ([6d6255d](https://example.com/commits/6d6255d96107496949172d87f78c209213285847))
* 菜单样式修改 ([2c2ac14](https://example.com/commits/2c2ac149f40a61a1a0a17b644357b3704c3b42ce))
* 菜单样式修改 ([6ce182c](https://example.com/commits/6ce182c0782b40b318b2510f4b1cd58760e9a13b))
* 点击应用切换后的展示应用logo和title ([b3d1945](https://example.com/commits/b3d19453cd6ab390fc3364a260eb04592b64ecb4))
* 合并冲突 2024/3/22 10:15 ([ce7b400](https://example.com/commits/ce7b400e28995b3ae23e96dd53747a937a0f8da8))
* 合并冲突 2024/3/22 10:36 ([ce6dfd4](https://example.com/commits/ce6dfd48ccfae4147981ae616b634b07dd75268e))
* 会议应用的会议档案列表 ([1ef4dde](https://example.com/commits/1ef4ddec04df333e782793f5a0df77e34b21de0e))
* 临时添加首页消息的点击事件 ([cf65616](https://example.com/commits/cf65616f935b0304e1bca27f9e44acd4adfe7fa8))
* 临时添加新闻列表点击事件 ([dd25091](https://example.com/commits/dd25091502b1ed039ced99fb525fcb00cb096f66))
* 切换应用和路由(具体路由加载待完全测试) ([352330e](https://example.com/commits/352330ee1fa1a1331689ab3e48baa630cd129321))
* 全局弹窗+个人信息修改 ([73a350a](https://example.com/commits/73a350a62e4c24c26a9ac23d89c7a1f29814ca74))
* 权限字列表修改别名 ([2972868](https://example.com/commits/29728685935f7ac53690dbdaea782f2b70dd2a74))
* 添加菜单树工具栏 ([60014bb](https://example.com/commits/60014bb092230396d332b695e274e4d46dc9feb1))
* 添加更多应用列表 ([aea2138](https://example.com/commits/aea21382928e8350a3ce288e9ecc7f461de2a8af))
* 添加会议首页布局 ([2c7bea5](https://example.com/commits/2c7bea5816785af6b8db164ffc8f1866d64eb192))
* 添加角色管理（未完成） ([7a0d37d](https://example.com/commits/7a0d37dd6cc44ca282bbca3673d4dadbf80c897b))
* 添加事项的列表(需要修改样式) ([c2e9063](https://example.com/commits/c2e906375d63738acd84a1b1ff04b534905914cf))
* 添加消息管理的文件 ([eb42df4](https://example.com/commits/eb42df4298cfd71245ce419a589625063efc34ea))
* 添加新闻列表和新闻中心（样式和布局待修改） ([c7976b6](https://example.com/commits/c7976b6f88fa65e50f50d9bada930047f6bb5001))
* 添加验证权限的通用路由 ([ffe27a7](https://example.com/commits/ffe27a7f309b18f220513e9b11291203340c4a99))
* 添加一个简单的新闻详情页（样式待修改） ([56361bc](https://example.com/commits/56361bce6aa366ac8329fbd13d5150d94ced47d6))
* 添加应用管理页面跳转菜单配置 ([228373d](https://example.com/commits/228373d2d95252a7e52b77f7fbab87480812ef57))
* 系统配置√ ([766c508](https://example.com/commits/766c50892dbaf3a576b69aed2f1d379ad3398cda))
* 系统主题颜色 ([45c26ff](https://example.com/commits/45c26ff876ac8d88a661b3696437d6a23c8a7ba3))
* 消息列表和消息中心（需要修改布局和样式） ([681fb2e](https://example.com/commits/681fb2e482a70fc57dd37c8e763bd82d4908bc69))
* 新增图标选择组件，更换菜单中的图标选择 ([02945d1](https://example.com/commits/02945d136733d0c79b1b702768b054e4f1f15a66))
* 新增应用管理 ([6dd3963](https://example.com/commits/6dd39631edef50ac692fd92a94154a25364688d9))
* 修复混合菜单模式布局BUG ([f47107c](https://example.com/commits/f47107c4723242f17c202ff63419dfbd48d1800e))
* 修改菜单及菜单跳转方式 ([7866834](https://example.com/commits/78668340c902ef762e1e181c53c71329e0db4324))
* 修改工作台布局并放入消息列表(假数据无法跳转) ([06d0291](https://example.com/commits/06d0291079b8bb9d49b63775736c7cae28d25ac7))
* 修改系统配置样式+岗位升迁与记录 ([c946ed3](https://example.com/commits/c946ed3cbd5dddbdbb0877c819f8b735181523fc))
* 修改一些配置项已经对接登录接口 ([259bcea](https://example.com/commits/259bcea271500c2cf1b51cc42977fdaa48f4b2c4))
* 选人选部门组件弹窗 ([3f90233](https://example.com/commits/3f90233d88ca5ba9bf917d1c105ab194f25d54c9))
* 引入vxe-table ([2a9f334](https://example.com/commits/2a9f33419acd01d928f987f2fe968c1cc058b1e4))
* 应用管理+角色管理+部门管理（完成） ([4e0cb0a](https://example.com/commits/4e0cb0a247367d2459fb4892f46c108c0731b904))
* 在本地保存快捷方式，并在工作台跳转 ([5bf5ff4](https://example.com/commits/5bf5ff42dcbfbb506dd79ce0775020ebe5e7f96b))
* 在菜单页绑定权限字 ([c261c33](https://example.com/commits/c261c33ec374d303cc1887669db20be004cef96f))
* 展示当前用户的应用列表 ([87266f5](https://example.com/commits/87266f573425368870fab64a5b1b5f77126c900a))
* 站外应用直接跳转 ([af12f30](https://example.com/commits/af12f30f4279fd34415fe96ac42737abee50e6ea))
* 字典管理 ([c96576d](https://example.com/commits/c96576d73998e244122adc49ae6b98d81fc30d09))


### BREAKING CHANGES

* **.eslintrc.js:** 如果后续需要使用tsx或jsx，可能需要添加回来
* 项目初始化



