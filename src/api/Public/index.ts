import { http } from '@/utils/http/axios';
import { useGlobSetting } from '@/hooks/setting';
const { uploadUrl } = useGlobSetting();
/**
 * @description: 通用上传文件
 */
export function uploadFilePublic({ file, filename, asImage }) {
  return http.uploadFile(
    {
      url: `${uploadUrl}/common/upload/upload`,
    },
    { file, name: 'uploadFile', filename, data: { asImage } }
  );
}
