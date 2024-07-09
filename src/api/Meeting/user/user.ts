/**
 * @description 会议中专属用户模块
 */
import { http } from '@/utils/http/axios';
import { Request, MyPageDataMeetingUserVo, UserRequest } from './user.d';

/**
 * @description : 获取用户
 */
export function addMeetingUser(data: UserRequest) {
  return http.request<MyPageDataMeetingUserVo>({
    url: '/admin/app/meetingUser/add',
    method: 'POST',
    data,
  });
}
/**
 * @description : 修改用户
 */
export function updateMeetingUser(data: UserRequest) {
  return http.request<MyPageDataMeetingUserVo>({
    url: '/admin/app/meetingUser/update',
    method: 'POST',
    data,
  });
}
/**
 * @description : 获取用户列表
 */
export function getMeetingUserList(data: Request) {
  return http.request<MyPageDataMeetingUserVo>({
    url: '/admin/app/meetingUser/list',
    method: 'POST',
    data,
  });
}
/**
 * @description : 删除用户
 */
export function deleteMeetingUserById(data: { meetingUserId: string }) {
  return http.request({
    url: '/admin/app/meetingUser/delete',
    method: 'POST',
    data,
  });
}
