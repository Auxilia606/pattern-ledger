export type NaverProfileResponse = {
  resultcode: string;
  message: string;
  response: {
    id: string;
    email?: string;
    name?: string;
    profile_image?: string;
  };
};

export type NaverProfile = {
  id: string;
  email?: string;
  name?: string;
  profileImage?: string;
};

export type NaverAuthResult = {
  provider: 'naver';
  accessToken: string;
  refreshToken: string;
  profile: NaverProfile;
};
