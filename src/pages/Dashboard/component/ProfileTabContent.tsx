import React from "react";
import RandomQuote from "../../../components/RandomQuote/RandomQuote";
import ProfileSection from "./ProfileSection";
import BirthdayAnniversarySection from "./BirthdayAnniversarySection";
import { useDashboardLogic } from "../hooks/useDashboardLogic";

const ProfileTabContent: React.FC = () => {
  const { profileFields, employees, userProfile } = useDashboardLogic();

  return (
    <>
      <RandomQuote />
      <ProfileSection profileFields={profileFields} />
      {userProfile && (
        <BirthdayAnniversarySection
          employees={employees}
          userProfile={{
            id: userProfile.id,
            fullName: userProfile.fullName,
          }}
        />
      )}
    </>
  );
};

export default ProfileTabContent;
