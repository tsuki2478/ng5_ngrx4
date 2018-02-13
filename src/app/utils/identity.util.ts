import { GB2260 } from './identity.data';

export const extractInfo = (idNo: string) => {
  const addrPart = idNo.substring(0, 6); // 前六位地址码
  const birthPart = idNo.substring(6, 14); // 八位生日
  // const genderPart = parseInt(idNo.substring(14, 17), 10); // 性别

  return {
    addrCode: addrPart,
    dateOfBirth: birthPart,
    // gender: genderPart % 2 !== 0
  };
}

// 如果在GB2260资料库找不到，就是假的
export const isValidAddr = (addr: string) => {
  return GB2260[addr] !== undefined;
}

// 身份证 前6位地址代表。   前2位是省，2-4是城市， 4-6是县区。 如果没有则00
export const getAddrByCode = (code: string) => {
  const province = GB2260[code.substring(0, 2) + '0000'];
  const city = GB2260[code.substring(0, 4) + '00'].replace(province, '');
  const district = GB2260[code].replace(province + city, '');

  return {
    province: province,
    city: city,
    district: district
  };
};
