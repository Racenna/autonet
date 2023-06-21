import { useAppSelector } from "../../redux/store";
import { FullScreenLoader } from "../../shared/components/FullscreenLoader";
import { ProfileUpdate } from "../../components/ProfileUpdate";
import { ProfileInfo } from "../../components/ProfileInfo";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export const ProfilePage = () => {
  const location = useLocation();

  const currentUserInfo = useAppSelector((state) => state.user.user);
  const isUpdate = useAppSelector((state) => state.user.isEditProfile);

  useEffect(() => {
    localStorage.setItem("currentRoute", location.pathname);
  }, []);

  if (!currentUserInfo) return <FullScreenLoader />;

  return isUpdate ? (
    <ProfileUpdate user={currentUserInfo} />
  ) : (
    <ProfileInfo user={currentUserInfo} />
  );
};
