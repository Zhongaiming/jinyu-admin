import { useGlobSetting } from '@/hooks/setting';
import { http, longTimeHttp } from '@/utils/http/axios';
const { uploadUrl } = useGlobSetting();

/**
 * @description: 保存会议录音文件
 */
export function saveWavFile({ file, filename = 'meeting' }) {
  return http.uploadFile(
    {
      url: `${uploadUrl}/common/upload/upload`,
    },
    { file, name: 'uploadFile', filename: `${filename}.wav`, data: { asImage: false } }
  );
}
/**
 * @description: 获取会议档案列表
 */
export function getMeetingArchivesList(data) {
  return http.request({
    url: '/admin/app/meeting/list',
    method: 'POST',
    data,
  });
}
/**
 * @description: 获取会议档案列表
 */
export function sendMeetingUsers(data) {
  return http.request({
    url: '/admin/app/meeting/sendMeetingUserList',
    method: 'POST',
    data,
  });
}

/**
 * @description : 添加会议
 */
export function addMeeting(data) {
  return http.request({
    url: '/admin/app/meeting/add',
    method: 'POST',
    data,
  });
}
/**
 * @description : 更新会议
 */
export function updateMeeting(data) {
  return http.request({
    url: '/admin/app/meeting/update',
    method: 'POST',
    data,
  });
}
/**
 * @description: 生成纪要内容
 */
export function createSummary(params) {
  return longTimeHttp.request({
    url: '/admin/app/meeting/createSummary',
    method: 'GET',
    params,
  });
}
/**
 * @description: 生成纪要内容
 */
export function getMeetingDataById(params) {
  return longTimeHttp.request({
    url: '/admin/app/meeting/view',
    method: 'GET',
    params,
  });
}
/**
 * @description: 保存纪要为文件
 */
export function saveSummaryFile(params) {
  return http.request({
    url: '/admin/app/meeting/saveSummaryFile',
    method: 'POST',
    params,
  });
}
/**
 * @description: 保存纪要为文件
 */
export function getTapFileByName(params) {
  return http.request({
    url: '/admin/app/meeting/getMeetingFilePath',
    method: 'POST',
    params,
  });
}
/**
 * @description: 获取会议日历列表
 */
export function getMeetingDateList(params) {
  return http.request({
    url: '/admin/app/meeting/listByDate',
    method: 'GET',
    params,
  });
}
