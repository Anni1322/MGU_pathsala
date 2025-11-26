export const pathshalaMenu = [
  {
    id: 1,
    name: 'Study Material',
    icon: 'book',
    screen: 'Study',
    color: '#70b0f1', // Lighter blue
  },
  {
    id: 2,
    name: 'Assignment',
    icon: 'file-pen',
    screen: 'Assignment',
    color: '#8cd9a2', // Lighter green
  },
  {
    id: 3,
    name: 'Doubt Session',
    icon: 'comments',
    screen: 'DoubtSession',
    color: '#ffb84d', // Lighter orange
  },
  {
    id: 4,
    name: 'Video Lecture',
    icon: 'video',
    screen: 'Examination',
    color: '#b76bcc', // Lighter purple
  },
  {
    id: 5,
    name: 'Examination',
    icon: 'clipboard-check',
    screen: 'Examination',
    color: '#f66c6b', // Lighter red
  },
];





// export const studentMenu = [
//   {
//     id: 1,
//     name: 'Notification',
//     iconLib: 'EvilIcons',
//     icon: 'bell',
//     screen: 'Notification',
//     color: '#dc143c',
//   },
//   {
//     id: 2,
//     name: 'Syllabus',
//     iconLib: 'FontAwesome6',
//     icon: 'book-open',
//     screen: 'Syllabus',
//     color: '#9932cc',
//   },
//   {
//     id: 3,
//     name: 'Registration Card',
//     iconLib: 'FontAwesome6',
//     icon: 'id-card',
//     screen: 'RegistrationCard',
//   },
//   {
//     id: 4,
//     name: 'Admit Card',
//     iconLib: 'FontAwesome6',
//     icon: 'ticket',
//     screen: 'AdmitCard',
//   },
//   {
//     id: 5,
//     name: 'SRC',
//     iconLib: 'FontAwesome6',
//     icon: 'users',
//     screen: 'SRC',
//   },
//   {
//     id: 6,
//     name: 'PDC',
//     iconLib: 'FontAwesome6',
//     icon: 'graduation-cap',
//     screen: 'PDC',
//   },
//   {
//     id: 7,
//     name: 'Transcript',
//     iconLib: 'FontAwesome6',
//     icon: 'file-alt',
//     screen: 'Menu',
//   },
//   {
//     id: 8,
//     name: 'Profile',
//     iconLib: 'FontAwesome6',
//     icon: 'user',
//     screen: 'Profile',
//   },
//   {
//     id: 9,
//     name: 'FeeReceipt',
//     iconLib: 'FontAwesome6',
//     icon: 'user',
//     screen: 'FeeReceipt',
//   },

//   // {
//   //   id: 8,
//   //   name: 'Profile',
//   //   iconLib: 'FontAwesome6',
//   //   icon: 'user',
//   //   screen: 'Profile',
//   // },
//   // {
//   //   id: 8,
//   //   name: 'Profile',
//   //   iconLib: 'FontAwesome6',
//   //   icon: 'user',
//   //   screen: 'Profile',
//   // },
//   // {
//   //   id: 8,
//   //   name: 'Profile',
//   //   iconLib: 'FontAwesome6',
//   //   icon: 'user',
//   //   screen: 'Profile',
//   // },
// ];




const getColorForMenuItem = (name) => {
  const colors = {
    'Profile': '#432323',   
    'Registraion Card': '#7ec8f1',   
    'Admit Card': '#a89eff',   
    'FeeReceipt': '#E67E22',  
    'Syllabus': '#FE4F2D',  
    'Transcript': '#ffb96e',  
    'Notification': '#3A98B9',   
    'Complaint': '#FFACAC',   
  };
  
  return colors[name] || '#ffffff';   
};

export const studentMenu = [
  {
    id: 1,
    name: 'Profile',
    iconLib: 'FontAwesome6',
    icon: 'user',
    screen: 'Profile',
    color: getColorForMenuItem('Profile'),
    data: ''
  },
  {
    id: 3,
    name: 'Admit Card',
    iconLib: 'FontAwesome6',
    icon: 'ticket',
    screen: 'AdmitCard',
    color: getColorForMenuItem('Admit Card'),
  },
  {
    id: 4,
    name: 'FeeReceipt',
    iconLib: 'FontAwesome6',
    icon: 'file-invoice-dollar',
    screen: 'FeeReceipt',
    color: getColorForMenuItem('FeeReceipt'),
  },
  {
    id: 8,
    name: 'Notification',
    iconLib: 'EvilIcons',
    icon: 'bell',
    screen: 'Notification',
    color: getColorForMenuItem('Notification'),
  },
  {
    id: 2,
    name: 'Registraion Card',
    iconLib: 'FontAwesome6',
    icon: 'users',
    screen: 'RegistraionCardList',
    color: getColorForMenuItem('Registraion Card'),
  },
  {
    id: 7,
    name: 'Transcript',
    iconLib: 'FontAwesome6',
    icon: 'file-alt',
    screen: 'Transcript',
    color: getColorForMenuItem('Transcript'),
  },
  {
    id: 6,
    name: 'Syllabus',
    iconLib: 'FontAwesome6',
    icon: 'book-open',
    screen: 'Syllabus',
    color: getColorForMenuItem('Syllabus'),
  },
  {
    id: 10,
    name: 'Complaint',
    iconLib: 'FontAwesome6',
    icon: 'graduation-cap',
    screen: 'ComplaintScreen',
    color: getColorForMenuItem('Complaint'),
  },
];
