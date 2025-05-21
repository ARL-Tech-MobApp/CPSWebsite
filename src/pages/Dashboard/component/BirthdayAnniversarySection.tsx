import React from 'react';
import moment from 'moment';
import { Employee } from '../types/employee'; // Adjust the import path as needed
interface Props {
    employees: Employee[];
    userProfile: { id: string; fullName: string }; // Adjust this type as needed
  }

const BirthdayAnniversaryComponent: React.FC<Props> = ({ employees, userProfile }) => {
  const today = moment();

  const getDayDiff = (dateString: string) => {
    const todayStart = today.clone().startOf('day');
    const date = moment(dateString);
    const adjustedDate = date.year(today.year()).startOf('day');
    if (adjustedDate.isBefore(todayStart)) {
      adjustedDate.add(1, 'year');
    }
    return adjustedDate.diff(todayStart, 'days');
  };
  

  const matchedEmployee = employees.find(emp => emp.id === userProfile.id);

  const isUserBirthdayToday =
    matchedEmployee?.dob && getDayDiff(matchedEmployee.dob) === 0;
  const isUserAnniversaryToday =
    matchedEmployee?.joiningDate && getDayDiff(matchedEmployee.joiningDate) === 0;

  // Filter other employees (excluding current user)
  const todayBirthdays = employees.filter(
    emp => emp.dob && getDayDiff(emp.dob) === 0 && emp.id !== userProfile.id
  );
  const upcomingBirthdays = employees.filter(
    emp => emp.dob && getDayDiff(emp.dob) > 0 && getDayDiff(emp.dob) <= 4 && emp.id !== userProfile.id
  );
  const recentPastBirthdays = employees.filter(
    emp => emp.dob && getDayDiff(emp.dob) < 0 && getDayDiff(emp.dob) >= -4 && emp.id !== userProfile.id
  );

  const todayAnniversaries = employees.filter(
    emp => emp.joiningDate && getDayDiff(emp.joiningDate) === 0 && emp.id !== userProfile.id
  );
  const upcomingAnniversaries = employees.filter(
    emp => emp.joiningDate && getDayDiff(emp.joiningDate) > 0 && getDayDiff(emp.joiningDate) <= 4 && emp.id !== userProfile.id
  );
  const recentPastAnniversaries = employees.filter(
    emp => emp.joiningDate && getDayDiff(emp.joiningDate) < 0 && getDayDiff(emp.joiningDate) >= -4 && emp.id !== userProfile.id
  );

  return (
    <div>
      {/* 🎉 Personalized Greeting for User */}
      {isUserBirthdayToday && (
       <p>🎉 Happy Birthday, {userProfile.fullName}! 🎂 Wishing you endless happiness, success, and love on your special day. From all of us at the CPS Family — have a fantastic year ahead! 🥳</p>

      
      )}
      {isUserAnniversaryToday && (
       <div>
       <p>🎊 Dear {userProfile.fullName},</p>
     
       <p>Congratulations on your work anniversary! Today marks another remarkable milestone in your journey with the CPS Family, and we couldn’t be more proud to celebrate this moment with you. 🌟 Your presence in our team has made a meaningful difference, and today we honor your hard work, dedication, and the positive spirit you consistently bring to the table.</p>
     
       <p>From your very first day, you’ve shown a deep commitment to excellence and collaboration. Whether it’s achieving goals, helping colleagues, or going the extra mile, your contributions continue to strengthen our organization and inspire those around you. You’ve grown not only in your role but as a respected member of our professional family.</p>
     
       <p>Work anniversaries are more than just a date — they represent growth, loyalty, and impact. We deeply appreciate the time, talent, and energy you've invested in our shared mission. As you celebrate this special day, we want you to know how much your journey means to us and how excited we are to continue building great things together.</p>
     
       <p>Here’s to celebrating your accomplishments and looking forward to many more successful years ahead. Thank you for being an essential part of the CPS Family. Happy Work Anniversary, {userProfile.fullName}! 🎉 May this year bring you more achievements, more learning, and more happiness in all you do. 🥂🎊</p>
     </div>
     
      )}

      {/* 🔜 User Upcoming Events */}
      {matchedEmployee && !isUserBirthdayToday && matchedEmployee.dob && getDayDiff(matchedEmployee.dob) > 0 && getDayDiff(matchedEmployee.dob) <= 4 && (
        <p>🎂 Your birthday is coming up on {moment(matchedEmployee.dob).year(today.year()).format("Do MMM")}!</p>
      )}

      {matchedEmployee && !isUserAnniversaryToday && matchedEmployee.joiningDate && getDayDiff(matchedEmployee.joiningDate) > 0 && getDayDiff(matchedEmployee.joiningDate) <= 4 && (
        <p>🎊 Your work anniversary is coming up on {moment(matchedEmployee.joiningDate).year(today.year()).format("Do MMM")}!</p>
      )}

      {/* 🎂 Birthday Lists */}
      {todayBirthdays.length > 0 && (
        <div>
          <h3>🎂 Today's Birthdays</h3>
          <ul>
            {todayBirthdays.map(emp => (
              <li key={emp.id}>{emp.fullName}</li>
            ))}
          </ul>
        </div>
      )}

      {upcomingBirthdays.length > 0 && (
        <div>
          <h3>📅 Upcoming Birthdays</h3>
          <ul>
            {upcomingBirthdays.map(emp => (
              <li key={emp.id}>
                {emp.fullName} - {moment(emp.dob).year(today.year()).format('Do MMM')}
              </li>
            ))}
          </ul>
        </div>
      )}

      {recentPastBirthdays.length > 0 && (
        <div>
          <h3>⏪ Recent Birthdays</h3>
          <ul>
            {recentPastBirthdays.map(emp => (
              <li key={emp.id}>
                {emp.fullName} - {moment(emp.dob).year(today.year()).format('Do MMM')}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🥳 Work Anniversaries */}
      {todayAnniversaries.length > 0 && (
        <div>
          <h3>🎊 Today's Work Anniversaries</h3>
          <ul>
            {todayAnniversaries.map(emp => (
              <li key={emp.id}>{emp.fullName}</li>
            ))}
          </ul>
        </div>
      )}

      {upcomingAnniversaries.length > 0 && (
        <div>
          <h3>📅 Upcoming Work Anniversaries</h3>
          <ul>
            {upcomingAnniversaries.map(emp => (
              <li key={emp.id}>
                {emp.fullName} - {moment(emp.joiningDate).year(today.year()).format('Do MMM')}
              </li>
            ))}
          </ul>
        </div>
      )}

      {recentPastAnniversaries.length > 0 && (
        <div>
          <h3>⏪ Recent Work Anniversaries</h3>
          <ul>
            {recentPastAnniversaries.map(emp => (
              <li key={emp.id}>
                {emp.fullName} - {moment(emp.joiningDate).year(today.year()).format('Do MMM')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BirthdayAnniversaryComponent;
