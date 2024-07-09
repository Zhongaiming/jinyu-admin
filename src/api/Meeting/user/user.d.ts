/**
 * MeetingUserControllerList
 */
export interface Request {
  meetingUserDtoFilter?: MeetingUserDto;
  orderParam?: OrderInfo[];
  pageParam?: MyPageParam;
}
export interface UserRequest {
  meetingUserDto: MeetingUserDto;
}

/**
 * MeetingUserDto
 */
export interface MeetingUserDto {
  /**
   * 会议用户Id
   */
  meetingUserId?: string;
  /**
   * 会议用户名称
   */
  meetingUserName?: string;
  /**
   * 声纹文件
   */
  voiceprint?: string;
}

/**
 * OrderInfo
 */
export interface OrderInfo {
  asc?: boolean;
  dateAggregateBy?: string;
  fieldName?: string;
}

/**
 * MyPageParam
 */
export interface MyPageParam {
  pageNum?: number;
  pageSize?: number;
}

/**
 * ResponseResult«MyPageData«MeetingUserVo»»
 */
export interface Response {
  code?: number;
  data?: MyPageDataMeetingUserVo;
  dataPermId?: string;
  errorCode?: string;
  errorMessage?: string;
  message?: string;
  success?: boolean;
  type?: string;
}

/**
 * MyPageData«MeetingUserVo»
 */
export interface MyPageDataMeetingUserVo {
  appCheckList?: string[];
  dataList?: MeetingUserVo[];
  dataPermId?: string;
  pageCount?: number;
  pageNum?: number;
  pageSize?: number;
  roleName?: string;
  totalCount?: number;
}

/**
 * MeetingUserVo
 */
export interface MeetingUserVo {
  /**
   * 是否上传声纹文件
   */
  isUploadVoiceprint?: boolean;
  /**
   * 会议用户Id
   */
  meetingUserId?: string;
  /**
   * 会议用户名称
   */
  meetingUserName?: string;
  /**
   * 声纹文件
   */
  voiceprint?: string;
}
